import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import SharedBackground from "./SharedBackground";

export const BenefitsScrollSequence: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef<number>(0);
  const hasViewedAll = useRef<boolean>(false);
  const originalBodyOverflow = useRef<string>("");

  const benefits = [
    { component: BenefitsOne, id: "benefits-1" },
    { component: BenefitsTwo, id: "benefits-2" },
    { component: BenefitsThree, id: "benefits-3" }
  ];

  // Lock/unlock body scroll
  const lockBodyScroll = useCallback(() => {
    originalBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
  }, []);

  const unlockBodyScroll = useCallback(() => {
    const scrollY = document.body.style.top;
    document.body.style.overflow = originalBodyOverflow.current;
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }, []);

  // Animations variants for slide-in effect
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const handleScroll = useCallback((event: WheelEvent) => {
    if (!isScrollLocked) return;
    
    // Always prevent default scroll when locked
    event.preventDefault();
    event.stopPropagation();

    if (hasViewedAll.current) return;

    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTime.current;
    
    // Debounce scroll events
    if (timeSinceLastScroll < 100) return;
    
    lastScrollTime.current = now;
    
    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const delta = event.deltaY;
    
    if (delta > 0 && currentBenefit < benefits.length - 1) {
      // Scroll down - next benefit
      setCurrentBenefit(prev => prev + 1);
    } else if (delta < 0 && currentBenefit > 0) {
      // Scroll up - previous benefit
      setCurrentBenefit(prev => prev - 1);
    } else if (delta > 0 && currentBenefit === benefits.length - 1) {
      // At the last benefit, scrolling down - wait a bit before unlocking
      scrollTimeoutRef.current = setTimeout(() => {
        hasViewedAll.current = true;
        setIsScrollLocked(false);
        unlockBodyScroll();
      }, 800); // Give user time to see the last benefit
    }
  }, [currentBenefit, isScrollLocked, benefits.length, unlockBodyScroll]);

  // Setup intersection observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setIsScrollLocked(true);
            hasViewedAll.current = false;
            // Ensure we start at the first benefit when entering the section
            setCurrentBenefit(0);
            lockBodyScroll();
          } else if (!entry.isIntersecting && isScrollLocked && hasViewedAll.current) {
            setIsScrollLocked(false);
            unlockBodyScroll();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (isScrollLocked) {
        unlockBodyScroll();
      }
    };
  }, [isScrollLocked, lockBodyScroll, unlockBodyScroll]);

  // Handle scroll events
  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      if (isScrollLocked) {
        handleScroll(e);
      }
    };

    // Add document-level scroll prevention when locked
    const preventScroll = (e: Event) => {
      if (isScrollLocked && !hasViewedAll.current) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener("wheel", handleWheelEvent, { passive: false });
    document.addEventListener("scroll", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    // Also prevent keyboard scrolling
    const preventKeyboardScroll = (e: KeyboardEvent) => {
      if (isScrollLocked && !hasViewedAll.current) {
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (scrollKeys.includes(e.key)) {
          e.preventDefault();
          
          // Handle arrow key navigation
          if (e.key === 'ArrowDown' && currentBenefit < benefits.length - 1) {
            setCurrentBenefit(prev => prev + 1);
          } else if (e.key === 'ArrowUp' && currentBenefit > 0) {
            setCurrentBenefit(prev => prev - 1);
          }
        }
      }
    };

    document.addEventListener("keydown", preventKeyboardScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
      document.removeEventListener("scroll", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", preventKeyboardScroll);
    };
  }, [isScrollLocked, handleScroll, currentBenefit, benefits.length]);

  // Handle touch events for mobile
  useEffect(() => {
    if (!isScrollLocked) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isScrollLocked) {
        touchStartY = e.changedTouches[0].screenY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrollLocked && !hasViewedAll.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isScrollLocked || hasViewedAll.current) return;
      
      touchEndY = e.changedTouches[0].screenY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentBenefit < benefits.length - 1) {
          // Swipe up - next benefit
          setCurrentBenefit(prev => prev + 1);
        } else if (deltaY < 0 && currentBenefit > 0) {
          // Swipe down - previous benefit
          setCurrentBenefit(prev => prev - 1);
        } else if (deltaY > 0 && currentBenefit === benefits.length - 1) {
          // At the last benefit, swiping up
          setTimeout(() => {
            hasViewedAll.current = true;
            setIsScrollLocked(false);
            unlockBodyScroll();
          }, 800);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isScrollLocked, currentBenefit, benefits.length, unlockBodyScroll]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      <SharedBackground>
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={benefits[currentBenefit].id}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              {React.createElement(benefits[currentBenefit].component)}
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-50">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBenefit(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentBenefit === index 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to benefit ${index + 1}`}
              />
            ))}
          </div>

          {/* Scroll hint */}
          {isScrollLocked && currentBenefit < benefits.length - 1 && (
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
        </div>
      </SharedBackground>
    </div>
  );
};