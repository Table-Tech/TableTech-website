import * as React from "react";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { TermsModal } from "./TermsModal";
import { CookiePolicyModal } from "./CookiePolicyModal";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  
  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleTermsClick = () => {
    setIsTermsModalOpen(true);
  };

  const handleCookieClick = () => {
    setIsCookieModalOpen(true);
  };

  return (
    <footer 
      id="footer" 
      className="relative text-[#FFD382] pt-0 pb-8 w-full overflow-hidden border-0 shadow-none" 
      style={{
        border: 'none', 
        borderTop: 'none', 
        boxShadow: 'none',
        background: 'linear-gradient(180deg, #231813 0%, #1f140f 50%, #1a110d 100%)'
      }}
    >
      {/* Ambient lighting and accent effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient top lighting effect */}
        <div 
          className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-[600px] h-48 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(237, 125, 49, 0.1) 0%, transparent 70%)'
          }}
        ></div>
        
        {/* Background removed for cleaner look */}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col items-center pt-4 sm:pt-6 lg:pt-8">
        {/* Groot logo en slogan met enhanced effecten */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img 
            src="/logo4.svg" 
            alt="TableTech logo" 
            className="w-24 h-24 mb-2 transition-all duration-300 hover:scale-110" 
            style={{
              filter: 'drop-shadow(0 0 20px rgba(237, 125, 49, 0.3))',
              transition: 'filter 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(237, 125, 49, 0.5))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(237, 125, 49, 0.3))';
            }}
            loading="lazy" 
            decoding="async" 
          />
          <span 
            className="text-3xl font-extrabold text-white tracking-wide transition-all duration-300 hover:text-[#FFD382]"
            style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 15px rgba(237, 125, 49, 0.2)'}}
          >
            TableTech
          </span>
          <span 
            className="text-lg text-[#FFD382] font-medium italic"
            style={{textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)'}}
          >
            {t('footer.tagline')}
          </span>
        </div>

        {/* Contact info met LinkedIn geïntegreerd */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-8">
          <div className="flex items-center gap-2 text-base group">
            <Phone className="w-5 h-5 text-[#FFD382] group-hover:text-[#E86C28] transition-colors duration-300" />
            <a 
              href="tel:+31648447234" 
              className="hover:text-white transition-all duration-300 font-semibold hover:scale-105"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              +31 6 48447234
            </a>
          </div>
          <div className="flex items-center gap-2 text-base group">
            <Mail className="w-5 h-5 text-[#FFD382] group-hover:text-[#E86C28] transition-colors duration-300" />
            <a 
              href="mailto:info@tabletech.nl" 
              className="hover:text-white transition-all duration-300 font-semibold hover:scale-105"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              info@tabletech.nl
            </a>
          </div>
          <div className="flex items-center gap-2 text-base group">
            <MapPin className="w-5 h-5 text-[#FFD382] group-hover:text-[#E86C28] transition-colors duration-300" />
            <span 
              className="font-semibold group-hover:text-white transition-colors duration-300"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
            >
              {t('footer.country')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base group">
            <a 
              href="https://www.linkedin.com/company/tabletech-eu/about/" 
              target="_blank" 
              rel="noopener" 
              aria-label="LinkedIn" 
              className="flex items-center gap-2 text-[#FFD382] hover:text-white transition-all duration-300 font-semibold hover:scale-105"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Copyright en links met enhanced effecten */}
        <div className="text-center text-sm flex flex-col items-center gap-2">
          <p 
            className="text-[#FFD382]/80"
            style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
          >
            &copy; {currentYear} <span 
              className="font-semibold text-white hover:text-[#FFD382] transition-colors duration-300"
              style={{textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5), 0 0 10px rgba(237, 125, 49, 0.2)'}}
            >
              TableTech
            </span>. {t('footer.copyright')}
          </p>
          <div className="flex gap-6 mt-1">
            <button 
              onClick={handlePrivacyClick}
              className="underline hover:text-[#E86C28] transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              {t('footer.links.privacy')}
            </button>
            <button 
              onClick={handleTermsClick}
              className="underline hover:text-[#E86C28] transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              {t('footer.links.terms')}
            </button>
            <button 
              onClick={handleCookieClick}
              className="underline hover:text-[#E86C28] transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              {t('footer.links.cookies')}
            </button>
          </div>
        </div>
      </div>

      {/* Removed bottom fade for cleaner finish */}
      
      {/* Modals */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)}
        onOpenTerms={() => {
          setIsPrivacyModalOpen(false);
          setIsTermsModalOpen(true);
        }}
        onOpenCookies={() => {
          setIsPrivacyModalOpen(false);
          setIsCookieModalOpen(true);
        }}
      />
      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)}
        onOpenPrivacy={() => {
          setIsTermsModalOpen(false);
          setIsPrivacyModalOpen(true);
        }}
        onOpenCookies={() => {
          setIsTermsModalOpen(false);
          setIsCookieModalOpen(true);
        }}
      />
      <CookiePolicyModal 
        isOpen={isCookieModalOpen} 
        onClose={() => setIsCookieModalOpen(false)}
        onOpenPrivacy={() => {
          setIsCookieModalOpen(false);
          setIsPrivacyModalOpen(true);
        }}
        onOpenTerms={() => {
          setIsCookieModalOpen(false);
          setIsTermsModalOpen(true);
        }}
      />
    </footer>
  );
};