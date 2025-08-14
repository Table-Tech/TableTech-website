import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BenefitsOne } from '../pages/LandingPage/Benefits';
import { BenefitsTwo } from '../pages/LandingPage/Benefits-2';
import { BenefitsThree } from '../pages/LandingPage/Benefits-3';
import SharedBackground from './SharedBackground';

export const BenefitsScrollLock: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [benefitsCompleted, setBenefitsCompleted] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);
  const isTransitioning = useRef(false);
  const viewTimer = useRef<NodeJS.Timeout | null>(null);
  const isInBenefitsRef = useRef(false);

  const benefits = [
    { component: BenefitsOne, id: 'benefits-1' },
    { component: BenefitsThree, id: 'benefits-3' },
    { component: BenefitsTwo, id: 'benefits-2' }
  ];

  const TOTAL_BENEFITS = benefits.length;

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 }
      }
    })
  };

  // Auto-progression timer
  useEffect(() => {
    if (viewTimer.current) {
      clearTimeout(viewTimer.current);
    }

    if (isInBenefitsRef.current && !benefitsCompleted && currentBenefit < TOTAL_BENEFITS) {
      viewTimer.current = setTimeout(() => {
        if (currentBenefit < TOTAL_BENEFITS - 1) {
          setDirection(1);
          setCurrentBenefit(prev => prev + 1);
          // Auto advance to next benefit
        } else if (currentBenefit === TOTAL_BENEFITS - 1) {
          setBenefitsCompleted(true);
          // All benefits viewed - scroll enabled
        }
      }, 6000); // 6 seconds per benefit
    }

    return () => {
      if (viewTimer.current) {
        clearTimeout(viewTimer.current);
      }
    };
  }, [currentBenefit, benefitsCompleted, TOTAL_BENEFITS]);

  // ONE-WAY SCROLL LOCK IMPLEMENTATION
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container || isTransitioning.current) return;

      const rect = container.getBoundingClientRect();
      // Check if we're actually at the benefits section
      const isInBenefitsView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      
      // CRITICAL: Only process if we're actually at the benefits section
      if (!isInBenefitsView) {
        // Reset state when leaving benefits area
        if (rect.top > window.innerHeight) {
          setCurrentBenefit(0);
          setBenefitsCompleted(false);
          // Left benefits area - reset state
        }
        return; // Allow normal scrolling outside benefits
      }

      // SCROLLING UP - ALWAYS ALLOWED
      if (e.deltaY < 0) {
        // Scrolling up detected
        
        // If at first benefit, allow normal scroll up to hero
        if (currentBenefit === 0) {
          // At first benefit, allowing scroll to hero
          // DO NOT preventDefault - let them scroll up freely
          return;
        } else {
          // In middle benefits - go to previous benefit
          e.preventDefault();
          e.stopPropagation();
          
          // Reset auto timer when manually navigating
          if (viewTimer.current) clearTimeout(viewTimer.current);
          
          // Accumulate scroll for smoother control
          const now = Date.now();
          if (now - lastScrollTime.current > 150) {
            scrollAccumulator.current = 0;
          }
          lastScrollTime.current = now;
          scrollAccumulator.current += e.deltaY;

          if (Math.abs(scrollAccumulator.current) > 150) {
            isTransitioning.current = true;
            setDirection(-1);
            setCurrentBenefit(prev => prev - 1);
            // Going back to previous benefit
            scrollAccumulator.current = 0;
            setTimeout(() => { isTransitioning.current = false; }, 400);
          }
        }
      }
      
      // SCROLLING DOWN - CONDITIONAL BLOCKING
      if (e.deltaY > 0) {
        // Scrolling down detected
        
        // Check if we've completed all benefits
        if (currentBenefit === TOTAL_BENEFITS - 1) {
          // At last benefit - ALWAYS block until manually completed
          if (!benefitsCompleted) {
            // Still viewing last benefit - BLOCK scroll down
            e.preventDefault();
            e.stopPropagation();
            // At last benefit - must stay until completed
            return;
          } else {
            // Benefits completed - allow scroll to next section
            // Benefits completed, allowing scroll to next section
            // DO NOT preventDefault - allow scroll to theme section
            return;
          }
        } else {
          // Not at last benefit - block down scroll and go to next benefit
          e.preventDefault();
          e.stopPropagation();
          
          // Reset auto timer when manually navigating
          if (viewTimer.current) clearTimeout(viewTimer.current);
          
          // Accumulate scroll for smoother control
          const now = Date.now();
          if (now - lastScrollTime.current > 150) {
            scrollAccumulator.current = 0;
          }
          lastScrollTime.current = now;
          scrollAccumulator.current += e.deltaY;

          if (scrollAccumulator.current > 150) {
            isTransitioning.current = true;
            setDirection(1);
            setCurrentBenefit(prev => prev + 1);
            // Moving to next benefit
            scrollAccumulator.current = 0;
            setTimeout(() => { isTransitioning.current = false; }, 400);
          }
        }
      }
    };

    // Intersection Observer to detect when entering/leaving benefits
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInBenefitsRef.current = entry.isIntersecting;
          
          if (entry.isIntersecting) {
            // Entered benefits section
          } else {
            // Left benefits section
          }
        });
      },
      { threshold: [0.1, 0.5, 0.9] }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Touch handling for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isInBenefitsRef.current) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      // Same logic as wheel events
      if (deltaY < 0) {
        // Swiping down (scrolling up) - always allowed at first benefit
        if (currentBenefit === 0) return;
      }
      
      if (deltaY > 0 && (currentBenefit < TOTAL_BENEFITS - 1 || !benefitsCompleted)) {
        // Swiping up (scrolling down) - block if not completed
        e.preventDefault();
        
        if (Math.abs(deltaY) > 120) {
          handleWheel(new WheelEvent('wheel', { deltaY }));
          touchStartY = touchY;
        }
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInBenefitsRef.current) return;
      
      if (viewTimer.current) clearTimeout(viewTimer.current);

      if (e.key === 'ArrowRight' && currentBenefit < TOTAL_BENEFITS - 1) {
        e.preventDefault();
        setDirection(1);
        setCurrentBenefit(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentBenefit > 0) {
        e.preventDefault();
        setDirection(-1);
        setCurrentBenefit(prev => prev - 1);
      } else if (e.key === 'ArrowDown' && !benefitsCompleted) {
        e.preventDefault();
        if (currentBenefit < TOTAL_BENEFITS - 1) {
          setDirection(1);
          setCurrentBenefit(prev => prev + 1);
        }
      } else if (e.key === 'ArrowUp' && currentBenefit > 0) {
        e.preventDefault();
        setDirection(-1);
        setCurrentBenefit(prev => prev - 1);
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // One-way scroll lock initialized

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [currentBenefit, benefitsCompleted, TOTAL_BENEFITS]);

  // Smooth return behavior when scrolling back from theme section
  useEffect(() => {
    const handleSmoothReturn = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      
      // If benefits section is below viewport and we're at benefit > 0
      if (rect.top > window.innerHeight && currentBenefit > 0) {
        // Reset to first benefit for smooth return
        setCurrentBenefit(0);
        setBenefitsCompleted(false);
        // Reset to first benefit for smooth return
      }
    };
    
    window.addEventListener('scroll', handleSmoothReturn, { passive: true });
    return () => window.removeEventListener('scroll', handleSmoothReturn);
  }, [currentBenefit]);

  return (
    <div
      ref={containerRef}
      id="benefits-section"
      className="benefits-section min-h-screen relative"
    >
      <div className="benefits-container h-screen overflow-hidden sticky top-0">
        <SharedBackground>
          <div className="w-full h-full relative">
            <AnimatePresence mode="wait" custom={direction}>
              {benefits[currentBenefit] && (
                <motion.div
                  key={benefits[currentBenefit].id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {React.createElement(benefits[currentBenefit].component)}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Progress indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
              {[...Array(TOTAL_BENEFITS)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (viewTimer.current) clearTimeout(viewTimer.current);
                    
                    if (!isTransitioning.current) {
                      setDirection(index > currentBenefit ? 1 : -1);
                      setCurrentBenefit(index);
                      // Reset benefits completed when manually navigating
                      setBenefitsCompleted(false);
                      
                      // Start auto-complete timer for last benefit
                      if (index === TOTAL_BENEFITS - 1) {
                        setTimeout(() => {
                          setBenefitsCompleted(true);
                          // Last benefit auto-completed after manual navigation
                        }, 4000);
                      }
                    }
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentBenefit 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Benefit ${index + 1} of ${TOTAL_BENEFITS}`}
                />
              ))}
            </div>

          </div>
        </SharedBackground>
      </div>
    </div>
  );
};