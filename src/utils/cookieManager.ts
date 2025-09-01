import Cookies from 'js-cookie';
import * as CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_COOKIE_ENCRYPTION_KEY || 'TableTech-2024-SecureKey-Default';

export enum CookieCategory {
  NECESSARY = 'necessary',
  FUNCTIONAL = 'functional',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PERFORMANCE = 'performance'
}

export interface CookieDefinition {
  name: string;
  category: CookieCategory;
  provider: string;
  purpose: string;
  duration: string;
  type: 'first-party' | 'third-party';
  encrypted?: boolean;
}

export const COOKIE_DEFINITIONS: CookieDefinition[] = [
  // Necessary Cookies
  {
    name: 'tabletech_session',
    category: CookieCategory.NECESSARY,
    provider: 'TableTech',
    purpose: 'Maintains user session during website visit',
    duration: 'Session',
    type: 'first-party',
    encrypted: true
  },
  {
    name: 'csrf_token',
    category: CookieCategory.NECESSARY,
    provider: 'TableTech',
    purpose: 'Protects against Cross-Site Request Forgery attacks',
    duration: 'Session',
    type: 'first-party',
    encrypted: true
  },
  {
    name: 'cookieconsent_status',
    category: CookieCategory.NECESSARY,
    provider: 'TableTech',
    purpose: 'Stores cookie consent preferences',
    duration: '12 months',
    type: 'first-party'
  },
  
  // Functional Cookies
  {
    name: 'i18nextLng',
    category: CookieCategory.FUNCTIONAL,
    provider: 'TableTech',
    purpose: 'Stores language preference (NL/EN)',
    duration: '12 months',
    type: 'first-party'
  },
  {
    name: 'timezone',
    category: CookieCategory.FUNCTIONAL,
    provider: 'TableTech',
    purpose: 'Stores user timezone for correct time display',
    duration: '30 days',
    type: 'first-party'
  },
  {
    name: 'form_data_temp',
    category: CookieCategory.FUNCTIONAL,
    provider: 'TableTech',
    purpose: 'Temporarily stores form data to prevent data loss',
    duration: 'Session',
    type: 'first-party',
    encrypted: true
  },
  
  // Analytics Cookies
  {
    name: '_ga',
    category: CookieCategory.ANALYTICS,
    provider: 'Google Analytics',
    purpose: 'Distinguishes unique users',
    duration: '2 years',
    type: 'first-party'
  },
  {
    name: '_gid',
    category: CookieCategory.ANALYTICS,
    provider: 'Google Analytics',
    purpose: 'Distinguishes unique users',
    duration: '24 hours',
    type: 'first-party'
  },
  {
    name: '_gat_gtag_*',
    category: CookieCategory.ANALYTICS,
    provider: 'Google Analytics',
    purpose: 'Throttles request rate',
    duration: '1 minute',
    type: 'first-party'
  },
  {
    name: '_ga_*',
    category: CookieCategory.ANALYTICS,
    provider: 'Google Analytics 4',
    purpose: 'Stores session state and campaign info',
    duration: '2 years',
    type: 'first-party'
  },
  
  // Marketing Cookies (Future implementation)
  {
    name: '_fbp',
    category: CookieCategory.MARKETING,
    provider: 'Facebook/Meta',
    purpose: 'Facebook Pixel for ad tracking',
    duration: '3 months',
    type: 'third-party'
  },
  {
    name: 'IDE',
    category: CookieCategory.MARKETING,
    provider: 'Google/Doubleclick',
    purpose: 'Google Ads remarketing',
    duration: '13 months',
    type: 'third-party'
  },
  
  // Performance Cookies
  {
    name: '__cf_bm',
    category: CookieCategory.PERFORMANCE,
    provider: 'Cloudflare',
    purpose: 'Bot management and security',
    duration: '30 minutes',
    type: 'first-party'
  }
];

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  performance: boolean;
  timestamp: number;
  version: string;
}

