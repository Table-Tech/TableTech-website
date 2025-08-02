import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import SharedBackground from "./SharedBackground";

export const BenefitsHorizontalLock: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);

  const benefits = [
    { component: BenefitsOne, id: "benefits-1" },
    { component: BenefitsTwo, id: "benefits-2" },
    { component: BenefitsThree, id: "benefits-3" }
  ];

  // Smooth slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 },
        filter: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
        filter: { duration: 0.2 }
      }
    })
  };

  const navigateToNextBenefit = () => {
    if (currentBenefit < benefits.length - 1) {
      setDirection(1);
      setCurrentBenefit(prev => prev + 1);
    }
  };
  
  const navigateToPreviousBenefit = () => {
    if (currentBenefit > 0) {
      setDirection(-1);
      setCurrentBenefit(prev => prev - 1);
    }
  };

  // Handle horizontal scrolling within the section
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (!isInViewport) return;
      
      // Only handle horizontal scrolling when near center of viewport
      const isNearCenter = rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.7;
      if (!isNearCenter) return;

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
      if (timeSinceLastScroll > 150) {
        scrollAccumulator.current = 0;
      }
      
      lastScrollTime.current = now;
      
      // Check for horizontal scroll intent (deltaX) or strong vertical scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) > 50) {
        scrollAccumulator.current += e.deltaX || e.deltaY;

        const threshold = 80;
        if (Math.abs(scrollAccumulator.current) > threshold) {
          e.preventDefault();
          
          if (scrollAccumulator.current > 0) {
            navigateToNextBenefit();
          } else {
            navigateToPreviousBenefit();
          }
          scrollAccumulator.current = 0;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextBenefit();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPreviousBenefit();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentBenefit]);

  return (
    <div
      ref={containerRef}
      id="benefits-section"
      className="w-full h-screen flex items-center justify-center snap-start"
      style={{
        backgroundColor: 'transparent',
        position: 'relative',
        willChange: 'transform'
      }}
    >
      <SharedBackground>
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={benefits[currentBenefit].id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
              style={{ 
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                perspective: 1000
              }}
            >
              {React.createElement(benefits[currentBenefit].component)}
            </motion.div>
          </AnimatePresence>
        </div>
      </SharedBackground>
    </div>
  );
};
