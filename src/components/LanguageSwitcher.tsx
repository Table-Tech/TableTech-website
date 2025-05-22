import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2 items-center border border-white/40 px-2 py-1 rounded">
      <button
        onClick={() => changeLanguage('nl')}
        className={`text-sm font-medium ${i18n.language === 'nl' ? 'text-white font-bold' : 'text-white/60'}`}
      >
        NL
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-medium ${i18n.language === 'en' ? 'text-white font-bold border border-white px-1 rounded' : 'text-white/60'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
