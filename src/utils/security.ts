import cookieManager from './cookieManager';
import CryptoJS from 'crypto-js';

export class SecurityManager {
  private static instance: SecurityManager;
  private readonly CSP_NONCE_LENGTH = 16;

  private constructor() {
    this.initializeSecurityHeaders();
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private initializeSecurityHeaders(): void {
    if (typeof window !== 'undefined') {
      // Set security-related meta tags
      this.setMetaTag('referrer', 'strict-origin-when-cross-origin');
      
      // Initialize CSRF token
      this.ensureCSRFToken();
    }
  }

  private setMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  public generateNonce(): string {
    return CryptoJS.lib.WordArray.random(this.CSP_NONCE_LENGTH).toString();
  }

  public getCSPHeader(nonce: string): string {
    const directives = [
      `default-src 'self'`,
      `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com`,
      `style-src 'self' 'unsafe-inline'`, // Required for Tailwind
      `img-src 'self' data: https: blob:`,
      `font-src 'self' data: https://r2cdn.perplexity.ai`,
      `connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://api.tabletech.nl https://tabletech.nl http://localhost:3002 ws://localhost:* wss://localhost:*`,
      `frame-src 'self' https://www.youtube.com https://player.vimeo.com https://challenges.cloudflare.com`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `upgrade-insecure-requests`,
      `block-all-mixed-content`
    ];

    return directives.join('; ');
  }

  public sanitizeInput(input: string): string {
    // Remove any HTML tags and scripts
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  public validatePhone(phone: string): boolean {
    // Dutch and international phone numbers
    const phoneRegex = /^(\+31|0031|0)[1-9][0-9]{8}$|^\+[1-9][0-9]{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  }

  public validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  public ensureCSRFToken(): string {
    let token = cookieManager.getCSRFToken();
    if (!token) {
      token = cookieManager.generateCSRFToken();
    }
    return token;
  }

  public addCSRFToRequest(request: RequestInit): RequestInit {
    const token = this.ensureCSRFToken();
    
    const headers = new Headers(request.headers || {});
    headers.set('X-CSRF-Token', token);
    
    return {
      ...request,
      headers,
      credentials: 'same-origin'
    };
  }

  public validateCSRFToken(token: string): boolean {
    return cookieManager.validateCSRFToken(token);
  }

  public hashPassword(password: string, salt?: string): string {
    const actualSalt = salt || CryptoJS.lib.WordArray.random(128/8).toString();
    const hash = CryptoJS.PBKDF2(password, actualSalt, {
      keySize: 256/32,
      iterations: 10000
    });
    return `${actualSalt}:${hash.toString()}`;
  }

  public verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt] = hashedPassword.split(':');
    const newHash = this.hashPassword(password, salt);
    return newHash === hashedPassword;
  }

  public generateSecureRandomString(length: number = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  public encryptData(data: unknown, key?: string): string {
    const jsonString = JSON.stringify(data);
    const encryptionKey = key || import.meta.env.VITE_ENCRYPTION_KEY || 'TableTech-Default-Key';
    return CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
  }

  public decryptData<T>(encryptedData: string, key?: string): T | null {
    try {
      const encryptionKey = key || import.meta.env.VITE_ENCRYPTION_KEY || 'TableTech-Default-Key';
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString) as T;
    } catch {
      return null;
    }
  }

  public rateLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    const now = Date.now();
    const storageKey = `rate_limit_${key}`;
    
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : { attempts: [], blockedUntil: 0 };
    
    // Check if currently blocked
    if (data.blockedUntil > now) {
      return false;
    }
    
    // Remove old attempts outside the window
    data.attempts = data.attempts.filter((timestamp: number) => 
      now - timestamp < windowMs
    );
    
    // Check if limit exceeded
    if (data.attempts.length >= maxAttempts) {
      data.blockedUntil = now + windowMs;
      localStorage.setItem(storageKey, JSON.stringify(data));
      return false;
    }
    
    // Add current attempt
    data.attempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    return true;
  }

  public clearRateLimit(key: string): void {
    localStorage.removeItem(`rate_limit_${key}`);
  }

  public detectSuspiciousActivity(request: Record<string, unknown>): boolean {
    // Check for common attack patterns
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\(/gi,
      /document\.cookie/gi,
      /window\.location/gi,
      /<iframe/gi,
      /base64,/gi,
      /union.*select/gi,
      /drop.*table/gi,
      /insert.*into/gi,
      /select.*from/gi
    ];

    const requestString = JSON.stringify(request).toLowerCase();
    
    return suspiciousPatterns.some(pattern => pattern.test(requestString));
  }

  public sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeFormData(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  public generateSessionToken(): string {
    const token = this.generateSecureRandomString(32);
    const timestamp = Date.now();
    const signature = CryptoJS.HmacSHA256(
      `${token}:${timestamp}`,
      import.meta.env.VITE_SESSION_SECRET || 'TableTech-Session-Secret'
    ).toString();
    
    return `${token}:${timestamp}:${signature}`;
  }

  public validateSessionToken(sessionToken: string): boolean {
    try {
      const [token, timestamp, signature] = sessionToken.split(':');
      const expectedSignature = CryptoJS.HmacSHA256(
        `${token}:${timestamp}`,
        import.meta.env.VITE_SESSION_SECRET || 'TableTech-Session-Secret'
      ).toString();
      
      // Check signature
      if (signature !== expectedSignature) {
        return false;
      }
      
      // Check timestamp (24 hour validity)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000;
      
      return now - tokenTime < maxAge;
    } catch {
      return false;
    }
  }

  public getSecurityHeaders(): Record<string, string> {
    const nonce = this.generateNonce();
    
    return {
      'Content-Security-Policy': this.getCSPHeader(nonce),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-Download-Options': 'noopen',
      'X-DNS-Prefetch-Control': 'off',
      'CSP-Nonce': nonce
    };
  }

  public logSecurityEvent(
    eventType: 'AUTH_FAIL' | 'CSRF_FAIL' | 'RATE_LIMIT' | 'SUSPICIOUS_ACTIVITY' | 'XSS_ATTEMPT',
    details: Record<string, unknown>
  ): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store in localStorage for now (in production, send to server)
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem('security_events', JSON.stringify(events));
    
    // In production, also send to server
    if (import.meta.env.PROD) {
      // Send to logging endpoint
      fetch('/api/security/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.ensureCSRFToken()
        },
        body: JSON.stringify(event)
      }).catch(() => {
        // Silently fail to not disrupt user experience
      });
    }
  }
}

export default SecurityManager.getInstance();