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
  const isLockedRef = useRef(false);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);

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
    const checkAndLockScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      // Stop or start Lenis based on view state
      if (window.lenis) {
        if (isInView && !isLockedRef.current) {
          // Entering benefits section - stop Lenis
          window.lenis.stop();
          isLockedRef.current = true;
        } else if (!isInView && isLockedRef.current) {
          // Leaving benefits section - start Lenis
          window.lenis.start();
          isLockedRef.current = false;
        } else if (isInView && currentBenefit === 2) {
          // At last benefit - check if we should unlock
          const scrollY = window.scrollY;
          const benefitsBottom = container.offsetTop + container.offsetHeight;
          
          // If we're at the last benefit and trying to scroll down
          if (scrollY >= benefitsBottom - window.innerHeight) {
            window.lenis.start();
            isLockedRef.current = false;
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (!isInView) return;

      // Prevent default scroll
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastScrollTime.current > 100) {
        scrollAccumulator.current = 0;
      }
      lastScrollTime.current = now;

      scrollAccumulator.current += e.deltaY;

      if (Math.abs(scrollAccumulator.current) > 50) {
        if (scrollAccumulator.current > 0) {
          // Scrolling down
          if (currentBenefit < benefits.length - 1) {
            setDirection(1);
            setCurrentBenefit(prev => prev + 1);
          } else {
            // At last benefit, unlock and continue scroll
            if (window.lenis) {
              window.lenis.start();
              isLockedRef.current = false;
              // Scroll to next section
              const nextSection = document.getElementById('themes');
              if (nextSection) {
                setTimeout(() => {
                  window.lenis?.scrollTo(nextSection.offsetTop);
                }, 100);
              }
            }
          }
        } else {
          // Scrolling up
          if (currentBenefit > 0) {
            setDirection(-1);
            setCurrentBenefit(prev => prev - 1);
          } else {
            // At first benefit, unlock and scroll to hero
            if (window.lenis) {
              window.lenis.start();
              isLockedRef.current = false;
              const heroSection = document.getElementById('hero');
              if (heroSection) {
                setTimeout(() => {
                  window.lenis?.scrollTo(heroSection.offsetTop);
                }, 100);
              }
            }
          }
        }
        scrollAccumulator.current = 0;
      }
    };

    // Check on mount and scroll
    checkAndLockScroll();
    window.addEventListener('scroll', checkAndLockScroll);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', checkAndLockScroll);
      window.removeEventListener('wheel', handleWheel);
      // Ensure Lenis is started when component unmounts
      if (window.lenis && isLockedRef.current) {
        window.lenis.start();
      }
    };
  }, [currentBenefit]);

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