// src/components/ScrollDots.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "benefits", label: "Voordelen" },
  { id: "dashboard", label: "Dashboard" },
  { id: "pricing", label: "Prijzen" },
  { id: "cta", label: "Contact" }
];

export const ScrollDots: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Only run effect logic if we're on homepage
    if (!isHomePage) return;

    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    // Intersection Observer voor betere performance
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: [0.2, 0.5, 0.8],
        rootMargin: "-20% 0px -20% 0px"
      }
    );

    // Observeer alle secties
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    // Fallback scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Gebruik Lenis smooth scroll indien beschikbaar
      const lenis = window.lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(element, { 
          duration: 1.5, 
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      } else {
        // Fallback naar native smooth scroll
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Early return AFTER all hooks
  if (!isHomePage) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="relative group">
            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
              {section.label}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-white border-l-opacity-90 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
            
            {/* Dot - groter gemaakt */}
            <button
              onClick={() => scrollToSection(section.id)}
              className={`relative w-5 h-5 rounded-full border-2 transition-all duration-300 hover:scale-125 ${
                activeSection === section.id
                  ? "bg-orange-500 border-orange-500 shadow-lg shadow-orange-500 shadow-opacity-30"
                  : "bg-white bg-opacity-30 border-white border-opacity-50 hover:bg-opacity-50 hover:border-opacity-70"
              }`}
              aria-label={`Scroll naar ${section.label}`}
              type="button"
            >
              {/* Active indicator */}
              {activeSection === section.id && (
                <div className="absolute inset-0 rounded-full bg-orange-500 animate-pulse"></div>
              )}
              
              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 scale-0 group-hover:scale-150 transition-transform duration-500"></div>
            </button>
          </div>
        ))}
      </div>
      
      {/* ✅ Progress bar weggehaald */}
    </div>
  );
};