class CookieManager {
  private static instance: CookieManager;
  private consent: CookieConsent | null = null;
  private readonly CONSENT_COOKIE = 'cookieconsent_status';
  private readonly CONSENT_VERSION = '1.0.0';
  private readonly SECURE_FLAGS = {
    secure: true,
    sameSite: 'strict' as const,
    expires: 365
  };

  private constructor() {
    this.loadConsent();
    this.initializeCSRF();
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  private initializeCSRF(): void {
    if (!this.getCSRFToken()) {
      this.generateCSRFToken();
    }
  }

  public generateCSRFToken(): string {
    const token = CryptoJS.lib.WordArray.random(32).toString();
    const encryptedToken = this.encrypt(token);
    this.setCookie('csrf_token', encryptedToken, {
      ...this.SECURE_FLAGS,
      expires: undefined,
      sameSite: 'strict'
    });
    return token;
  }

  public getCSRFToken(): string | null {
    const encryptedToken = Cookies.get('csrf_token');
    if (encryptedToken) {
      try {
        return this.decrypt(encryptedToken);
      } catch {
        return null;
      }
    }
    return null;
  }

  public validateCSRFToken(token: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken !== null && storedToken === token;
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private loadConsent(): void {
    const consentCookie = Cookies.get(this.CONSENT_COOKIE);
    if (consentCookie) {
      try {
        this.consent = JSON.parse(consentCookie);
      } catch {
        this.consent = null;
      }
    }
  }

  public saveConsent(consent: Partial<CookieConsent>): void {
    this.consent = {
      necessary: true,
      functional: consent.functional ?? false,
      analytics: consent.analytics ?? false,
      marketing: consent.marketing ?? false,
      performance: consent.performance ?? false,
      timestamp: Date.now(),
      version: this.CONSENT_VERSION
    };

    Cookies.set(this.CONSENT_COOKIE, JSON.stringify(this.consent), {
      ...this.SECURE_FLAGS,
      expires: 365
    });

    this.applyConsent();
  }

  public getConsent(): CookieConsent | null {
    return this.consent;
  }

  public hasConsent(category: CookieCategory): boolean {
    if (!this.consent) return category === CookieCategory.NECESSARY;
    
    switch (category) {
      case CookieCategory.NECESSARY:
        return true;
      case CookieCategory.FUNCTIONAL:
        return this.consent.functional;
      case CookieCategory.ANALYTICS:
        return this.consent.analytics;
      case CookieCategory.MARKETING:
        return this.consent.marketing;
      case CookieCategory.PERFORMANCE:
        return this.consent.performance;
      default:
        return false;
    }
  }

  private applyConsent(): void {
    // Remove cookies from disabled categories
    const allCookies = Cookies.get();
    
    COOKIE_DEFINITIONS.forEach(cookieDef => {
      if (!this.hasConsent(cookieDef.category)) {
        // Remove cookies that match the definition
        Object.keys(allCookies).forEach(cookieName => {
          if (cookieName === cookieDef.name || 
              (cookieDef.name.includes('*') && 
               new RegExp(cookieDef.name.replace('*', '.*')).test(cookieName))) {
            Cookies.remove(cookieName);
            Cookies.remove(cookieName, { path: '/' });
            Cookies.remove(cookieName, { domain: '.tabletech.nl' });
          }
        });
      }
    });

    // Handle Google Analytics based on consent
    if (this.hasConsent(CookieCategory.ANALYTICS)) {
      this.enableGoogleAnalytics();
    } else {
      this.disableGoogleAnalytics();
    }

    // Handle Marketing cookies
    if (!this.hasConsent(CookieCategory.MARKETING)) {
      this.disableMarketingScripts();
    }
  }

  private enableGoogleAnalytics(): void {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  private disableGoogleAnalytics(): void {
    if (typeof window !== 'undefined') {
      // Disable Google Analytics
      (window as unknown as Record<string, unknown>)['ga-disable-G-GV8ZVCHNFE'] = true;
      
      if ((window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }

      // Remove GA cookies
      ['_ga', '_gid', '_gat', '_gat_gtag_UA'].forEach(name => {
        Cookies.remove(name);
        Cookies.remove(name, { path: '/' });
        Cookies.remove(name, { domain: '.tabletech.nl' });
      });
    }
  }

  private disableMarketingScripts(): void {
    // Block Facebook Pixel
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: () => void }).fbq) {
      (window as unknown as { fbq: () => void }).fbq = () => {};
    }

    // Remove marketing cookies
    ['_fbp', 'fr', 'IDE', 'test_cookie'].forEach(name => {
      Cookies.remove(name);
      Cookies.remove(name, { path: '/' });
      Cookies.remove(name, { domain: '.tabletech.nl' });
    });
  }

  public setCookie(
    name: string, 
    value: string, 
    options?: Cookies.CookieAttributes,
    encrypted?: boolean
  ): void {
    const cookieDef = COOKIE_DEFINITIONS.find(def => def.name === name);
    
    if (cookieDef && !this.hasConsent(cookieDef.category)) {
      console.warn(`Cannot set cookie ${name} - no consent for category ${cookieDef.category}`);
      return;
    }

    const finalValue = encrypted || cookieDef?.encrypted ? this.encrypt(value) : value;
    
    Cookies.set(name, finalValue, {
      ...this.SECURE_FLAGS,
      ...options
    });
  }

  public getCookie(name: string, encrypted?: boolean): string | undefined {
    const cookieDef = COOKIE_DEFINITIONS.find(def => def.name === name);
    const value = Cookies.get(name);
    
    if (!value) return undefined;
    
    if (encrypted || cookieDef?.encrypted) {
      try {
        return this.decrypt(value);
      } catch {
        return undefined;
      }
    }
    
    return value;
  }

  public removeCookie(name: string): void {
    Cookies.remove(name);
    Cookies.remove(name, { path: '/' });
    Cookies.remove(name, { domain: '.tabletech.nl' });
  }

  public clearAllCookies(keepNecessary: boolean = true): void {
    const allCookies = Cookies.get();
    
    Object.keys(allCookies).forEach(cookieName => {
      const cookieDef = COOKIE_DEFINITIONS.find(def => 
        def.name === cookieName || 
        (def.name.includes('*') && 
         new RegExp(def.name.replace('*', '.*')).test(cookieName))
      );
      
      if (!keepNecessary || !cookieDef || cookieDef.category !== CookieCategory.NECESSARY) {
        this.removeCookie(cookieName);
      }
    });
  }

  public getCookiesByCategory(category: CookieCategory): CookieDefinition[] {
    return COOKIE_DEFINITIONS.filter(cookie => cookie.category === category);
  }

  public getAllCookieDefinitions(): CookieDefinition[] {
    return COOKIE_DEFINITIONS;
  }

  public getActiveCookies(): string[] {
    return Object.keys(Cookies.get());
  }

  public generateSecureSession(): string {
    const sessionId = CryptoJS.lib.WordArray.random(32).toString();
    const encryptedSession = this.encrypt(sessionId);
    
    this.setCookie('tabletech_session', encryptedSession, {
      expires: undefined,
      sameSite: 'strict',
      secure: true
    });
    
    return sessionId;
  }

  public validateSession(sessionId: string): boolean {
    const storedSession = this.getCookie('tabletech_session', true);
    return storedSession === sessionId;
  }

  public updateConsentVersion(newVersion: string): void {
    if (this.consent && this.consent.version !== newVersion) {
      // Clear consent to force re-consent on version change
      this.consent = null;
      this.removeCookie(this.CONSENT_COOKIE);
    }
  }
}

export default CookieManager.getInstance();