import { env } from '../../env';
import { readFileSync } from 'fs';
import { logger } from '../logging/logger';

// Common disposable email domains
const DEFAULT_DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'tempmail.com',
  'trashmail.com',
  'getnada.com',
  'fakeinbox.com',
  'mohmal.com',
  'mailnesia.com',
  'mintemail.com',
  'sharklasers.com',
  'guerrillamail.info',
  'spam4.me',
  'grr.la',
  'mailmetrash.com',
  'thankyou2010.com',
  'trash2009.com',
  'mt2009.com',
  'trashymail.com',
  'mytrashmail.com',
]);

// Common role-based email prefixes
const ROLE_BASED_PREFIXES = [
  'admin',
  'info',
  'support',
  'sales',
  'contact',
  'help',
  'noreply',
  'no-reply',
  'postmaster',
  'webmaster',
  'abuse',
  'billing',
  'feedback',
  'hostmaster',
  'root',
];

let disposableDomains: Set<string> = DEFAULT_DISPOSABLE_DOMAINS;

// Load additional domains from file if configured
export const loadDisposableDomains = (): void => {
  if (env.DISPOSABLE_DOMAINS_PATH) {
    try {
      const content = readFileSync(env.DISPOSABLE_DOMAINS_PATH, 'utf-8');
      const domains = content
        .split('\n')
        .map(line => line.trim().toLowerCase())
        .filter(line => line && !line.startsWith('#'));
      
      disposableDomains = new Set([...DEFAULT_DISPOSABLE_DOMAINS, ...domains]);
      logger.info(`Loaded ${disposableDomains.size} disposable domains`);
    } catch (error) {
      logger.warn({ error }, 'Failed to load disposable domains file, using defaults');
    }
  }
};

// Check if email uses a disposable domain
export const isDisposableEmail = (email: string): boolean => {
  if (!env.ENABLE_DISPOSABLE_CHECK) return false;
  
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return false;
  
  return disposableDomains.has(domain);
};

// Check if email is role-based
export const isRoleBasedEmail = (email: string): boolean => {
  const localPart = email.toLowerCase().split('@')[0];
  if (!localPart) return false;
  
  return ROLE_BASED_PREFIXES.includes(localPart);
};

// Combined check for suspicious emails
export const isSuspiciousEmail = (email: string): { suspicious: boolean; reason?: string } => {
  if (isDisposableEmail(email)) {
    return { suspicious: true, reason: 'Disposable email domain' };
  }
  
  if (isRoleBasedEmail(email)) {
    return { suspicious: true, reason: 'Role-based email address' };
  }
  
  return { suspicious: false };
};

// Initialize on startup
loadDisposableDomains();