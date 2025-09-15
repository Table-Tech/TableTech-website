import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Shield, BarChart3, Megaphone, Zap, Settings, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import cookieManager, { CookieCategory } from '../utils/cookieManager';
import { openCookieSettings } from '../utils/cookieSettings';

const CookiePolicySection: React.FC = () => {
  const { i18n } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categoryDetails = {
    necessary: {
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: i18n.language === 'nl' ? 'Noodzakelijke cookies' : 'Necessary cookies',
      description: i18n.language === 'nl'
        ? 'Essentieel voor de werking van de website. Deze cookies kunnen niet worden uitgeschakeld.'
        : 'Essential for the website to function. These cookies cannot be disabled.',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.NECESSARY)
    },
    functional: {
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: i18n.language === 'nl' ? 'Functionele cookies' : 'Functional cookies',
      description: i18n.language === 'nl'
        ? 'Onthouden je voorkeuren zoals taal en tijdzone voor een betere gebruikerservaring.'
        : 'Remember your preferences like language and timezone for a better user experience.',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.FUNCTIONAL)
    },
    analytics: {
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      title: i18n.language === 'nl' ? 'Analytische cookies' : 'Analytics cookies',
      description: i18n.language === 'nl'
        ? 'Helpen ons te begrijpen hoe bezoekers onze website gebruiken om verbeteringen door te voeren.'
        : 'Help us understand how visitors use our website to make improvements.',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.ANALYTICS)
    },
    marketing: {
      icon: Megaphone,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      title: i18n.language === 'nl' ? 'Marketing cookies' : 'Marketing cookies',
      description: i18n.language === 'nl'
        ? 'Worden gebruikt voor gerichte advertenties en het meten van advertentiecampagnes.'
        : 'Used for targeted advertising and measuring advertising campaigns.',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.MARKETING)
    },
    performance: {
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      title: i18n.language === 'nl' ? 'Prestatie cookies' : 'Performance cookies',
      description: i18n.language === 'nl'
        ? 'Helpen bij het optimaliseren van websiteprestaties en laadtijden.'
        : 'Help optimize website performance and loading times.',
      cookies: cookieManager.getCookiesByCategory(CookieCategory.PERFORMANCE)
    }
  };

  return (
    <section id="cookie-policy" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Cookie className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {i18n.language === 'nl' ? 'Cookiebeleid' : 'Cookie Policy'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {i18n.language === 'nl'
              ? 'We gebruiken cookies om onze diensten te verbeteren en je een persoonlijke ervaring te bieden. Hieronder vind je alle informatie over welke cookies we gebruiken.'
              : 'We use cookies to improve our services and provide you with a personalized experience. Below you will find all information about which cookies we use.'}
          </p>
        </div>

        {/* Cookie Settings Button */}
        <div className="text-center mb-8">
          <button
            onClick={openCookieSettings}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Settings className="w-5 h-5" />
            {i18n.language === 'nl' ? 'Cookie-instellingen aanpassen' : 'Adjust cookie settings'}
          </button>
        </div>

        {/* Cookie Categories */}
        <div className="grid gap-4 md:gap-6">
          {Object.entries(categoryDetails).map(([key, category]) => (
            <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                className="w-full p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${category.bgColor} rounded-lg`}>
                      {React.createElement(category.icon, { className: `w-6 h-6 ${category.color}` })}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  {expandedCategory === key ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedCategory === key && category.cookies.length > 0 && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="mt-4 space-y-3">
                    {category.cookies.map(cookie => (
                      <div key={cookie.name} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <code className="text-sm font-mono bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {cookie.name}
                          </code>
                          <span className="text-xs text-gray-500">
                            {cookie.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {cookie.purpose}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-200 px-2 py-1 rounded">
                            {i18n.language === 'nl' ? 'Aanbieder:' : 'Provider:'} {cookie.provider}
                          </span>
                          <span className="bg-gray-200 px-2 py-1 rounded">
                            {i18n.language === 'nl' ? 'Duur:' : 'Duration:'} {cookie.duration}
                          </span>
                          {cookie.encrypted && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {i18n.language === 'nl' ? 'Versleuteld' : 'Encrypted'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {i18n.language === 'nl' ? 'Jouw rechten' : 'Your rights'}
          </h3>
          <p className="text-gray-600 mb-4">
            {i18n.language === 'nl'
              ? 'Je hebt volledige controle over je cookievoorkeuren. Je kunt:'
              : 'You have full control over your cookie preferences. You can:'}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              {i18n.language === 'nl'
                ? 'Je toestemming op elk moment intrekken via de cookie-instellingen'
                : 'Withdraw your consent at any time via cookie settings'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Kiezen welke categorieën cookies je accepteert'
                : 'Choose which categories of cookies you accept'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Cookies verwijderen die al op je apparaat zijn opgeslagen'
                : 'Delete cookies that are already stored on your device'}
            </li>
            <li>
              {i18n.language === 'nl'
                ? 'Meer informatie opvragen over onze cookiepraktijken'
                : 'Request more information about our cookie practices'}
            </li>
          </ul>
        </div>

        {/* Terms and Conditions Section */}
        <div id="terms" className="mt-12 bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">
              {i18n.language === 'nl' ? 'Algemene Voorwaarden' : 'Terms and Conditions'}
            </h3>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {i18n.language === 'nl' ? '1. Acceptatie van voorwaarden' : '1. Acceptance of terms'}
              </h4>
              <p>
                {i18n.language === 'nl'
                  ? 'Door gebruik te maken van TableTech diensten gaat u akkoord met deze algemene voorwaarden.'
                  : 'By using TableTech services, you agree to these terms and conditions.'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {i18n.language === 'nl' ? '2. Gebruik van diensten' : '2. Use of services'}
              </h4>
              <p>
                {i18n.language === 'nl'
                  ? 'Onze diensten zijn bedoeld voor restaurants en horecagelegenheden. Het gebruik is op eigen risico.'
                  : 'Our services are intended for restaurants and hospitality venues. Use is at your own risk.'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {i18n.language === 'nl' ? '3. Privacy en gegevensbescherming' : '3. Privacy and data protection'}
              </h4>
              <p>
                {i18n.language === 'nl'
                  ? 'We respecteren uw privacy en beschermen uw gegevens conform de AVG/GDPR wetgeving.'
                  : 'We respect your privacy and protect your data in accordance with GDPR legislation.'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {i18n.language === 'nl' ? '4. Aansprakelijkheid' : '4. Liability'}
              </h4>
              <p>
                {i18n.language === 'nl'
                  ? 'TableTech is niet aansprakelijk voor indirecte schade of gevolgschade die voortvloeit uit het gebruik van onze diensten.'
                  : 'TableTech is not liable for indirect or consequential damages arising from the use of our services.'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {i18n.language === 'nl' ? '5. Wijzigingen' : '5. Changes'}
              </h4>
              <p>
                {i18n.language === 'nl'
                  ? 'We behouden ons het recht voor om deze voorwaarden te wijzigen. Wijzigingen worden van kracht na publicatie op onze website.'
                  : 'We reserve the right to modify these terms. Changes take effect after publication on our website.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            {i18n.language === 'nl'
              ? 'Voor vragen over ons cookiebeleid of algemene voorwaarden:'
              : 'For questions about our cookie policy or terms and conditions:'}
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-gray-900 font-semibold">TableTech B.V.</p>
            <p className="text-gray-600">Email: privacy@tabletech.nl</p>
            <p className="text-gray-600">Tel: +31 (0)20 123 4567</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicySection;