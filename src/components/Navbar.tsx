// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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

    const sections = ["hero", "benefits", "dashboard", "pricing", "cta"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset voor navbar
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
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
      const lenis = window.lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(element, { duration: 1.5 });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-wide text-white drop-shadow-lg">
          TableTech
        </Link>

        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium">
          {isHomePage ? (
            <>
              <button 
                onClick={() => scrollToSection('hero')} 
                className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeSection === 'hero' 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                type="button"
              >
                {t("home")}
              </button>
              <button 
                onClick={() => scrollToSection('benefits')} 
                className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeSection === 'benefits' 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                type="button"
              >
                {t("features")}
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeSection === 'pricing' 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                type="button"
              >
                {t("pricing")}
              </button>
              <button 
                onClick={() => scrollToSection('dashboard')} 
                className={`px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeSection === 'dashboard' 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                type="button"
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">{t("home")}</Link>
              <Link to="/#benefits" className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">{t("features")}</Link>
              <Link to="/#pricing" className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">{t("pricing")}</Link>
              <Link to="/#dashboard" className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">Dashboard</Link>
            </>
          )}

          {/* ✅ Taalkiezer */}
          <LanguageSwitcher />

          <button
            onClick={() => scrollToSection('cta')}
            className="bg-[#FF6B35] hover:bg-[#E55A2B] hover:scale-105 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg"
            type="button"
          >
            {t("signup")}
          </button>
        </nav>

        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden focus:outline-none" 
          aria-label={open ? "Sluit menu" : "Open menu"}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 shadow-xl px-6 py-4 transition-all duration-300 ease-in-out">
          <nav className="flex flex-col space-y-3 text-center text-sm text-white font-medium">
            {isHomePage ? (
              <>
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === 'hero' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  type="button"
                >
                  {t("home")}
                </button>
                <button 
                  onClick={() => scrollToSection('benefits')} 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === 'benefits' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  type="button"
                >
                  {t("features")}
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === 'pricing' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  type="button"
                >
                  {t("pricing")}
                </button>
                <button 
                  onClick={() => scrollToSection('dashboard')} 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === 'dashboard' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  type="button"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">{t("home")}</Link>
                <Link to="/#benefits" onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">{t("features")}</Link>
                <Link to="/#pricing" onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">{t("pricing")}</Link>
                <Link to="/#dashboard" onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">Dashboard</Link>
              </>
            )}
            
            <button 
              onClick={() => scrollToSection('cta')} 
              className="mt-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
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