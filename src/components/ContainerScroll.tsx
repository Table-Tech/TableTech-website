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
      
      // Start animation only when tablet is fully visible in viewport
      if (sectionBottom > 0 && sectionTop < windowHeight) {
        // Wait until section is 60% into viewport (tablet fully visible)
        const delayThreshold = windowHeight * 0.6;
        const scrolled = windowHeight - sectionTop - delayThreshold;
        
        if (scrolled > 0) {
          // Animation completes over 30% of viewport height after tablet is visible
          const scrollableDistance = windowHeight * 0.3;
          
          // Linear progress calculation
          const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
          
          // Apply gentle easing for natural movement
          progress = Math.min(0.85, easeInOutCubic(rawProgress));
        }
      }
      
      setScrollProgress(progress);
    };

    // Use requestAnimationFrame for ultra-smooth scroll handling
    let ticking = false;
    const smoothScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", smoothScrollHandler, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", smoothScrollHandler);
  }, []);

  // Natural easing function for smooth motion
  const easeInOutCubic = (t: number): number => {
    // Gentle quadratic easing for natural movement
    return t * t * (3 - 2 * t);
  };

  // Natural 3D animation values with gradual motion
  const rotateX = 20 * (1 - scrollProgress); // Gradual initial tilt
  const rotateY = -6 * (1 - scrollProgress); // Subtle horizontal rotation
  const rotateZ = 2 * (1 - scrollProgress); // Gentle Z-axis rotation
  
  const scale = isMobile 
    ? 0.3 + (0.2 * scrollProgress) // Mobile: 30% to 50%
    : 0.35 + (0.2 * scrollProgress); // Desktop: 35% to 55%
  
  const translateY = 100 * (1 - scrollProgress); // Natural vertical movement
  const translateZ = -300 * (1 - scrollProgress); // Gradual depth approach
  const opacity = Math.min(1, scrollProgress * 1.2); // Gentle fade in

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[70vh] overflow-visible bg-gradient-to-b from-[#2C1E1A] via-[#3A2B24] to-[#2C1E1A]"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        clipPath: 'inset(0 0 0 0)',
      }}
    >
      
      {/* Optimized ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none will-change-transform">
        <div 
          className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(232, 108, 40, 0.15) 0%, rgba(195, 86, 29, 0.08) 40%, transparent 70%)',
            filter: 'blur(60px)',
            transform: `translate3d(${scrollProgress * 30}px, ${scrollProgress * 20}px, 0) scale(${1 + scrollProgress * 0.2})`,
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(122, 90, 72, 0.12) 0%, rgba(74, 55, 46, 0.06) 50%, transparent 70%)',
            filter: 'blur(80px)',
            transform: `translate3d(-${scrollProgress * 35}px, -${scrollProgress * 25}px, 0) scale(${1 + scrollProgress * 0.25})`,
          }}
        />
      </div>
      
      {/* Title Container - Improved positioning */}
      <div className="relative z-40 pt-12 pb-2">
        <ContainerScrollTitle 
          isInView={isInView}
          style={{
            transform: `translateY(${scrollProgress * -20}px)`,
            opacity: Math.max(0.4, 1 - scrollProgress * 0.5),
          }}
        >
          {title}
        </ContainerScrollTitle>
      </div>
      
      {/* 3D Tablet Container - Enhanced for horizontal layout */}
      <div className="relative z-30" style={{ minHeight: '50vh', paddingBottom: '8vh', marginTop: '-6rem' }}>
        <div className="sticky top-[5vh] transform -translate-y-8">
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