import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BenefitsOne } from '../pages/LandingPage/Benefits';
import { BenefitsTwo } from '../pages/LandingPage/Benefits-2';
import { BenefitsThree } from '../pages/LandingPage/Benefits-3';
import SharedBackground from './SharedBackground';

export const BenefitsScrollLock: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);
  const isTransitioning = useRef(false);

  const benefits = [
    { component: BenefitsOne, id: 'benefits-1' },
    { component: BenefitsTwo, id: 'benefits-2' },
    { component: BenefitsThree, id: 'benefits-3' }
  ];

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 },
        filter: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
        filter: { duration: 0.2 }
      }
    })
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container || isTransitioning.current) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if section is reasonably centered in viewport
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const isInActiveZone = Math.abs(sectionCenter - viewportCenter) < viewportHeight * 0.4;
      
      // Only handle horizontal scroll when in active zone
      if (!isInActiveZone) {
        return; // Let normal vertical scroll work
      }

      // CRITICAL FIX: Always allow escape routes
      // Allow scrolling up from first benefit if section is moving up
      if (e.deltaY < 0 && currentBenefit === 0 && rect.top < -50) {
        console.log('Allowing scroll up to hero');
        return; // Don't prevent default
      }
      
      // Allow scrolling down from last benefit if section is moving up
      if (e.deltaY > 0 && currentBenefit === benefits.length - 1 && rect.top < -50) {
        console.log('Allowing scroll down to next section');
        return; // Don't prevent default
      }

      // Now we can safely handle horizontal scrolling
      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      
      if (timeDelta > 150) {
        scrollAccumulator.current = 0;
      }
      lastScrollTime.current = now;

      scrollAccumulator.current += e.deltaY * 0.5;
      const threshold = 80;

      if (Math.abs(scrollAccumulator.current) > threshold) {
        // Only prevent default when actually changing slides
        e.preventDefault();
        e.stopPropagation();
        
        isTransitioning.current = true;

        if (scrollAccumulator.current > 0) {
          // Scrolling down
          if (currentBenefit < benefits.length - 1) {
            setDirection(1);
            setCurrentBenefit(prev => prev + 1);
            console.log(`Moving to benefit ${currentBenefit + 2} of ${benefits.length}`);
          } else {
            // At last benefit - navigate to next section
            console.log('At last benefit, moving to themes section');
            const nextSection = document.getElementById('themes');
            if (nextSection) {
              // Use native scroll for reliability
              setTimeout(() => {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }
        } else {
          // Scrolling up
          if (currentBenefit > 0) {
            setDirection(-1);
            setCurrentBenefit(prev => prev - 1);
            console.log(`Moving to benefit ${currentBenefit} of ${benefits.length}`);
          } else {
            // At first benefit - navigate to hero
            console.log('At first benefit, moving to hero section');
            const heroSection = document.getElementById('hero');
            if (heroSection) {
              setTimeout(() => {
                heroSection.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }
        }
        
        scrollAccumulator.current = 0;
        setTimeout(() => {
          isTransitioning.current = false;
        }, 500);
      }
    };

    // Touch support
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > 50) {
        handleWheel(new WheelEvent('wheel', { deltaY }));
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      
      if (!isInView) return;

      if (e.key === 'ArrowRight' && currentBenefit < benefits.length - 1) {
        e.preventDefault();
        setDirection(1);
        setCurrentBenefit(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentBenefit > 0) {
        e.preventDefault();
        setDirection(-1);
        setCurrentBenefit(prev => prev - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentBenefit < benefits.length - 1) {
          setDirection(1);
          setCurrentBenefit(prev => prev + 1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentBenefit > 0) {
          setDirection(-1);
          setCurrentBenefit(prev => prev - 1);
        }
      }
    };

    // Add listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    console.log('BenefitsScrollLock initialized');

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentBenefit, benefits.length]);

  return (
    <div
      ref={containerRef}
      id="benefits-section"
      className="w-full h-screen flex items-center justify-center"
      style={{
        backgroundColor: 'transparent',
        position: 'relative',
        willChange: 'transform'
      }}
    >
      <SharedBackground>
        <div className="w-full h-full relative overflow-hidden">
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
                  perspective: 1000
                }}
              >
                {React.createElement(benefits[currentBenefit].component)}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Progress dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning.current) {
                    setDirection(index > currentBenefit ? 1 : -1);
                    setCurrentBenefit(index);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBenefit 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to benefit ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </SharedBackground>
    </div>
  );
};