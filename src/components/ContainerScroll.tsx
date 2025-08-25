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
  const [scrollYProgress, setScrollYProgress] = useState(0);
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
      const scrollY = window.scrollY;
      const bottom = rect.bottom + scrollY;
      
      // Check if section is in view
      const inView = rect.top < windowHeight && rect.bottom > 0;
      setIsInView(inView);
      
      // Vue-style scroll progress calculation
      const progress = bottom > 0 ? 1 - Math.max(0, bottom - scrollY) / windowHeight : 0;
      setScrollYProgress(Math.max(0, Math.min(1, progress)));
    };

    // Smooth scroll handling
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

  // Vue-style animation calculations
  const scaleDimensions = isMobile ? [0.7, 0.9] : [1.05, 1];
  const rotate = 20 * (1 - scrollYProgress);
  const scale = scaleDimensions[0] + (scaleDimensions[1] - scaleDimensions[0]) * scrollYProgress;
  const translateY = -100 * scrollYProgress;

  return (
    <div 
      ref={containerRef}
      className="relative flex h-[60rem] md:h-[80rem] flex-col justify-center p-2 md:p-20 bg-gradient-to-b from-[#2C1E1A] via-[#3A2B24] to-[#2C1E1A]"
    >
      <div
        className="relative w-full flex flex-col items-center space-y-8 md:space-y-16"
        style={{ perspective: '1000px' }}
      >
        <div className="w-full">
          <ContainerScrollTitle translate={translateY}>
            {title}
          </ContainerScrollTitle>
        </div>
        <div className="w-full flex justify-center">
          <ContainerScrollCard
            rotate={rotate}
            scale={scale}
          >
            {card}
          </ContainerScrollCard>
        </div>
      </div>
    </div>
  );
};

export default ContainerScroll;