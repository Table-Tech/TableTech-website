import securityManager from './security';
import cookieManager from './cookieManager';

interface SecureRequestOptions extends RequestInit {
  skipCSRF?: boolean;
  rateLimit?: {
    key: string;
    maxAttempts?: number;
    windowMs?: number;
  };
  validateResponse?: boolean;
}

class SecureAPI {
  private static instance: SecureAPI;
  private readonly baseURL: string;
  private readonly timeout: number;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://api.tabletech.nl';
    this.timeout = 30000; // 30 seconds
  }

  public static getInstance(): SecureAPI {
    if (!SecureAPI.instance) {
      SecureAPI.instance = new SecureAPI();
    }
    return SecureAPI.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error');
      
      // Log security events for specific status codes
      if (response.status === 403) {
        securityManager.logSecurityEvent('CSRF_FAIL', { url: response.url });
      } else if (response.status === 429) {
        securityManager.logSecurityEvent('RATE_LIMIT', { url: response.url });
      }
      
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  private createTimeoutSignal(ms: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }

  public async request<T = any>(
    endpoint: string,
    options: SecureRequestOptions = {}
  ): Promise<T> {
    // Rate limiting
    if (options.rateLimit) {
      const canProceed = securityManager.rateLimit(
        options.rateLimit.key,
        options.rateLimit.maxAttempts,
        options.rateLimit.windowMs
      );
      
      if (!canProceed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }

    // Build URL
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Prepare headers
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    // Add CSRF token for state-changing requests
    if (!options.skipCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method || 'GET')) {
      const csrfToken = securityManager.ensureCSRFToken();
      headers.set('X-CSRF-Token', csrfToken);
    }

    // Add session token if available
    const sessionToken = cookieManager.getCookie('tabletech_session', true);
    if (sessionToken) {
      headers.set('X-Session-Token', sessionToken);
    }

    // Sanitize body data if present
    let body = options.body;
    if (body && typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        const sanitized = securityManager.sanitizeFormData(parsed);
        
        // Check for suspicious activity
        if (securityManager.detectSuspiciousActivity(parsed)) {
          securityManager.logSecurityEvent('SUSPICIOUS_ACTIVITY', { 
            url,
            data: parsed 
          });
          throw new Error('Suspicious activity detected');
        }
        
        body = JSON.stringify(sanitized);
      } catch (e) {
        // Body is not JSON, keep as is
      }
    }

    // Prepare final request options
    const requestOptions: RequestInit = {
      ...options,
      headers,
      body,
      credentials: 'same-origin',
      signal: options.signal || this.createTimeoutSignal(this.timeout)
    };

    try {
      const response = await fetch(url, requestOptions);
      
      // Validate response if requested
      if (options.validateResponse) {
        const clonedResponse = response.clone();
        const responseText = await clonedResponse.text();
        
        if (securityManager.detectSuspiciousActivity(responseText)) {
          securityManager.logSecurityEvent('XSS_ATTEMPT', { 
            url,
            response: responseText.substring(0, 1000) 
          });
          throw new Error('Suspicious response detected');
        }
      }
      
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  public async get<T = any>(
    endpoint: string,
    options?: Omit<SecureRequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<SecureRequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public async put<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<SecureRequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public async delete<T = any>(
    endpoint: string,
    options?: Omit<SecureRequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<SecureRequestOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // Secure form submission with validation
  public async submitForm<T = any>(
    endpoint: string,
    formData: Record<string, any>,
    validationRules?: Record<string, (value: any) => boolean>
  ): Promise<T> {
    // Validate form data
    if (validationRules) {
      for (const [field, validator] of Object.entries(validationRules)) {
        if (!validator(formData[field])) {
          throw new Error(`Validation failed for field: ${field}`);
        }
      }
    }

    // Sanitize form data
    const sanitizedData = securityManager.sanitizeFormData(formData);

    // Submit with rate limiting
    return this.post<T>(endpoint, sanitizedData, {
      rateLimit: {
        key: `form_${endpoint}`,
        maxAttempts: 3,
        windowMs: 60000 // 1 minute
      },
      validateResponse: true
    });
  }

  // Secure file upload
  public async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<T> {
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (file.size > maxSize) {
      throw new Error('File size exceeds maximum allowed size');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      const sanitizedData = securityManager.sanitizeFormData(additionalData);
      Object.entries(sanitizedData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    // Upload with CSRF token
    const csrfToken = securityManager.ensureCSRFToken();
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData as any,
      headers: {
        'X-CSRF-Token': csrfToken
      },
      skipCSRF: true, // We're manually adding it
      rateLimit: {
        key: `upload_${endpoint}`,
        maxAttempts: 5,
        windowMs: 300000 // 5 minutes
      }
    });
  }

  // Secure authentication
  public async authenticate(
    email: string,
    password: string
  ): Promise<{ token: string; user: any }> {
    // Validate inputs
    if (!securityManager.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Hash password before sending (additional layer)
    const hashedPassword = securityManager.hashPassword(password);

    try {
      const response = await this.post<{ token: string; user: any }>(
        '/auth/login',
        { email, password: hashedPassword },
        {
          rateLimit: {
            key: `auth_${email}`,
            maxAttempts: 3,
            windowMs: 900000 // 15 minutes
          }
        }
      );

      // Store session securely
      if (response.token) {
        cookieManager.setCookie('tabletech_session', response.token, {
          expires: 1, // 1 day
          secure: true,
          sameSite: 'strict'
        }, true); // Encrypted
      }

      return response;
    } catch (error) {
      securityManager.logSecurityEvent('AUTH_FAIL', { email });
      throw error;
    }
  }

  // Logout
  public async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } finally {
      // Clear all cookies except necessary ones
      cookieManager.clearAllCookies(true);
      
      // Clear local storage
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
    }
  }

  // Refresh session
  public async refreshSession(): Promise<boolean> {
    try {
      const response = await this.post<{ token: string }>('/auth/refresh');
      
      if (response.token) {
        cookieManager.setCookie('tabletech_session', response.token, {
          expires: 1,
          secure: true,
          sameSite: 'strict'
        }, true);
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }
}

export default SecureAPI.getInstance();