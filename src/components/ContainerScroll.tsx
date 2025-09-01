import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ContainerScrollTitle } from "./ContainerScrollTitle";
import { ContainerScrollCard } from "./ContainerScrollCard";
import { useThrottledCallback } from "../hooks/useThrottledCallback";

interface ContainerScrollProps {
  title?: React.ReactNode;
  card?: React.ReactNode;
}

// Types for scroll state
interface ScrollState {
  scrollYProgress: number;
  isInView: boolean;
  windowHeight: number;
  containerBottom: number;
}

const ContainerScroll = ({ title, card }: ContainerScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollYProgress: 0,
    isInView: false,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    containerBottom: 0
  });

  // Memoized mobile detection
  const updateIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile, { passive: true });
    return () => window.removeEventListener("resize", updateIsMobile);
  }, [updateIsMobile]);

  // Enhanced scroll calculation with Lenis integration
  const calculateScrollProgress = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Get scroll position (fallback to regular scroll if Lenis not available)
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const containerBottom = rect.bottom + scrollY;
    const containerHeight = rect.height;
    
    // Enhanced in-view detection
    const inView = rect.top < windowHeight * 1.2 && rect.bottom > -windowHeight * 0.2;
    
    // Vue-style scroll progress with enhanced easing
    let progress = 0;
    if (containerBottom > scrollY) {
      const remaining = Math.max(0, containerBottom - scrollY);
      const totalScrollable = containerHeight + windowHeight;
      progress = Math.max(0, Math.min(1, (totalScrollable - remaining) / totalScrollable));
    } else {
      progress = 1;
    }
    
    // Smooth easing function for more natural animation
    const easedProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    setScrollState({
      scrollYProgress: easedProgress,
      isInView: inView,
      windowHeight,
      containerBottom
    });
  }, []);

  // Throttled scroll handler for performance
  const throttledScrollHandler = useThrottledCallback(calculateScrollProgress, 16); // ~60fps

  useEffect(() => {
    // Initial calculation with delay to ensure proper mounting
    const initialTimer = setTimeout(calculateScrollProgress, 100);
    
    // Setup scroll listener (using standard scroll events)
    const setupScrollListener = () => {
      // Use standard scroll events for compatibility
      window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    };
    
    setupScrollListener();
    
    // Also listen to resize for recalculation with debounce
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateScrollProgress, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(resizeTimer);
      
      // Cleanup scroll listeners  
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateScrollProgress, throttledScrollHandler]);

  // Memoized animation calculations for performance
  const animationValues = useMemo(() => {
    const { scrollYProgress } = scrollState;
    
    // Enhanced scale dimensions with smoother transitions
    const scaleDimensions = isMobile ? [0.65, 0.95] : [1.08, 1.02];
    
    // More dynamic rotation with easing
    const maxRotation = isMobile ? 15 : 25;
    const rotate = maxRotation * (1 - scrollYProgress);
    
    // Smoother scale transition
    const [startScale, endScale] = scaleDimensions;
    const scale = startScale + (endScale - startScale) * scrollYProgress;
    
    // Enhanced Y translation with more dramatic effect
    const maxTranslateY = isMobile ? -80 : -120;
    const translateY = maxTranslateY * scrollYProgress;
    
    return { rotate, scale, translateY };
  }, [scrollState, isMobile]);

  return (
    <div 
      ref={containerRef}
      className="relative flex h-[50rem] md:h-[65rem] items-center justify-center p-2 md:p-12 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2C1E1A 0%, #3A2B24 50%, #2C1E1A 100%)'
      }}
    >
      {/* Animated background elements for depth */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl transform transition-transform duration-1000"
          style={{
            transform: `translateX(${animationValues.translateY * 0.3}px) translateY(${animationValues.translateY * 0.2}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl transform transition-transform duration-1000"
          style={{
            transform: `translateX(${animationValues.translateY * -0.2}px) translateY(${animationValues.translateY * 0.4}px)`
          }}
        />
      </div>
      
      <div
        className="relative w-full py-6 md:py-20"
        style={{ perspective: '1000px' }}
      >
        <ContainerScrollTitle translate={animationValues.translateY}>
          {title}
        </ContainerScrollTitle>
        
        <ContainerScrollCard
          rotate={animationValues.rotate}
          scale={animationValues.scale}
          isInView={scrollState.isInView}
        >
          {card}
        </ContainerScrollCard>
      </div>
    </div>
  );
};

export default ContainerScroll;