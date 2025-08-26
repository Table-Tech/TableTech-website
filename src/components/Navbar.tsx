import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import LanguageSwitcher from "./LanguageSwitcher";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const navbarRef = useRef<HTMLElement>(null);

  // GSAP ScrollTrigger for navbar transparency
  useLayoutEffect(() => {
    if (!navbarRef.current) return;

    // Create GSAP context
    const ctx = gsap.context(() => {
      // Initial state - fully transparent at top
      gsap.set(navbarRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(0px)",
        borderColor: "rgba(255, 255, 255, 0)",
      });

      // Create scroll trigger for navbar background
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
          const scrollY = window.scrollY;
          
          if (scrollY === 0) {
            // Only fully transparent at the very top (y = 0)
            gsap.to(navbarRef.current, {
              backgroundColor: "rgba(0, 0, 0, 0)",
              backdropFilter: "blur(0px)",
              borderColor: "rgba(255, 255, 255, 0)",
              duration: 0.3,
              ease: "power2.out"
            });
            setIsScrolled(false);
          } else {
            // Blur effect everywhere else (any scroll position > 0)
            gsap.to(navbarRef.current, {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              duration: 0.3,
              ease: "power2.out"
            });
            setIsScrolled(true);
          }
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // Track active section with proper order
  useEffect(() => {
    if (!isHomePage) return;

    // Updated section order: hero -> benefits -> themes -> pricing -> contact
    const sections = ["hero", "benefits", "themes", "pricing", "contact"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the very top
      if (scrollPosition < 100) {
        setActiveSection("hero");
        return;
      }
      
      // Check if we're at the bottom of the page
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setActiveSection("contact");
        return;
      }
      
      // Find which section is currently most visible
      let activeSection = "hero";
      let maxVisibleHeight = 0;
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = Math.max(0, -rect.top); // How much is above viewport
          const elementBottom = Math.min(rect.height, windowHeight - rect.top); // How much is in viewport
          const visibleHeight = Math.max(0, elementBottom - elementTop);
          
          // If this section has more visible area, make it active
          if (visibleHeight > maxVisibleHeight && visibleHeight > 50) {
            maxVisibleHeight = visibleHeight;
            activeSection = sectionId;
          }
        }
      });
      
      setActiveSection(activeSection);
    };

    // Add throttled scroll listener
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHomePage]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string): void => {
    setOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Prevent multiple scroll operations
    if (isScrolling) return;

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      
      if (element) {
        setIsScrolling(true);
        const elementTop = element.offsetTop;
        const offset = 80; // Navbar height
        const targetPosition = Math.max(0, elementTop - offset);
        
        // Use Lenis if available (preferred method)
        if (window.lenis) {
          window.lenis.scrollTo(targetPosition, { 
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            onComplete: () => {
              setIsScrolling(false);
            }
          });
        } else {
          // Fallback to native smooth scroll
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          // Reset scrolling state after estimated duration
          setTimeout(() => {
            setIsScrolling(false);
          }, 1200);
        }
      } else {
        // Element not found, reset scrolling state
        setIsScrolling(false);
      }
    });
  };

  return (
    <header
      ref={navbarRef}
      className={`fixed top-0 left-0 w-full z-50 text-white transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backdropFilter: 'blur(0px)',
        WebkitBackdropFilter: 'blur(0px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0)'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 lg:py-5 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => scrollToSection('hero')}
          className="text-2xl font-bold tracking-wide text-white drop-shadow-lg transition-all duration-300 transform hover:text-[#ffe7c3] hover:scale-105 hover:drop-shadow-2xl active:scale-95"
        >
          TableTech
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
          {isHomePage ? (
            <>
              {[ 
                { id: 'hero', label: t("home") },
                { id: 'benefits', label: t("features") },
                { id: 'themes', label: 'Themes' },
                { id: 'pricing', label: t("pricing") },
                { id: 'contact', label: (t("contact") || 'Contact').charAt(0).toUpperCase() + (t("contact") || 'Contact').slice(1) }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    // Special case: ensure 'pricing' scrolls to the correct section id
                    if (item.id === 'pricing') {
                      scrollToSection('pricing');
                    } else {
                      scrollToSection(item.id);
                    }
                  }} 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer transform active:scale-95 drop-shadow-sm ${
                    activeSection === item.id 
                      ? 'text-[#ffe7c3] font-semibold bg-black/20 shadow-lg scale-105' 
                      : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </>
          ) : (
            <>
              {[
                { id: 'hero', label: t("home"), to: '/' },
                { id: 'benefits', label: t("features"), to: '/#benefits' },
                { id: 'themes', label: 'Themes', to: '/#themes' },
                { id: 'pricing', label: t("pricing"), to: '/#pricing' },
                { id: 'contact', label: (t("contact") || 'Contact').charAt(0).toUpperCase() + (t("contact") || 'Contact').slice(1), to: '/#contact' }
              ].map((item) => (
                <Link 
                  key={item.id}
                  to={item.to}
                  className="px-4 py-2 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('contact')}
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
                {[
                  { id: 'hero', label: t("home") },
                  { id: 'benefits', label: t("features") },
                  { id: 'themes', label: 'Themes' },
                  { id: 'pricing', label: t("pricing") },
                  { id: 'contact', label: t("contact") || 'Contact' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)} 
                    className={`px-4 py-3 rounded-lg transition-all duration-300 transform active:scale-95 drop-shadow-sm ${
                      activeSection === item.id 
                        ? 'text-[#ffe7c3] font-semibold bg-black/20 scale-105' 
                        : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </>
            ) : (
              <>
                {[
                  { id: 'hero', label: t("home"), to: '/' },
                  { id: 'benefits', label: t("features"), to: '/#benefits' },
                  { id: 'themes', label: 'Themes', to: '/#themes' },
                  { id: 'pricing', label: t("pricing"), to: '/#pricing' },
                  { id: 'contact', label: t("contact") || 'Contact', to: '/#contact' }
                ].map((item) => (
                  <Link 
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpen(false)} 
                    className="px-4 py-3 rounded-lg hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md transition-all duration-200 transform active:scale-95 drop-shadow-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
            
            {/* Mobile CTA */}
            <button 
              onClick={() => scrollToSection('contact')} 
              className="mt-4 bg-gradient-to-r from-yellow-700 to-yellow-800 hover:from-yellow-800 hover:to-yellow-900 hover:scale-110 hover:shadow-xl text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform active:scale-95"
              type="button"
            >
              {t("signup")}
            </button>

            {/* Mobile Language Switcher */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};