import React, { useRef, useEffect, useState } from "react";
import { ContainerScrollTitle } from "./ContainerScrollTitle";
import { ContainerScrollCard } from "./ContainerScrollCard";

interface ContainerScrollProps {
  title?: React.ReactNode;
  card?: React.ReactNode;
}

const ContainerScroll: React.FC<ContainerScrollProps> = ({ title, card }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Check if section is in view
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      // Section is in view when it overlaps with viewport
      const inView = sectionTop < windowHeight && sectionBottom > 0;
      setIsInView(inView);
      
      // Enhanced scroll progress calculation for smoother animation
      let progress = 0;
      
      // Start animation when section enters viewport
      if (sectionBottom > 0 && sectionTop < windowHeight) {
        // Calculate how much of the section has been scrolled through
        const scrollableDistance = sectionHeight + windowHeight;
        const scrolled = windowHeight - sectionTop;
        
        // Progress from 0 to 1 as user scrolls through the section
        progress = Math.max(0, Math.min(1, scrolled / (scrollableDistance * 0.8)));
        
        // Apply smooth easing for natural movement, but cap at 0.7 to keep tablet and text visible
        progress = Math.min(0.7, easeInOutCubic(progress));
      }
      
      setScrollProgress(progress);
    };

    // Use requestAnimationFrame for smoother scroll handling with improved throttling
    let ticking = false;
    let lastTime = 0;
    const smoothScrollHandler = () => {
      const now = performance.now();
      if (!ticking && now - lastTime > 8) { // Limit to ~120fps for smoothness
        requestAnimationFrame(() => {
          handleScroll();
          lastTime = now;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", smoothScrollHandler, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", smoothScrollHandler);
  }, []);

  // Enhanced easing function for smoother motion
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Improved 3D animation values for horizontal tablet - smoother and straighter
  const rotateX = 25 * (1 - scrollProgress); // Reduced initial tilt for smoother movement
  const rotateY = -8 * (1 - scrollProgress); // Reduced horizontal rotation to keep tablet straighter
  const rotateZ = 2 * (1 - scrollProgress); // Minimal Z-axis rotation for natural look
  
  const scale = isMobile 
    ? 0.2 + (0.4 * scrollProgress) // Mobile: 20% to 60%
    : 0.3 + (0.4 * scrollProgress); // Desktop: 30% to 70%
  
  const translateY = 400 * (1 - scrollProgress); // Smoother rise from below
  const translateZ = -600 * (1 - scrollProgress); // More controlled 3D approach
  const opacity = Math.min(1, scrollProgress * 1.5); // Gradual fade in

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-[#2C1E1A] via-[#3A2B24] to-[#2C1E1A]"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      
      {/* Enhanced ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232, 108, 40, 0.15) 0%, rgba(195, 86, 29, 0.08) 40%, transparent 70%)',
            filter: 'blur(80px)',
            transform: `translate(${scrollProgress * 60}px, ${scrollProgress * 40}px) scale(${1 + scrollProgress * 0.3})`,
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(122, 90, 72, 0.12) 0%, rgba(74, 55, 46, 0.06) 50%, transparent 70%)',
            filter: 'blur(100px)',
            transform: `translate(-${scrollProgress * 70}px, -${scrollProgress * 50}px) scale(${1 + scrollProgress * 0.4})`,
          }}
        />
        
        {/* Additional ambient lights */}
        <div 
          className="absolute top-1/2 left-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(232, 108, 40, 0.08) 0%, transparent 60%)',
            filter: 'blur(120px)',
            transform: `translate(-50%, -50%) rotate(${scrollProgress * 20}deg)`,
          }}
        />
      </div>
      
      {/* Title Container - Improved positioning */}
      <div className="relative z-40 pt-16 pb-12">
        <ContainerScrollTitle 
          isInView={isInView}
          style={{
            transform: `translateY(${scrollProgress * -30}px)`,
            opacity: Math.max(0.3, 1 - scrollProgress * 0.7),
          }}
        >
          {title}
        </ContainerScrollTitle>
      </div>
      
      {/* 3D Tablet Container - Enhanced for horizontal layout */}
      <div className="relative z-30" style={{ height: '50vh', marginTop: '0.5rem' }}>
        <div className="sticky top-0 transform -translate-y-80">
          <ContainerScrollCard 
            rotate={rotateX}
            rotateY={rotateY}
            rotateZ={rotateZ}
            scale={scale}
            translateY={translateY}
            translateZ={translateZ}
            opacity={opacity}
            isHorizontal={true}
          >
            {card}
          </ContainerScrollCard>
        </div>
      </div>
      


      {/* CSS animations */}
  <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        @keyframes scrollBounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(12px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default ContainerScroll;