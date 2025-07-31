import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import SharedBackground from "./SharedBackground";

export const BenefitsHorizontalLock: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [viewedBenefits, setViewedBenefits] = useState(new Set([0])); // Track all viewed benefits
  const [direction, setDirection] = useState(0); // For animation direction
  
  // Bidirectional navigation state
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'reverse'>('forward');
  const [hasSeenAllForward, setHasSeenAllForward] = useState(false);
  const [isCentering, setIsCentering] = useState(false);
  
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lockPositionRef = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);
  const lastScrollY = useRef<number>(window.scrollY);
  const isTransitioning = useRef<boolean>(false);
  const centeringTimeout = useRef<NodeJS.Timeout>();
  const originalBodyStyles = useRef<{
    position: string;
    top: string;
    width: string;
    overflow: string;
  }>({
    position: '',
    top: '',
    width: '',
    overflow: ''
  });

  const benefits = [
    { component: BenefitsOne, id: "benefits-1" },
    { component: BenefitsTwo, id: "benefits-2" },
    { component: BenefitsThree, id: "benefits-3" }
  ];

  // Check if all benefits have been viewed
  const allBenefitsViewed = viewedBenefits.size === benefits.length;

  // Scroll direction detection
  useEffect(() => {
    const handleGlobalScroll = () => {
      if (isLocked || isCentering) return;
      
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('forward');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('reverse');
      }
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, [isLocked, isCentering]);

  // Smooth slide animation variants with spring physics
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

  // Lock body scroll with proper position fixing
  const lockBodyScroll = useCallback(() => {
    const scrollY = window.scrollY;
    lockPositionRef.current = scrollY;
    
    // Stop Lenis if it exists
    if (window.lenis) {
      window.lenis.stop();
    }
    
    // Store original styles
    originalBodyStyles.current = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };
    
    // Apply scroll lock
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Prevent iOS bounce
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.height = '100%';
    document.documentElement.style.width = '100%';
  }, []);

  const unlockBodyScroll = useCallback(() => {
    // Restore original styles
    document.body.style.position = originalBodyStyles.current.position;
    document.body.style.top = originalBodyStyles.current.top;
    document.body.style.width = originalBodyStyles.current.width;
    document.body.style.overflow = originalBodyStyles.current.overflow;
    
    // Restore documentElement
    document.documentElement.style.overflow = '';
    document.documentElement.style.position = '';
    document.documentElement.style.height = '';
    document.documentElement.style.width = '';
    
    // Restore scroll position
    window.scrollTo(0, lockPositionRef.current);
    
    // Restart Lenis if it exists
    if (window.lenis) {
      window.lenis.start();
    }
  }, []);

  // Center benefits section in viewport before locking
  const scrollToCenter = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    
    setIsCentering(true);
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top;
    
    // Check if Lenis is available and use it
    if (window.lenis) {
      // First stop Lenis to prepare for locking
      window.lenis.stop();
      
      // Manually scroll to position
      window.scrollTo(0, scrollTop);
      
      // Then lock after a short delay
      setTimeout(() => {
        setIsCentering(false);
        lockBodyScroll();
        setIsLocked(true);
      }, 100);
    } else {
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
      
      // Clear any existing timeout
      if (centeringTimeout.current) {
        clearTimeout(centeringTimeout.current);
      }
      
      // Set completion timeout
      centeringTimeout.current = setTimeout(() => {
        setIsCentering(false);
        lockBodyScroll();
        setIsLocked(true);
      }, 800); // Allow time for smooth scroll
    }
  }, [lockBodyScroll]);

  // Check if section is fully visible in viewport
  const isFullyVisible = useCallback(() => {
    const element = containerRef.current;
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Get scroll position from Lenis if available, otherwise use window
    const scrollY = window.lenis ? window.lenis.scroll : window.scrollY;
    
    // Check if section fills viewport with small threshold for float precision
    const isFullyInView = 
      rect.top <= 10 && 
      rect.bottom >= viewportHeight - 10 &&
      rect.height >= viewportHeight * 0.9;
      
    return isFullyInView;
  }, []);

  // Navigation functions with bidirectional flow
  const navigateToNextBenefit = useCallback(() => {
    if (isTransitioning.current || hasUnlocked) return;
    
    if (currentBenefit < benefits.length - 1) {
      isTransitioning.current = true;
      setDirection(1);
      const nextBenefit = currentBenefit + 1;
      setCurrentBenefit(nextBenefit);
      setViewedBenefits(prev => new Set([...prev, nextBenefit]));
      
      // Reset transition flag after animation
      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    } else if (scrollDirection === 'forward' && allBenefitsViewed) {
      // Mark as having seen all forward, unlock and continue down
      setHasSeenAllForward(true);
      setHasUnlocked(true);
      setIsLocked(false);
      unlockBodyScroll();
      
      setTimeout(() => {
        window.scrollBy(0, 100);
      }, 100);
    }
  }, [currentBenefit, benefits.length, allBenefitsViewed, hasUnlocked, scrollDirection, unlockBodyScroll]);

  const navigateToPreviousBenefit = useCallback(() => {
    if (isTransitioning.current || hasUnlocked) return;
    
    if (currentBenefit > 0) {
      isTransitioning.current = true;
      setDirection(-1);
      setCurrentBenefit(prev => prev - 1);
      
      // Reset transition flag after animation
      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    } else if (scrollDirection === 'reverse') {
      // At first benefit and scrolling up - unlock and continue up
      setHasUnlocked(true);
      setIsLocked(false);
      unlockBodyScroll();
      
      setTimeout(() => {
        window.scrollBy(0, -100);
      }, 100);
    }
  }, [currentBenefit, hasUnlocked, scrollDirection, unlockBodyScroll]);

  const navigateToBenefit = useCallback((index: number) => {
    if (isTransitioning.current || hasUnlocked || index === currentBenefit) return;
    
    isTransitioning.current = true;
    setDirection(index > currentBenefit ? 1 : -1);
    setCurrentBenefit(index);
    setViewedBenefits(prev => new Set([...prev, index]));
    
    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioning.current = false;
    }, 600);
  }, [currentBenefit, hasUnlocked]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.85 && !isLocked && !isCentering && !hasUnlocked) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          // Lock when the top of section is near the top of viewport (more strict)
          const sectionNearTop = rect.top <= viewportHeight * 0.05 && rect.top >= -50; 
          
          if (sectionNearTop && entry.intersectionRatio >= 0.9) {
            // Lock immediately without any centering
            setIsLocked(true);
            lockBodyScroll();
            
            // Set initial benefit based on scroll direction
            if (scrollDirection === 'reverse' && hasSeenAllForward) {
              // Coming from below - start at Benefits3
              setCurrentBenefit(2);
              setViewedBenefits(new Set([0, 1, 2])); // Mark all as viewed for reverse nav
            } else {
              // Coming from above - start at Benefits1
              setCurrentBenefit(0);
              setViewedBenefits(new Set([0]));
            }
          }
        } else if (!entry.isIntersecting && isLocked && !hasUnlocked) {
          // Left the section - unlock
          setIsLocked(false);
          setHasUnlocked(false);
          unlockBodyScroll();
          
          // Clear centering timeout if active
          if (centeringTimeout.current) {
            clearTimeout(centeringTimeout.current);
            setIsCentering(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.1, 0.25, 0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0], // More gradual thresholds
      rootMargin: "0px"
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (isLocked) {
        unlockBodyScroll();
      }
      if (centeringTimeout.current) {
        clearTimeout(centeringTimeout.current);
      }
    };
  }, [isLocked, isCentering, scrollDirection, hasSeenAllForward, hasUnlocked, isFullyVisible, scrollToCenter, lockBodyScroll, unlockBodyScroll]);

  useEffect(() => {
    if (!isLocked) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked || hasUnlocked || isCentering) return;
      
      // Completely prevent any default scroll behavior
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
      // Reset accumulator if too much time has passed (momentum reset)
      if (timeSinceLastScroll > 150) {
        scrollAccumulator.current = 0;
      }
      
      lastScrollTime.current = now;
      scrollAccumulator.current += e.deltaY;

      // Dynamic threshold based on scroll speed for natural feel
      const baseThreshold = 80;
      const speedMultiplier = Math.min(Math.abs(e.deltaY) / 50, 2);
      const threshold = baseThreshold / speedMultiplier;

      if (Math.abs(scrollAccumulator.current) > threshold) {
        // Handle navigation based on scroll direction and current state
        if (scrollDirection === 'forward') {
          if (scrollAccumulator.current > 0) {
            // Scrolling down in forward mode = next benefit
            navigateToNextBenefit();
          } else {
            // Scrolling up in forward mode = previous benefit
            navigateToPreviousBenefit();
          }
        } else { // reverse direction
          if (scrollAccumulator.current < 0) {
            // Scrolling up in reverse mode = previous benefit (going backwards)
            navigateToPreviousBenefit();
          } else {
            // Scrolling down in reverse mode = next benefit (even when in reverse)
            navigateToNextBenefit();
          }
        }
        scrollAccumulator.current = 0;
      }

      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked || hasUnlocked) return;

      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        navigateToNextBenefit();
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        navigateToPreviousBenefit();
      }
    };

    // Touch handling with proper gesture support
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isLocked || hasUnlocked) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked || hasUnlocked) return;
      // Prevent default touch scrolling
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isLocked || hasUnlocked) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;

      // Horizontal swipes (primary)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left = next benefit
          navigateToNextBenefit();
        } else {
          // Swipe right = previous benefit
          navigateToPreviousBenefit();
        }
      } 
      // Vertical swipes (secondary - convert to horizontal navigation)
      else if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe up = next benefit (like scroll down)
          navigateToNextBenefit();
        } else {
          // Swipe down = previous benefit (like scroll up)
          navigateToPreviousBenefit();
        }
      }
    };

    // Prevent any scroll events during lock or centering
    const preventDefaultScroll = (e: Event) => {
      if ((isLocked || isCentering) && !hasUnlocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Add all event listeners with proper options
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('scroll', preventDefaultScroll, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('scroll', preventDefaultScroll, { passive: false, capture: true });

    // Additional prevention methods for complete scroll lock
    document.body.addEventListener('touchmove', preventDefaultScroll, { passive: false });
    document.body.addEventListener('wheel', preventDefaultScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('scroll', preventDefaultScroll, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('scroll', preventDefaultScroll, { capture: true });
      document.body.removeEventListener('touchmove', preventDefaultScroll);
      document.body.removeEventListener('wheel', preventDefaultScroll);
    };
  }, [isLocked, hasUnlocked, navigateToNextBenefit, navigateToPreviousBenefit]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen relative"
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

          {/* Enhanced Progress indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
            {benefits.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => navigateToBenefit(index)}
                className={`relative rounded-full transition-all duration-300 ${
                  currentBenefit === index 
                    ? 'w-4 h-4 bg-white shadow-2xl' 
                    : viewedBenefits.has(index)
                    ? 'w-3 h-3 bg-green-400 hover:bg-green-300 cursor-pointer shadow-lg'
                    : 'w-3 h-3 bg-white/30 cursor-pointer hover:bg-white/50'
                }`}
                whileHover={{ 
                  scale: 1.3,
                  boxShadow: "0 0 20px rgba(255,255,255,0.5)"
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 17,
                  delay: index * 0.1
                }}
              >
                {/* Active indicator glow */}
                {currentBenefit === index && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ filter: "blur(4px)", opacity: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Enhanced Navigation hints */}
          {isLocked && !hasUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className="backdrop-blur-sm bg-black/20 rounded-2xl px-6 py-3 border border-white/10">
                {currentBenefit < benefits.length - 1 ? (
                  <>
                    <p className="text-white/90 text-sm font-medium mb-2">
                      Scroll omlaag voor volgende sectie ({currentBenefit + 1}/{benefits.length})
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-white/60"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </motion.div>
                      <span className="text-white/60 text-xs">of swipe horizontaal</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-white/60"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </>
                ) : allBenefitsViewed ? (
                  <>
                    <p className="text-green-300 text-sm font-medium mb-2">
                      ✓ Alle secties bekeken! Scroll omlaag om verder te gaan
                    </p>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-green-400"
                    >
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </motion.div>
                  </>
                ) : (
                  <p className="text-white/70 text-sm">
                    Bekijk alle secties om verder te kunnen
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Keyboard hints (optional) */}
          {isLocked && !hasUnlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 right-8 text-white/40 text-xs"
            >
              <div className="backdrop-blur-sm bg-black/10 rounded-lg px-3 py-2 border border-white/10">
                <p>Gebruik ← → pijltjes of scroll om te navigeren</p>
              </div>
            </motion.div>
          )}
        </div>
      </SharedBackground>
    </div>
  );
};