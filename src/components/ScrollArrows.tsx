import React, { useRef, useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ScrollArrowsProps {
  targetSelector: string; // CSS selector for the scrollable element
}

export const ScrollArrows: React.FC<ScrollArrowsProps> = ({ targetSelector }) => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  // Update scroll state
  const updateScrollState = () => {
    const scrollElement = document.querySelector(targetSelector) as HTMLElement;
    if (scrollElement) {
      scrollElementRef.current = scrollElement;
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  };

  // Set up scroll listener
  useEffect(() => {
    const scrollElement = document.querySelector(targetSelector) as HTMLElement;
    if (scrollElement) {
      scrollElementRef.current = scrollElement;
      updateScrollState();
      
      scrollElement.addEventListener('scroll', updateScrollState, { passive: true });
      return () => {
        scrollElement.removeEventListener('scroll', updateScrollState);
      };
    }
  }, [targetSelector]);

  // Handle continuous scrolling
  const startScrolling = (direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    const scroll = () => {
      if (!scrollElementRef.current) return;
      
      const scrollAmount = direction === 'up' ? -20 : 20;
      scrollElementRef.current.scrollTop += scrollAmount;
      
      // Update scroll state
      updateScrollState();
    };

    // Initial scroll
    scroll();
    
    // Set up interval for continuous scrolling
    scrollIntervalRef.current = setInterval(scroll, 30); // ~33fps
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsScrollingUp(false);
    setIsScrollingDown(false);
  };

  // Handle mouse events for up button
  const handleUpMouseDown = () => {
    if (!canScrollUp) return;
    setIsScrollingUp(true);
    startScrolling('up');
  };

  const handleUpMouseUp = () => {
    setIsScrollingUp(false);
    stopScrolling();
  };

  // Handle mouse events for down button
  const handleDownMouseDown = () => {
    if (!canScrollDown) return;
    setIsScrollingDown(true);
    startScrolling('down');
  };

  const handleDownMouseUp = () => {
    setIsScrollingDown(false);
    stopScrolling();
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Handle mouse leave to stop scrolling
  const handleMouseLeave = () => {
    stopScrolling();
  };

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2 items-center">
      {/* Up Arrow */}
      <button
        onMouseDown={handleUpMouseDown}
        onMouseUp={handleUpMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={!canScrollUp}
        className={`
          w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg border-2
          ${canScrollUp
            ? `bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 
               border-amber-400/50 text-white hover:scale-110 active:scale-95 cursor-pointer
               ${isScrollingUp ? 'scale-95 from-amber-600 to-amber-700' : ''}`
            : 'bg-gray-600/40 border-gray-500/30 text-gray-400 cursor-not-allowed'
          }
        `}
        aria-label="Scroll naar boven"
      >
        <ChevronUp size={16} />
      </button>

      {/* Down Arrow */}
      <button
        onMouseDown={handleDownMouseDown}
        onMouseUp={handleDownMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={!canScrollDown}
        className={`
          w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg border-2
          ${canScrollDown
            ? `bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 
               border-amber-400/50 text-white hover:scale-110 active:scale-95 cursor-pointer
               ${isScrollingDown ? 'scale-95 from-amber-600 to-amber-700' : ''}`
            : 'bg-gray-600/40 border-gray-500/30 text-gray-400 cursor-not-allowed'
          }
        `}
        aria-label="Scroll naar beneden"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
};