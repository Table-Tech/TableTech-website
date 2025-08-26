import React, { useState, useEffect } from 'react';

interface ScrollDotsProps {
  className?: string;
}

export const ScrollDots: React.FC<ScrollDotsProps> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState(0);

  // Define the main sections of the website
  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'themes', label: 'Themes' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    // Set initial state to hero section immediately when component mounts
    setActiveSection(0);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // If we're at the very top, always show hero section
      if (scrollPosition <= 50) {
        setActiveSection(0);
        return;
      }

      // Calculate which section we're in based on scroll position
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean);

      let currentSection = 0;
      
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          
          // For the first section (hero), activate immediately at the top
          // For other sections, activate when halfway through
          const threshold = index === 0 ? 0 : windowHeight / 2;
          
          if (scrollPosition >= elementTop - threshold) {
            currentSection = index;
          }
        }
      });

      // If we're near the bottom, set to last section
      if (scrollPosition + windowHeight >= documentHeight - 100) {
        currentSection = sections.length - 1;
      }

      setActiveSection(currentSection);
    };

    // Run initial check after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sections.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={`fixed right-2 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4 ${className}`}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
            index === activeSection
              ? 'scale-125 shadow-lg border-2 border-white/20'
              : 'hover:scale-110'
          }`}
          style={{
            backgroundColor: index === activeSection ? '#E86C28' : 'rgba(232, 108, 40, 0.4)',
          }}
          onMouseEnter={(e) => {
            if (index !== activeSection) {
              e.currentTarget.style.backgroundColor = 'rgba(232, 108, 40, 0.7)';
            }
          }}
          onMouseLeave={(e) => {
            if (index !== activeSection) {
              e.currentTarget.style.backgroundColor = 'rgba(232, 108, 40, 0.4)';
            }
          }}
          aria-label={`Scroll to ${section.label} section`}
          title={section.label}
        />
      ))}
    </div>
  );
};