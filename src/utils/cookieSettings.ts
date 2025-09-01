import cookieManager from './cookieManager';

/**
 * Opens the cookie consent banner with settings view
 * This can be called from anywhere in the app to allow users to manage their cookie preferences
 */
export const openCookieSettings = () => {
  // Remove consent to trigger banner to show again
  cookieManager.removeCookie('cookieconsent_status');
  
  // Set a flag to indicate we should open in settings mode
  sessionStorage.setItem('openCookieSettings', 'true');
  
  // Reload the page to show the banner
  window.location.reload();
};

/**
 * Check if we should open cookie settings on load
 */
export const shouldOpenCookieSettings = (): boolean => {
  const shouldOpen = sessionStorage.getItem('openCookieSettings') === 'true';
  if (shouldOpen) {
    sessionStorage.removeItem('openCookieSettings');
  }
  return shouldOpen;
};

/**
 * Get current cookie consent status
 */
export const getCookieConsentStatus = () => {
  const consent = cookieManager.getConsent();
  if (!consent) {
    return {
      hasConsented: false,
      functional: false,
      analytics: false,
      marketing: false,
      performance: false
    };
  }
  
  return {
    hasConsented: true,
    functional: consent.functional,
    analytics: consent.analytics,
    marketing: consent.marketing,
    performance: consent.performance
  };
};

export default {
  openCookieSettings,
  shouldOpenCookieSettings,
  getCookieConsentStatus
};