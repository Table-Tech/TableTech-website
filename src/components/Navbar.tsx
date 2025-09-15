import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  const navbarRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
            // Strong blur effect with brown tint when scrolled
            const opacity = Math.min(0.25, scrollY / 200); // Gradually increase opacity
            const blurAmount = Math.min(20, scrollY / 10); // Gradually increase blur
            
            gsap.to(navbarRef.current, {
              backgroundColor: `rgba(41, 37, 36, ${opacity})`, // stone-800 with opacity
              backdropFilter: `blur(${blurAmount}px) saturate(1.8)`,
              borderColor: "rgba(168, 162, 158, 0.2)", // stone-400 with opacity
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

  // Animate sidebar
  useLayoutEffect(() => {
    if (!sidebarRef.current) return;

    if (open) {
      gsap.fromTo(sidebarRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.3, ease: "power2.out" }
      );
    }
  }, [open]);

  // Track active section with proper order
  useEffect(() => {
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
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && open) {
        // Check if the click was on the hamburger button
        const hamburgerButton = document.querySelector('[aria-label*="menu"]');
        if (hamburgerButton && hamburgerButton.contains(event.target as Node)) {
          return;
        }
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string): void => {
    setOpen(false);

    // Prevent multiple scroll operations
    if (isScrolling) return;

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      
      if (element) {
        setIsScrolling(true);
        const elementTop = element.offsetTop;
        const offset = 100; // Increased offset for larger navbar
        const targetPosition = Math.max(0, elementTop - offset);
        
        // Use Lenis if available (preferred method)
        if (window.lenis) {
          window.lenis.scrollTo(targetPosition, { 
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easeOutExpo
          });
          // Set timeout to reset scrolling state after animation duration
          setTimeout(() => {
            setIsScrolling(false);
          }, 1200); // Match duration
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
    <>
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
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 lg:py-6 xl:py-7">
          {/* Logo - Larger with more padding */}
          <button
            onClick={() => scrollToSection('hero')}
            className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wide text-white drop-shadow-lg transition-all duration-300 transform hover:text-[#ffe7c3] hover:scale-105 hover:drop-shadow-2xl active:scale-95 flex-shrink-0 ml-2 lg:ml-4"
            type="button"
          >
            TableTech
          </button>

          {/* Desktop Navigation - Hide "Probeer gratis" on certain iPad sizes */}
          <nav className="hidden md:flex items-center text-base lg:text-lg font-medium mr-2 lg:mr-4">
            <div className="flex items-center space-x-3 lg:space-x-5 xl:space-x-7 2xl:space-x-9">
              {[ 
                { id: 'hero', label: t("home") },
                { id: 'benefits', label: t("features") },
                { id: 'themes', label: 'Themes' },
                { id: 'pricing', label: t("pricing") },
                { id: 'contact', label: 'Contact' }
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
                  className={`px-3 lg:px-4 xl:px-5 py-2.5 lg:py-3 rounded-lg transition-all duration-300 cursor-pointer transform active:scale-95 drop-shadow-sm whitespace-nowrap ${
                    activeSection === item.id 
                      ? 'text-[#ffe7c3] font-semibold bg-black/20 shadow-lg scale-105' 
                      : 'hover:text-[#ffe7c3] hover:bg-black/10 hover:scale-105 hover:shadow-md'
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              ))}

              {/* Language Switcher with spacing */}
              <div className="ml-3 lg:ml-5">
                <LanguageSwitcher />
              </div>

              {/* CTA Button - Hidden on medium iPads (768-1023px) to save space */}
              <button
                onClick={() => scrollToSection('contact')}
                className="ml-3 lg:ml-5 bg-gradient-to-r from-yellow-700 to-yellow-800 hover:from-yellow-800 hover:to-yellow-900 hover:scale-110 hover:shadow-xl text-white px-5 lg:px-6 xl:px-7 py-2.5 lg:py-3 rounded-full font-medium text-base lg:text-lg transition-all duration-300 transform active:scale-95 shadow-lg whitespace-nowrap hidden lg:block"
                type="button"
              >
                {t("signup")}
              </button>
            </div>
          </nav>

          {/* Mobile hamburger menu - Larger icon */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden focus:outline-none transform active:scale-95 transition-transform duration-150 hover:scale-110 hover:text-[#ffe7c3] z-50 mr-2" 
            aria-label={open ? "Sluit menu" : "Open menu"}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Menu - Right Side */}
      {open && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setOpen(false)}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          />
          
          {/* Sidebar */}
          <div 
            ref={sidebarRef}
            className="md:hidden fixed top-0 right-0 h-full w-[280px] bg-gradient-to-b from-[#4a3a30]/70 via-[#3a2a20]/60 to-[#2a1a10]/70 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(74, 58, 48, 0.75) 0%, rgba(58, 42, 32, 0.65) 50%, rgba(42, 26, 16, 0.75) 100%)',
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 231, 195, 0.05)'
            }}
          >
            {/* Close button inside sidebar */}
            <div className="flex justify-end p-5">
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-[#ffe7c3] transition-colors duration-200"
                aria-label="Sluit menu"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Menu Items */}
            <nav className="flex flex-col px-6 pb-8 text-white font-medium">
              {[
                { id: 'hero', label: t("home") },
                { id: 'benefits', label: t("features") },
                { id: 'themes', label: 'Themes' },
                { id: 'pricing', label: t("pricing") },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className={`text-left px-4 py-4 mb-2 rounded-lg text-base transition-all duration-300 transform active:scale-95 ${
                    activeSection === item.id 
                      ? 'text-[#ffe7c3] font-semibold bg-white/10 scale-105 border-l-4 border-[#ffe7c3] shadow-lg' 
                      : 'hover:text-[#ffe7c3] hover:bg-white/5 hover:scale-105 hover:pl-6'
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Divider */}
              <div className="my-4 border-t border-white/10"></div>
              
              {/* Mobile Language Switcher */}
              <div className="px-4 py-3">
                <p className="text-sm text-white/70 mb-3">Language</p>
                <LanguageSwitcher />
              </div>
              
              {/* Mobile CTA */}
              <button 
                onClick={() => scrollToSection('contact')} 
                className="mx-4 mt-6 bg-gradient-to-r from-yellow-700 to-yellow-800 hover:from-yellow-800 hover:to-yellow-900 hover:scale-105 hover:shadow-xl text-white px-6 py-3 rounded-full font-medium text-base transition-all duration-300 transform active:scale-95 shadow-lg"
                type="button"
              >
                {t("signup")}
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
};