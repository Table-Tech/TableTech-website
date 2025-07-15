import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import PhoneMockup from "../components/PhoneMock";

interface DemoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToEmployee: () => void;
}

// Extend Window interface for touch tracking
declare global {
  interface Window {
    touchStartY?: number;
  }
}

export const DemoOverlay: React.FC<DemoOverlayProps> = ({
  isOpen,
  onClose,
  onSwitchToEmployee,
}) => {
  // Block/unblock body scroll when overlay opens/closes
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Block scroll on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll when component unmounts or isOpen becomes false
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Enhanced scroll detection with precise mouse position tracking
  useEffect(() => {
    if (!isOpen) return;

    const getTargetScrollContainer = (mouseEvent: MouseEvent): HTMLElement | null => {
      // Get element under mouse cursor
      const elementUnderMouse = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
      if (!elementUnderMouse) return null;

      // Check if we're inside the phone container
      const phoneContainer = elementUnderMouse.closest('[data-phone-container="true"]');
      if (!phoneContainer) return null;

      // Priority 1: Check for product detail scroll area (when product is open)
      const productDetailContainer = elementUnderMouse.closest('[data-product-detail-scroll="true"]');
      if (productDetailContainer) {
        return productDetailContainer as HTMLElement;
      }

      // Priority 2: Check for horizontal scroll (categories)
      const categoriesContainer = elementUnderMouse.closest('.flex.overflow-x-auto');
      if (categoriesContainer && categoriesContainer.closest('[data-phone-container="true"]')) {
        return categoriesContainer as HTMLElement;
      }

      // Priority 3: Check for cart scroll area
      const cartContainer = elementUnderMouse.closest('[data-phone-cart-scroll="true"]');
      if (cartContainer) {
        return cartContainer as HTMLElement;
      }

      // Priority 4: Check for main menu scroll container
      const mainScrollContainer = phoneContainer.querySelector('[data-phone-scroll-container="true"]');
      if (mainScrollContainer && (mainScrollContainer as HTMLElement).scrollHeight > (mainScrollContainer as HTMLElement).clientHeight) {
        return mainScrollContainer as HTMLElement;
      }

      // Priority 5: Check for any other scrollable container within phone
      const scrollableContainers = phoneContainer.querySelectorAll('[data-phone-scroll-container="true"], .overflow-y-auto');
      for (const container of Array.from(scrollableContainers)) {
        const htmlContainer = container as HTMLElement;
        const rect = htmlContainer.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const hasVerticalScroll = htmlContainer.scrollHeight > htmlContainer.clientHeight;
        const hasHorizontalScroll = htmlContainer.scrollWidth > htmlContainer.clientWidth;
        
        // Check if the mouse is actually over this container
        if (isVisible && (hasVerticalScroll || hasHorizontalScroll)) {
          const containerRect = htmlContainer.getBoundingClientRect();
          if (mouseEvent.clientX >= containerRect.left && 
              mouseEvent.clientX <= containerRect.right && 
              mouseEvent.clientY >= containerRect.top && 
              mouseEvent.clientY <= containerRect.bottom) {
            return htmlContainer;
          }
        }
      }

      return null;
    };

    const directScrollTo = (element: HTMLElement, deltaX: number, deltaY: number) => {
      // Check if this is a horizontal scroll container (categories)
      const isHorizontalContainer = element.classList.contains('overflow-x-auto') || 
                                   element.hasAttribute('data-horizontal-scroll');
      
      if (isHorizontalContainer) {
        // For horizontal containers, convert vertical scroll to horizontal - DIRECT SCROLL
        const newScrollLeft = Math.max(0, Math.min(
          element.scrollWidth - element.clientWidth, 
          element.scrollLeft + (deltaY * 1.2) // Convert vertical wheel to horizontal scroll
        ));
        element.scrollLeft = newScrollLeft;
      } else {
        // For vertical containers, use direct vertical scrolling - NO ANIMATION
        const newScrollTop = Math.max(0, Math.min(
          element.scrollHeight - element.clientHeight, 
          element.scrollTop + deltaY
        ));
        element.scrollTop = newScrollTop;
        
        // Also handle horizontal scroll if present
        if (deltaX !== 0) {
          const newScrollLeft = Math.max(0, Math.min(
            element.scrollWidth - element.clientWidth, 
            element.scrollLeft + deltaX
          ));
          element.scrollLeft = newScrollLeft;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events if they're over the phone
      const targetContainer = getTargetScrollContainer(e);
      if (targetContainer) {
        e.preventDefault();
        e.stopPropagation();
        
        // Use deltaY for both vertical and horizontal scrolling
        // The directScrollTo function will determine the appropriate direction
        directScrollTo(targetContainer, e.deltaX, e.deltaY * 3.0); // Even faster scroll response for better UX
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        window.touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && typeof window.touchStartY === 'number') {
        const touchY = e.touches[0].clientY;
        const deltaY = window.touchStartY - touchY;
        
        // Check if touch is over phone
        const elementUnderTouch = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        const phoneContainer = elementUnderTouch?.closest('[data-phone-container="true"]');
        
        if (phoneContainer) {
          e.preventDefault();
          e.stopPropagation();
          
          // Check for product detail container first
          const productDetailContainer = phoneContainer.querySelector('[data-product-detail-scroll="true"]') as HTMLElement;
          if (productDetailContainer) {
            directScrollTo(productDetailContainer, 0, deltaY * 4); // Fast product detail scroll
          } else {
            // Find main scroll container in phone
            const mainContainer = phoneContainer.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
            if (mainContainer) {
              directScrollTo(mainContainer, 0, deltaY * 4); // Much faster touch response
            }
          }
          
          window.touchStartY = touchY;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollKeys: Record<string, { x: number; y: number }> = {
        'ArrowUp': { x: 0, y: -80 },
        'ArrowDown': { x: 0, y: 80 },
        'ArrowLeft': { x: -80, y: 0 },
        'ArrowRight': { x: 80, y: 0 },
        'PageUp': { x: 0, y: -400 },
        'PageDown': { x: 0, y: 400 },
        ' ': { x: 0, y: 400 }
      };
      
      if (e.key in scrollKeys) {
        e.preventDefault();
        e.stopPropagation();
        
        // For keyboard, always use main container
        const phoneContainer = document.querySelector('[data-phone-container="true"]');
        const mainContainer = phoneContainer?.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
        if (mainContainer) {
          if (e.key === 'Home') {
            mainContainer.scrollTop = 0;
            mainContainer.scrollLeft = 0;
          } else if (e.key === 'End') {
            mainContainer.scrollTop = mainContainer.scrollHeight;
          } else {
            const scroll = scrollKeys[e.key];
            directScrollTo(mainContainer, scroll.x, scroll.y);
          }
        }
      }
    };

    // Add event listeners with passive: false to prevent default behavior
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('keydown', handleKeyDown);
      delete window.touchStartY;
    };
  }, [isOpen]); // Only isOpen as dependency

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Main content container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.5 
            }}
            className="flex items-center justify-center gap-8 max-w-7xl w-full px-4 h-full"
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-60 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Demo sluiten"
            >
              <IoClose size={24} />
            </motion.button>

            {/* Demo title - positioned at top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center text-white"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-1">
                Klant Demo - TableTech
              </h2>
              <p className="text-white/80 text-sm max-w-md">
                Scroll om te navigeren - categorieën horizontaal, menu verticaal
              </p>
            </motion.div>

            {/* Main content area - centered phone with side panels */}
            <div className="flex items-center justify-center w-full h-full pt-20 pb-6">
              {/* Left info panel */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4, 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="hidden lg:flex flex-col gap-4 w-80 pr-8"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    Demo Features:
                  </h3>
                  <ul className="text-sm space-y-2 text-white/90">
                    <li>• Scroll door categorieën horizontaal</li>
                    <li>• Scroll door menu verticaal</li>
                    <li>• Volledige product details</li>
                    <li>• Interactieve winkelwagen</li>
                  </ul>
                </div>
              </motion.div>

              {/* Center - Phone mockup */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 0.85, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="flex-shrink-0 transform"
              >
                <PhoneMockup />
              </motion.div>

              {/* Right action panel */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4, 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="hidden lg:flex flex-col gap-4 w-80 pl-8"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">
                    Demo navigatie
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={onClose}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 border border-white/30 text-sm"
                    >
                      ← Terug naar homepage
                    </button>
                    
                    <button
                      onClick={onSwitchToEmployee}
                      className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg text-sm"
                    >
                      Demo werknemer →
                    </button>
                  </div>

                  <div className="text-xs text-white/60 mt-4 text-center">
                    TableTech Demo Ervaring
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile bottom controls */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:hidden absolute bottom-6 left-6 right-6"
            >
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-white">
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium transition-all duration-200 border border-white/30 text-sm flex-1"
                  >
                    ← Terug naar homepage
                  </button>
                  
                  <button
                    onClick={onSwitchToEmployee}
                    className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-lg text-sm flex-1"
                  >
                    Demo werknemer →
                  </button>
                </div>
                <div className="text-xs text-white/60 text-center">
                  TableTech Demo • Volledige functionaliteit
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};