import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Cookie, Settings, X, ChevronDown, ChevronUp, BarChart3, Megaphone, Zap, ChevronRight } from 'lucide-react';
import cookieManager, { CookieCategory } from '../utils/cookieManager';
import { shouldOpenCookieSettings } from '../utils/cookieSettings';

interface CategoryState {
  [CookieCategory.FUNCTIONAL]: boolean;
  [CookieCategory.ANALYTICS]: boolean;
  [CookieCategory.MARKETING]: boolean;
  [CookieCategory.PERFORMANCE]: boolean;
}

const CookieConsentBanner: React.FC = () => {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'settings'>('main');
  const [categories, setCategories] = useState<CategoryState>({
    [CookieCategory.FUNCTIONAL]: true,
    [CookieCategory.ANALYTICS]: true,
    [CookieCategory.MARKETING]: false,
    [CookieCategory.PERFORMANCE]: true,
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const consent = cookieManager.getConsent();
    const shouldOpenSettings = shouldOpenCookieSettings();
    
    if (!consent || shouldOpenSettings) {
      if (shouldOpenSettings) {
        setIsVisible(true);
        setActiveView('settings');
      } else {
        setTimeout(() => setIsVisible(true), 1500);
      }
    } else {
      setCategories({
        [CookieCategory.FUNCTIONAL]: consent.functional,
        [CookieCategory.ANALYTICS]: consent.analytics,
        [CookieCategory.MARKETING]: consent.marketing,
        [CookieCategory.PERFORMANCE]: consent.performance,
      });
    }
  }, []);

  const handleAcceptAll = () => {
    cookieManager.saveConsent({
      functional: true,
      analytics: true,
      marketing: true,
      performance: true,
    });
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    cookieManager.saveConsent(categories);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    cookieManager.saveConsent({
      functional: false,
      analytics: false,
      marketing: false,
      performance: false,
    });
    setIsVisible(false);
  };

  const toggleCategory = (category: keyof CategoryState) => {
    setCategories((prev: CategoryState) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!isVisible) return null;

  const categoryDetails = {
    necessary: {
      icon: Shield,
      gradient: 'from-emerald-500 to-green-600',
      lightGradient: 'from-emerald-50 to-green-50',
      iconColor: 'text-emerald-600',
      bgIcon: 'bg-gradient-to-br from-emerald-100 to-green-100',
      title: i18n.language === 'nl' ? 'Noodzakelijke cookies' : 'Necessary cookies',
      description: i18n.language === 'nl'
        ? 'Essentieel voor de werking van de website'
        : 'Essential for the website to function',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.NECESSARY)
    },
    functional: {
      icon: Settings,
      gradient: 'from-blue-500 to-indigo-600',
      lightGradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      bgIcon: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      title: i18n.language === 'nl' ? 'Functionele cookies' : 'Functional cookies',
      description: i18n.language === 'nl'
        ? 'Onthouden je voorkeuren zoals taal en tijdzone'
        : 'Remember your preferences like language and timezone',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.FUNCTIONAL)
    },
    analytics: {
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-600',
      lightGradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
      bgIcon: 'bg-gradient-to-br from-purple-100 to-pink-100',
      title: i18n.language === 'nl' ? 'Analytische cookies' : 'Analytics cookies',
      description: i18n.language === 'nl'
        ? 'Helpen ons te begrijpen hoe je de website gebruikt'
        : 'Help us understand how you use the website',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.ANALYTICS)
    },
    marketing: {
      icon: Megaphone,
      gradient: 'from-rose-500 to-red-600',
      lightGradient: 'from-rose-50 to-red-50',
      iconColor: 'text-rose-600',
      bgIcon: 'bg-gradient-to-br from-rose-100 to-red-100',
      title: i18n.language === 'nl' ? 'Marketing cookies' : 'Marketing cookies',
      description: i18n.language === 'nl'
        ? 'Voor relevante advertenties en aanbiedingen'
        : 'For relevant advertisements and offers',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.MARKETING)
    },
    performance: {
      icon: Zap,
      gradient: 'from-amber-500 to-orange-600',
      lightGradient: 'from-amber-50 to-orange-50',
      iconColor: 'text-amber-600',
      bgIcon: 'bg-gradient-to-br from-amber-100 to-orange-100',
      title: i18n.language === 'nl' ? 'Prestatie cookies' : 'Performance cookies',
      description: i18n.language === 'nl'
        ? 'Voor snellere laadtijden en betere prestaties'
        : 'For faster loading times and better performance',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.PERFORMANCE)
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slideUp">
      {/* Main Banner - Professional Bottom Bar */}
      <div className="w-full bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 shadow-2xl">

        {/* Content Container */}
        <div className="relative">
          {activeView === 'main' && (
            <div className="px-6 py-4">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Message Section */}
                <div className="flex items-center gap-4 flex-1">
                  <Cookie className="w-5 h-5 text-stone-500 hidden sm:block" />
                  <div className="flex-1">
                    <p className="text-sm text-stone-700 dark:text-stone-300">
                      {i18n.language === 'nl' 
                        ? 'We gebruiken cookies om onze diensten te verbeteren en je ervaring te personaliseren.'
                        : 'We use cookies to improve our services and personalize your experience.'}
                      <button
                        onClick={() => setActiveView('settings')}
                        className="ml-2 text-stone-800 dark:text-stone-200 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        {i18n.language === 'nl' ? 'Meer informatie' : 'Learn more'}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Minimal and Professional */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-medium"
                  >
                    {i18n.language === 'nl' ? 'Weigeren' : 'Reject'}
                  </button>
                  
                  <button
                    onClick={() => setActiveView('settings')}
                    className="px-4 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors font-medium"
                  >
                    {i18n.language === 'nl' ? 'Aanpassen' : 'Customize'}
                  </button>
                  
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2 text-sm bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 rounded-lg hover:bg-stone-900 dark:hover:bg-stone-300 transition-colors font-medium"
                  >
                    {i18n.language === 'nl' ? 'Accepteren' : 'Accept all'}
                  </button>
                  
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto bg-stone-50 dark:bg-stone-900">
              {/* Settings Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                    {i18n.language === 'nl' ? 'Cookie-instellingen' : 'Cookie Settings'}
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    {i18n.language === 'nl'
                      ? 'Beheer je voorkeuren per categorie'
                      : 'Manage your preferences by category'}
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

                {/* Cookie Categories - Clean and Minimal */}
                <div className="space-y-3">
                  {/* Necessary - Always On */}
                  <div className="border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800">
                    <div 
                      className="p-4 cursor-pointer hover:bg-amber-100 dark:hover:bg-stone-750 transition-colors group"
                      onClick={() => setExpandedCategory(expandedCategory === 'necessary' ? null : 'necessary')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-amber-800" />
                          <div>
                            <h4 className="font-medium text-stone-800 dark:text-stone-200 group-hover:text-amber-900">
                              {categoryDetails.necessary.title}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 group-hover:text-amber-800">
                              {categoryDetails.necessary.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-600 dark:text-stone-400 font-medium group-hover:text-amber-800">
                            {i18n.language === 'nl' ? 'Altijd aan' : 'Always on'}
                          </span>
                          {expandedCategory === 'necessary' ? <ChevronUp className="w-4 h-4 text-stone-500 dark:text-stone-400 group-hover:text-amber-800" /> : <ChevronDown className="w-4 h-4 text-stone-500 dark:text-stone-400 group-hover:text-amber-800" />}
                        </div>
                      </div>
                    </div>
                    {expandedCategory === 'necessary' && (
                      <div className="px-4 pb-4 border-t border-stone-100 dark:border-stone-700">
                        <div className="mt-3 space-y-2">
                          {categoryDetails.necessary.cookies.map(cookie => (
                            <div key={cookie.name} className="text-xs text-stone-600 dark:text-stone-400">
                              <span className="font-mono">{cookie.name}</span> - {cookie.purpose}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Other categories with toggles */}
                  {Object.entries({
                    functional: categoryDetails.functional,
                    analytics: categoryDetails.analytics,
                    marketing: categoryDetails.marketing,
                    performance: categoryDetails.performance
                  }).map(([key, details]) => (
                    <div key={key} className="border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800">
                      <div 
                        className="p-4 cursor-pointer hover:bg-amber-100 dark:hover:bg-stone-750 transition-colors group"
                        onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {React.createElement(details.icon, { className: "w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-amber-800" })}
                            <div className="flex-1">
                              <h4 className="font-medium text-stone-800 dark:text-stone-200 group-hover:text-amber-900">
                                {details.title}
                              </h4>
                              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 group-hover:text-amber-800">
                                {details.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={categories[key as keyof CategoryState]}
                                onChange={() => toggleCategory(key as keyof CategoryState)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-stone-300 dark:bg-stone-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-stone-300 dark:peer-focus:ring-stone-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-700 dark:peer-checked:bg-stone-300"></div>
                            </label>
                            {expandedCategory === key ? <ChevronUp className="w-4 h-4 text-stone-500 dark:text-stone-400 group-hover:text-amber-800" /> : <ChevronDown className="w-4 h-4 text-stone-500 dark:text-stone-400 group-hover:text-amber-800" />}
                          </div>
                        </div>
                      </div>
                      {expandedCategory === key && (
                        <div className="px-4 pb-4 border-t border-stone-100 dark:border-stone-700">
                          <div className="mt-3 space-y-2">
                            {details.cookies.map(cookie => (
                              <div key={cookie.name} className="text-xs text-stone-600 dark:text-stone-400">
                                <span className="font-mono">{cookie.name}</span> - {cookie.purpose}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              {/* Settings Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setActiveView('main')}
                  className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-medium"
                >
                  {i18n.language === 'nl' ? '← Terug' : '← Back'}
                </button>
                <button
                  onClick={handleAcceptSelected}
                  className="px-5 py-2 text-sm bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 rounded-lg hover:bg-stone-900 dark:hover:bg-stone-300 transition-colors font-medium"
                >
                  {i18n.language === 'nl' ? 'Voorkeuren opslaan' : 'Save preferences'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;