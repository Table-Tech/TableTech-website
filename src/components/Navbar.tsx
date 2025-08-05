import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { prefetch } from "../utils/prefetch";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "../i18n";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Track active section tijdens scrollen
  useEffect(() => {
    if (!isHomePage) return;

    const sections = ["hero", "benefits", "pricing", "themes", "cta"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset voor navbar
      
      // Check each section
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          
          // Check if we're in this section
          if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Smooth scroll functie voor one-pager navigatie
  const scrollToSection = (sectionId: string): void => {
    setOpen(false);
    
    if (!isHomePage) {
      // Als we niet op de homepage zijn, ga eerst naar home
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Smooth scroll naar sectie op de huidige pagina
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });

      // Ook Lenis smooth scroll gebruiken indien beschikbaar
      const lenis = window.lenis as Record<string, unknown>;
      if (lenis?.scrollTo && typeof lenis.scrollTo === 'function') {
        (lenis.scrollTo as (target: Element, options?: Record<string, unknown>) => void)(element, { duration: 1.0 }); // Faster navigation scroll
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10 text-white transition-all duration-300 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 py-6 flex items-center justify-between">
        {/* Enhanced TableTech logo met hover effect */}
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-wide text-white drop-shadow-lg transition-all duration-300 transform hover:text-[#ffe7c3] hover:scale-105 hover:drop-shadow-2xl active:scale-95"
        >
          TableTech
        </Link>

        <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
          {isHomePage ? (
            <>
              <button 
                onClick={() => scrollToSection('hero')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer transform active:scale-95 drop-shadow-sm ${
                  activeSection === 'hero' 
                    ? 'text-[#ffe7c3] font-semibold bg-black/20 shadow-lg scale-105' 
                    : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200'
                }`}
                type="button"
              >
                {t("home")}
              </button>
              <button 
                onClick={() => scrollToSection('benefits')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer transform active:scale-95 drop-shadow-sm ${
                  activeSection === 'benefits' 
                    ? 'text-[#ffe7c3] font-semibold bg-black/20 shadow-lg scale-105' 
                    : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200'
                }`}
                type="button"
              >
                {t("features")}
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer transform active:scale-95 drop-shadow-sm ${
                  activeSection === 'pricing' 
                    ? 'text-[#ffe7c3] font-semibold bg-black/20 shadow-lg scale-105' 
                    : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200'
                }`}
                type="button"
              >
                {t("pricing")}
              </button>
              <button 
                onClick={() => scrollToSection('themes')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer transform active:scale-95 drop-shadow-sm ${
                  activeSection === 'themes' 
                    ? 'text-[#ffe7c3] font-semibold bg-black/20 shadow-lg scale-105' 
                    : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200'
                }`}
                type="button"
              >
                Themes
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
              >
                {t("home")}
              </Link>
              <Link 
                to="/#benefits" 
                className="px-4 py-2 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
              >
                {t("features")}
              </Link>
              <Link
                to="/pricing"
                onMouseEnter={() => prefetch(() => import("../pages/LandingPage/PricingNew"))}
                className="px-4 py-2 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
              >
                {t("pricing")}
              </Link>
              <Link 
                to="/#themes" 
                className="px-4 py-2 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
              >
                Themes
              </Link>
            </>
          )}

          {/* ✅ Taalkiezer */}
          <LanguageSwitcher />

          <button
            onClick={() => scrollToSection('cta')}
            className="bg-gradient-to-r from-yellow-700 to-yellow-800 hover:from-yellow-800 hover:to-yellow-900 hover:scale-110 hover:shadow-xl text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform active:scale-95 shadow-lg"
            type="button"
          >
            {t("signup")}
          </button>
        </nav>

        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden focus:outline-none transform active:scale-95 transition-transform duration-150 hover:scale-110 hover:text-[#ffe7c3]" 
          aria-label={open ? "Sluit menu" : "Open menu"}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#3a2a20]/90 backdrop-blur-lg border-t border-white/10 shadow-xl px-6 py-4 transition-all duration-300 ease-in-out">
          <nav className="flex flex-col space-y-4 text-center text-sm text-white font-medium">
            {isHomePage ? (
              <>
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className={`px-4 py-3 rounded-lg transition-all duration-300 transform active:scale-95 drop-shadow-sm ${
                    activeSection === 'hero' 
                      ? 'text-[#ffe7c3] font-semibold bg-black/20 scale-105' 
                      : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                  }`}
                  type="button"
                >
                  {t("home")}
                </button>
                <button 
                  onClick={() => scrollToSection('benefits')} 
                  className={`px-4 py-3 rounded-lg transition-all duration-300 transform active:scale-95 drop-shadow-sm ${
                    activeSection === 'benefits' 
                      ? 'text-[#ffe7c3] font-semibold bg-black/20 scale-105' 
                      : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                  }`}
                  type="button"
                >
                  {t("features")}
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className={`px-4 py-3 rounded-lg transition-all duration-300 transform active:scale-95 drop-shadow-sm ${
                    activeSection === 'pricing' 
                      ? 'text-[#ffe7c3] font-semibold bg-black/20 scale-105' 
                      : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                  }`}
                  type="button"
                >
                  {t("pricing")}
                </button>
                <button 
                  onClick={() => scrollToSection('themes')} 
                  className={`px-4 py-3 rounded-lg transition-all duration-300 transform active:scale-95 drop-shadow-sm ${
                    activeSection === 'themes' 
                      ? 'text-[#ffe7c3] font-semibold bg-black/20 scale-105' 
                      : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                  }`}
                  type="button"
                >
                  Themes
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  onClick={() => setOpen(false)} 
                  className="px-4 py-3 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
                >
                  {t("home")}
                </Link>
                <Link 
                  to="/#benefits" 
                  onClick={() => setOpen(false)} 
                  className="px-4 py-3 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
                >
                  {t("features")}
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => prefetch(() => import("../pages/LandingPage/PricingNew"))}
                  className="px-4 py-3 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
                >
                  {t("pricing")}
                </Link>
                <Link 
                  to="/#themes" 
                  onClick={() => setOpen(false)} 
                  className="px-4 py-3 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
                >
                  Themes
                </Link>
              </>
            )}
            
            <button 
              onClick={() => scrollToSection('cta')} 
              className="mt-4 bg-gradient-to-r from-yellow-700 to-yellow-800 hover:from-yellow-800 hover:to-yellow-900 hover:scale-110 hover:shadow-xl text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform active:scale-95"
              type="button"
            >
              {t("signup")}
            </button>

            {/* ✅ Mobile taalwissel */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};