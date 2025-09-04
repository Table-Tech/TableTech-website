import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Cookie, Settings, X, Check, ChevronDown, ChevronUp, BarChart3, Megaphone, Zap, Sparkles, Lock } from 'lucide-react';
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
    window.location.reload();
  };

  const handleAcceptSelected = () => {
    cookieManager.saveConsent(categories);
    window.location.reload();
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Main Banner */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(237, 125, 49, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(237, 125, 49, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 50% 100%, rgba(237, 125, 49, 0.05) 0%, transparent 50%)`
          }}></div>
        </div>

        {/* Header with animated gradient */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-4 py-3">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-red-600/20 animate-pulse"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-lg blur-lg animate-pulse"></div>
                <div className="relative p-1.5 bg-white/25 backdrop-blur-sm rounded-lg border border-white/30">
                  <Cookie className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white drop-shadow-lg">
                  {activeView === 'main' 
                    ? (i18n.language === 'nl' ? 'Jouw privacyvoorkeuren' : 'Your privacy preferences')
                    : (i18n.language === 'nl' ? 'Cookie instellingen' : 'Cookie settings')}
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  {i18n.language === 'nl' ? 'Kies wat voor jou werkt' : 'Choose what works for you'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-all hover:scale-110"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {activeView === 'main' && (
            <>
              {/* Main Message with icon */}
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {i18n.language === 'nl' ? 'Welkom bij TableTech!' : 'Welcome to TableTech!'}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {i18n.language === 'nl' 
                        ? 'We gebruiken cookies om je de beste ervaring te geven. Kies hieronder je voorkeuren of accepteer alles voor de volledige TableTech ervaring.'
                        : 'We use cookies to give you the best experience. Choose your preferences below or accept all for the full TableTech experience.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">
                        {i18n.language === 'nl' ? 'Veilig & Betrouwbaar' : 'Safe & Secure'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {i18n.language === 'nl' ? 'AVG compliant' : 'GDPR compliant'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">
                        {i18n.language === 'nl' ? 'Jouw Controle' : 'Your Control'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {i18n.language === 'nl' ? 'Kies zelf' : 'You choose'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">
                        {i18n.language === 'nl' ? 'Betere Ervaring' : 'Better Experience'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {i18n.language === 'nl' ? 'Gepersonaliseerd' : 'Personalized'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons with gradient */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="group relative flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {i18n.language === 'nl' ? 'Alles accepteren' : 'Accept all'}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveView('settings')}
                  className="group relative flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {i18n.language === 'nl' ? 'Aanpassen' : 'Customize'}
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
                >
                  {i18n.language === 'nl' ? 'Alleen noodzakelijk' : 'Only necessary'}
                </button>
              </div>
            </>
          )}

          {activeView === 'settings' && (
            <>
              {/* Settings View */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {i18n.language === 'nl'
                    ? 'Beheer je cookievoorkeuren per categorie. Klik voor meer details.'
                    : 'Manage your cookie preferences by category. Click for more details.'}
                </p>

                {/* Cookie Categories with beautiful cards */}
                <div className="space-y-3">
                  {/* Necessary - Always On */}
                  <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <div 
                      className={`relative bg-gradient-to-br ${categoryDetails.necessary.lightGradient} dark:from-gray-800 dark:to-gray-700 p-3 cursor-pointer`}
                      onClick={() => setExpandedCategory(expandedCategory === 'necessary' ? null : 'necessary')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${categoryDetails.necessary.bgIcon} rounded-lg shadow-sm`}>
                            <Shield className={`w-5 h-5 ${categoryDetails.necessary.iconColor}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                              {categoryDetails.necessary.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {categoryDetails.necessary.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 bg-gradient-to-r ${categoryDetails.necessary.gradient} text-white rounded-full text-sm font-medium shadow-lg`}>
                            {i18n.language === 'nl' ? 'Altijd aan' : 'Always on'}
                          </div>
                          {expandedCategory === 'necessary' ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </div>
                      </div>
                    </div>
                    {expandedCategory === 'necessary' && (
                      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryDetails.necessary.cookies.map(cookie => (
                            <div key={cookie.name} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="font-mono text-xs text-orange-600 dark:text-orange-400 mb-1">{cookie.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">{cookie.purpose}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {cookie.provider} • {cookie.duration}
                              </div>
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
                    <div key={key} className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                      <div 
                        className={`relative bg-gradient-to-br ${details.lightGradient} dark:from-gray-800 dark:to-gray-700 p-3 cursor-pointer`}
                        onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 ${details.bgIcon} rounded-lg shadow-sm`}>
                              {React.createElement(details.icon, { className: `w-5 h-5 ${details.iconColor}` })}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                                {details.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-500 shadow-inner"></div>
                            </label>
                            {expandedCategory === key ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                          </div>
                        </div>
                      </div>
                      {expandedCategory === key && (
                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {details.cookies.map(cookie => (
                              <div key={cookie.name} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="font-mono text-xs text-orange-600 dark:text-orange-400 mb-1">{cookie.name}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-300">{cookie.purpose}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {cookie.provider} • {cookie.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAcceptSelected}
                  className="group relative flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {i18n.language === 'nl' ? 'Voorkeuren opslaan' : 'Save preferences'}
                  </span>
                </button>
                <button
                  onClick={() => setActiveView('main')}
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:border-orange-500 transition-all"
                >
                  {i18n.language === 'nl' ? 'Terug' : 'Back'}
                </button>
              </div>
            </>
          )}

          {/* Footer Links with modern design */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {i18n.language === 'nl' ? 'Jouw privacy is belangrijk voor ons' : 'Your privacy matters to us'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    document.getElementById('privacy-policy')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium hover:underline transition-colors"
              >
                {i18n.language === 'nl' ? 'Privacybeleid' : 'Privacy Policy'}
              </button>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    document.getElementById('terms-conditions')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium hover:underline transition-colors"
              >
                {i18n.language === 'nl' ? 'Algemene Voorwaarden' : 'Terms & Conditions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;