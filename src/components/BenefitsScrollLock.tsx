import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import SharedBackground from "./SharedBackground";

export const BenefitsScrollLock: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hasCompletedSequence, setHasCompletedSequence] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);
  const isTransitioning = useRef<boolean>(false);

  const benefits = [
    { component: BenefitsOne, id: "benefits-1" },
    { component: BenefitsTwo, id: "benefits-2" },
    { component: BenefitsThree, id: "benefits-3" }
  ];

  // Animation variants
  const slideVariants = {
    enter: {
      x: "100%",
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setIsInView(true);
            // Save current scroll position
            lastScrollY.current = window.scrollY;
          } else {
            setIsInView(false);
            scrollAccumulator.current = 0;
          }
        });
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView || hasCompletedSequence) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isInView || hasCompletedSequence || isTransitioning.current) return;

      // Prevent default scrolling
      e.preventDefault();
      e.stopPropagation();

      // Accumulate scroll delta
      scrollAccumulator.current += e.deltaY;

      // Threshold for triggering transition (adjust for sensitivity)
      const threshold = 100;

      if (Math.abs(scrollAccumulator.current) > threshold) {
        if (scrollAccumulator.current > 0 && currentBenefit < benefits.length - 1) {
          // Scroll down - next benefit
          isTransitioning.current = true;
          setCurrentBenefit(prev => prev + 1);
          scrollAccumulator.current = 0;
          
          setTimeout(() => {
            isTransitioning.current = false;
          }, 500);
        } else if (scrollAccumulator.current < 0 && currentBenefit > 0) {
          // Scroll up - previous benefit
          isTransitioning.current = true;
          setCurrentBenefit(prev => prev - 1);
          scrollAccumulator.current = 0;
          
          setTimeout(() => {
            isTransitioning.current = false;
          }, 500);
        } else if (scrollAccumulator.current > 0 && currentBenefit === benefits.length - 1) {
          // Completed viewing all benefits
          setHasCompletedSequence(true);
          scrollAccumulator.current = 0;
        }
      }

      // Keep the page locked at the same position
      window.scrollTo(0, lastScrollY.current);
    };

    const handleScroll = (e: Event) => {
      if (!isInView || hasCompletedSequence) return;
      
      // Force scroll position to stay locked
      e.preventDefault();
      window.scrollTo(0, lastScrollY.current);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInView || hasCompletedSequence || isTransitioning.current) return;

      const scrollKeys = ['ArrowDown', 'PageDown', 'End', ' ', 'ArrowUp', 'PageUp', 'Home'];
      
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && currentBenefit < benefits.length - 1) {
          isTransitioning.current = true;
          setCurrentBenefit(prev => prev + 1);
          setTimeout(() => { isTransitioning.current = false; }, 500);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentBenefit > 0) {
          isTransitioning.current = true;
          setCurrentBenefit(prev => prev - 1);
          setTimeout(() => { isTransitioning.current = false; }, 500);
        } else if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && currentBenefit === benefits.length - 1) {
          setHasCompletedSequence(true);
        }
      }
    };

    // Touch handling for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!isInView || hasCompletedSequence) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isInView || hasCompletedSequence || isTransitioning.current) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isInView || hasCompletedSequence || isTransitioning.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentBenefit < benefits.length - 1) {
          isTransitioning.current = true;
          setCurrentBenefit(prev => prev + 1);
          setTimeout(() => { isTransitioning.current = false; }, 500);
        } else if (deltaY < 0 && currentBenefit > 0) {
          isTransitioning.current = true;
          setCurrentBenefit(prev => prev - 1);
          setTimeout(() => { isTransitioning.current = false; }, 500);
        } else if (deltaY > 0 && currentBenefit === benefits.length - 1) {
          setHasCompletedSequence(true);
        }
      }
    };

    // Add all event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Lock body scroll
    if (isInView && !hasCompletedSequence) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isInView, currentBenefit, hasCompletedSequence, benefits.length]);

  // Reset when out of view
  useEffect(() => {
    if (!isInView) {
      setCurrentBenefit(0);
      setHasCompletedSequence(false);
    }
  }, [isInView]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden"
      style={{ 
        position: isInView && !hasCompletedSequence ? 'sticky' : 'relative',
        top: isInView && !hasCompletedSequence ? '0' : 'auto'
      }}
    >
      <SharedBackground>
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={benefits[currentBenefit].id}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {React.createElement(benefits[currentBenefit].component)}
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-50">
            {benefits.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  if (!isTransitioning.current) {
                    isTransitioning.current = true;
                    setCurrentBenefit(index);
                    setTimeout(() => { isTransitioning.current = false; }, 500);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentBenefit === index 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to benefit ${index + 1}`}
              />
            ))}
          </div>

          {/* Scroll hint */}
          {isInView && !hasCompletedSequence && currentBenefit < benefits.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-sm flex flex-col items-center"
            >
              <span>Scroll voor meer</span>
              <motion.svg
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-6 mt-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </motion.div>
          )}

          {/* Completion message */}
          {hasCompletedSequence && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 right-8 bg-green-500/20 backdrop-blur-sm border border-green-400/50 rounded-lg px-4 py-2"
            >
              <span className="text-green-300 text-sm">✓ Je kunt nu verder scrollen</span>
            </motion.div>
          )}
        </div>
      </SharedBackground>
    </div>
  );
};