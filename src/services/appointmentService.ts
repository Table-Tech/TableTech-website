// Modern appointment service using the new secure API

interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  restaurant?: string;
  preferredDate?: string;
  preferredTime?: string;
  subject?: string;
  message: string;
  consentMarketing?: boolean;
  pageUrl?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  hp?: string; // Honeypot
  formRenderTs?: number;
  captchaToken?: string;
}

interface AppointmentResponse {
  ok: boolean;
  requestId?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Generate UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Get API URL based on environment
const getApiUrl = (): string => {
  // Check if we're in development by looking at the hostname
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return 'https://tabletech.nl/api';
};

// Submit appointment to the secure API
export const submitAppointment = async (data: AppointmentData): Promise<AppointmentResponse> => {
  const apiUrl = getApiUrl();
  const idempotencyKey = generateUUID();
  
  // Add anti-spam fields
  const enrichedData = {
    ...data,
    pageUrl: window.location.href,
    utm: getUTMParameters(),
  };
  
  try {
    const response = await fetch(`${apiUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': idempotencyKey,
        'x-client-version': '1.0.0',
      },
      body: JSON.stringify(enrichedData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('API error:', result);
      return result;
    }
    
    return result;
  } catch (error) {
    console.error('Network error:', error);
    return {
      ok: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Kon geen verbinding maken met de server. Probeer het later opnieuw.',
      },
    };
  }
};

// Get UTM parameters from URL
const getUTMParameters = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  };
};

// Load Cloudflare Turnstile
export const loadTurnstile = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

// Render Turnstile widget
export const renderTurnstile = (elementId: string, siteKey: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.turnstile) {
      reject(new Error('Turnstile not loaded'));
      return;
    }
    
    window.turnstile.render(`#${elementId}`, {
      sitekey: siteKey,
      callback: (token: string) => resolve(token),
      'error-callback': () => reject(new Error('Turnstile verification failed')),
      theme: 'light',
      language: 'nl',
    });
  });
};

// TypeScript declarations for Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (selector: string, options: Record<string, unknown>) => void;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}