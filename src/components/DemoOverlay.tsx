import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
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

type ThemeId = "tabletech" | "spicepalace" | "sweetdelights" | "coffeecorner";

export const DemoOverlay: React.FC<DemoOverlayProps> = memo(({
  isOpen,
  onClose,
  onSwitchToEmployee,
}) => {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("tabletech");
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized themes data for performance
  const themes = useMemo(() => [
    { id: "tabletech" as ThemeId, name: "TableTech", color: "bg-[#7b4f35]", hoverColor: "hover:bg-[#5e3b29]" },
    { id: "spicepalace" as ThemeId, name: "Spice Palace", color: "bg-red-600", hoverColor: "hover:bg-red-700" },
    { id: "sweetdelights" as ThemeId, name: "Sweet Delights", color: "bg-pink-500", hoverColor: "hover:bg-pink-600" },
    { id: "coffeecorner" as ThemeId, name: "Coffee Corner", color: "bg-amber-600", hoverColor: "hover:bg-amber-700" },
  ], []);

  // Memoized theme getter
  const getCurrentTheme = useCallback(() => {
    return themes.find(t => t.id === activeTheme) || themes[0];
  }, [themes, activeTheme]);

  // Initialize theme immediately when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

  // Calculate dynamic phone scale based on viewport
  useEffect(() => {
    if (!isOpen) return;

    const calculatePhoneScale = () => {
      // Only apply dynamic scaling on mobile
      if (window.innerWidth >= 1024) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Phone mockup dimensions (approximate)
      const phoneHeight = 740; // Approximate height of phone mockup
      const phoneWidth = 360; // Approximate width of phone mockup
      
      // Available space (accounting for theme selector at top and padding)
      const availableHeight = viewportHeight - 60; // Reduced to 60px for top bar
      const availableWidth = viewportWidth - 20; // Minimal 10px padding each side
      
      // Calculate scale to fit
      const scaleHeight = availableHeight / phoneHeight;
      const scaleWidth = availableWidth / phoneWidth;
      
      // Use the smaller scale to ensure it fits both dimensions
      const scale = Math.min(scaleHeight, scaleWidth, 2.5); // Increased max scale to 2.5
      
      // Set CSS variable for scale
      document.documentElement.style.setProperty('--phone-scale', scale.toString());
    };

    calculatePhoneScale();
    
    // Recalculate on resize
    window.addEventListener('resize', calculatePhoneScale);
    window.addEventListener('orientationchange', calculatePhoneScale);
    
    return () => {
      window.removeEventListener('resize', calculatePhoneScale);
      window.removeEventListener('orientationchange', calculatePhoneScale);
      document.documentElement.style.removeProperty('--phone-scale');
    };
  }, [isOpen]);

  // Block/unblock body scroll when overlay opens/closes with optimization
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Block scroll on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Force disable all transitions temporarily to prevent color flashing
      const style = document.createElement('style');
      style.id = 'demo-disable-transitions';
      style.textContent = `
        *, *::before, *::after {
          transition-duration: 0s !important;
          animation-duration: 0s !important;
          animation-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);

      // Re-enable transitions after initial render
      setTimeout(() => {
        const transitionStyle = document.getElementById('demo-disable-transitions');
        if (transitionStyle) {
          transitionStyle.remove();
        }
      }, 50); // Faster re-enable for smoother experience
      
      return () => {
        // Restore scroll when component unmounts or isOpen becomes false
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Clean up transition disable
        const transitionStyle = document.getElementById('demo-disable-transitions');
        if (transitionStyle) {
          transitionStyle.remove();
        }
        
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
        // For horizontal containers, convert vertical scroll to horizontal - FASTER SCROLL
        const newScrollLeft = Math.max(0, Math.min(
          element.scrollWidth - element.clientWidth, 
          element.scrollLeft + (deltaY * 2.0) // Faster horizontal scroll
        ));
        element.scrollLeft = newScrollLeft;
      } else {
        // For vertical containers, use direct vertical scrolling - FASTER SCROLL
        const newScrollTop = Math.max(0, Math.min(
          element.scrollHeight - element.clientHeight, 
          element.scrollTop + deltaY * 1.5 // Faster vertical scroll
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
        directScrollTo(targetContainer, e.deltaX, e.deltaY * 4.0); // Much faster scroll response for better UX
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
            directScrollTo(productDetailContainer, 0, deltaY * 6); // Much faster product detail scroll
          } else {
            // Find main scroll container in phone
            const mainContainer = phoneContainer.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
            if (mainContainer) {
              directScrollTo(mainContainer, 0, deltaY * 6); // Much faster touch response
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

  const currentTheme = getCurrentTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.2, 
            ease: "easeOut" 
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {/* Main content container */}
          <motion.div
            initial={{ 
              scale: 0.95, 
              opacity: 0, 
              y: 20
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0
            }}
            exit={{ 
              scale: 0.95, 
              opacity: 0, 
              y: 20
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="flex items-center justify-center gap-8 max-w-7xl w-full px-4 h-full"
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.3
              }}
              onClick={onClose}
              className="absolute top-6 right-6 z-60 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Demo sluiten"
            >
              <IoClose size={24} />
            </motion.button>

            {/* Mobile Theme Selector - TOP RIGHT - MOBILE ONLY */}
            <div className="lg:hidden absolute top-6 left-6 right-20 z-50">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.4
                }}
              >
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 text-white border border-white/10">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {themes.map((theme, index) => (
                      <motion.button
                        key={`mobile-top-${theme.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: 0.4 + (index * 0.05),
                          duration: 0.2
                        }}
                        onClick={() => setActiveTheme(theme.id)}
                        className={`px-2 py-1 rounded-md font-medium transition-all duration-200 hover:scale-105 shadow-lg text-xs border border-white/30 ${
                          activeTheme === theme.id
                            ? `${theme.color} text-white ring-1 ring-white/50`
                            : "bg-white/20 hover:bg-white/30 backdrop-blur-md text-white"
                        }`}
                      >
                        {theme.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Demo title - positioned at top - DESKTOP ONLY */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1, 
                duration: 0.3
              }}
              className="hidden lg:block absolute top-6 left-1/2 transform -translate-x-1/2 text-center text-white max-lg:!hidden"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-1">
                Klant Demo - {themes.find(t => t.id === activeTheme)?.name}
              </h2>
              <p className="text-white/80 text-sm max-w-md">
                Scroll om te navigeren - categorieën horizontaal, menu verticaal
              </p>
            </motion.div>

            {/* Main content area - responsive layout */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full pt-20 lg:pt-20 pb-6 lg:pb-6">
              {/* Left info panel - DESKTOP ONLY */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.4
                }}
                className="hidden lg:flex flex-col gap-4 w-80 pr-8 order-1 lg:order-1 max-lg:!hidden"
              >
                {/* Theme Selection - Horizontal */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-white border border-white/10">
                  <h3 className="text-sm font-semibold mb-3 text-center">
                    Kies Thema:
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {themes.map((theme, index) => (
                      <motion.button
                        key={theme.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.4 + (index * 0.05),
                          duration: 0.2
                        }}
                        onClick={() => setActiveTheme(theme.id)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg text-xs border border-white/30 ${
                          activeTheme === theme.id
                            ? `${theme.color} text-white ring-2 ring-white/50`
                            : "bg-white/20 hover:bg-white/30 backdrop-blur-md text-white"
                        }`}
                      >
                        {theme.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Demo Features */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.5, 
                    duration: 0.3
                  }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10"
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    Demo Features:
                  </h3>
                  <ul className="text-sm space-y-2 text-white/90">
                    <li>• Scroll door categorieën horizontaal</li>
                    <li>• Scroll door menu verticaal</li>
                    <li>• Volledige product details</li>
                    <li>• Interactieve winkelwagen</li>
                    <li>• Verschillende thema's</li>
                  </ul>
                </motion.div>
              </motion.div>

              {/* Center - Phone mockup - RESPONSIVE SCALING */}
              <motion.div
                initial={{ 
                  scale: 0.85, 
                  opacity: 1
                }}
                animate={{ 
                  scale: 0.85, 
                  opacity: 1
                }}
                transition={{ 
                  duration: 0
                }}
                className="flex-shrink-0 transform order-1 lg:order-2 flex items-center justify-center w-full h-full lg:w-auto lg:h-auto"
                style={{ 
                  filter: 'none',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                {/* Mobile responsive wrapper */}
                <div className="lg:hidden w-full h-full flex items-center justify-center" style={{
                  maxHeight: 'calc(100vh - 40px)', // Even less for top bar
                  paddingTop: '40px', // Tighter space for theme selector
                  paddingBottom: '5px' // Minimal bottom padding
                }}>
                  <div style={{
                    transform: 'scale(var(--phone-scale, 1))',
                    transformOrigin: 'center'
                  }}>
                    {isInitialized && <PhoneMockup theme={activeTheme} />}
                  </div>
                </div>
                
                {/* Desktop view */}
                <div className="hidden lg:block" style={{
                  transform: 'scale(1.1)'
                }}>
                  {isInitialized && <PhoneMockup theme={activeTheme} />}
                </div>
              </motion.div>


              {/* Right action panel - DESKTOP ONLY */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.4
                }}
                className="hidden lg:flex flex-col gap-4 w-80 pl-8 order-3 lg:order-3 max-lg:!hidden"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">
                    Demo navigatie
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: 0.6, 
                        duration: 0.2
                      }}
                      onClick={onClose}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-white/30 text-sm"
                    >
                      ← Terug naar homepage
                    </motion.button>
                    
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: 0.7, 
                        duration: 0.2
                      }}
                      onClick={onSwitchToEmployee}
                      className={`${currentTheme.color} ${currentTheme.hoverColor} text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg text-sm ring-2 ring-white/20`}
                    >
                      Demo werknemer →
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.2 }}
                    className="text-xs text-white/60 mt-4 text-center"
                  >
                    {themes.find(t => t.id === activeTheme)?.name} Demo Ervaring
                  </motion.div>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Set display name for debugging
DemoOverlay.displayName = 'DemoOverlay';