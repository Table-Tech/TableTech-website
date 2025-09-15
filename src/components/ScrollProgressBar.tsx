import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / documentHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Initial calculation on mount
    handleScroll();

    // Use requestAnimationFrame for smooth updates
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200/30 z-50 transition-opacity duration-300"
      style={{ 
        opacity: scrollProgress > 0 ? 1 : 0,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div 
        className="h-full bg-gradient-to-r from-[#E86C28] to-[#FFA94D] transition-all duration-150 ease-out"
        style={{ 
          width: `${scrollProgress}%`,
          boxShadow: '0 0 10px rgba(232, 108, 40, 0.5)',
        }}
      />
    </div>
  );
};
