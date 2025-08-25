import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import PhoneMockup from "./PhoneMock";

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
  const [phonePosition, setPhonePosition] = useState<{ 
    top: number; 
    left: number; 
    width: number;
    phoneHeight?: number;
    availableSpace?: number;
    selectorHeight?: number;
  } | null>(null);

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

  // Responsive button styling based on viewport and phone size - GROTER GEMAAKT
  const getResponsiveButtonStyle = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const phoneWidth = phonePosition?.width || 300;
    
    // Very small screens (iPhone SE, small Android) - GROTER
    if (viewportWidth < 380 || viewportHeight < 600) {
      return {
        fontSize: 'clamp(0.5rem, 2.5vw, 0.58rem)', // Was: 0.4-0.48rem, Nu: 0.5-0.58rem
        padding: 'clamp(0.35rem, 1.3vw, 0.45rem) clamp(0.4rem, 1.8vw, 0.55rem)', // Meer padding
        minWidth: 'clamp(60px, 22vw, 75px)', // Was: 50-65px, Nu: 60-75px
        minHeight: 'clamp(32px, 8vw, 36px)', // Was: 28-32px, Nu: 32-36px
        maxWidth: 'clamp(75px, 25vw, 85px)', // Was: 65-75px, Nu: 75-85px
        gap: '0.3rem' // Was: 0.25rem
      };
    }
    
    // Small screens - GROTER
    if (viewportWidth < 450 || viewportHeight < 700) {
      return {
        fontSize: 'clamp(0.55rem, 2.2vw, 0.62rem)', // Was: 0.45-0.52rem, Nu: 0.55-0.62rem
        padding: 'clamp(0.4rem, 1.4vw, 0.5rem) clamp(0.45rem, 2vw, 0.6rem)', // Meer padding
        minWidth: 'clamp(65px, 20vw, 80px)', // Was: 55-70px, Nu: 65-80px
        minHeight: 'clamp(34px, 8vw, 38px)', // Was: 30-34px, Nu: 34-38px
        maxWidth: 'clamp(80px, 24vw, 90px)', // Was: 70-80px, Nu: 80-90px
        gap: '0.35rem' // Was: 0.3rem
      };
    }
    
    // Medium screens - GROTER
    if (viewportWidth < 600) {
      return {
        fontSize: 'clamp(0.6rem, 2vw, 0.65rem)', // Was: 0.5-0.55rem, Nu: 0.6-0.65rem
        padding: 'clamp(0.45rem, 1.4vw, 0.55rem) clamp(0.5rem, 2vw, 0.65rem)', // Meer padding
        minWidth: 'clamp(70px, 18vw, 85px)', // Was: 60-75px, Nu: 70-85px
        minHeight: 'clamp(36px, 7vw, 40px)', // Was: 32-36px, Nu: 36-40px
        maxWidth: 'clamp(85px, 22vw, 95px)', // Was: 75-85px, Nu: 85-95px
        gap: '0.4rem' // Was: 0.35rem
      };
    }
    
    // Large screens (default) - GROTER
    return {
      fontSize: 'clamp(0.62rem, 1.8vw, 0.68rem)', // Was: 0.52-0.58rem, Nu: 0.62-0.68rem
      padding: 'clamp(0.5rem, 1.4vw, 0.6rem) clamp(0.55rem, 2vw, 0.7rem)', // Meer padding
      minWidth: 'clamp(75px, 17vw, 90px)', // Was: 65-80px, Nu: 75-90px
      minHeight: 'clamp(38px, 7vw, 42px)', // Was: 34-38px, Nu: 38-42px
      maxWidth: 'clamp(90px, 20vw, 100px)', // Was: 80-90px, Nu: 90-100px
      gap: '0.45rem' // Was: 0.4rem
    };
  }, [phonePosition]);

  // Track viewport changes for responsive updates
  const [responsiveStyle, setResponsiveStyle] = useState(getResponsiveButtonStyle());

  useEffect(() => {
    const updateResponsiveStyle = () => {
      setResponsiveStyle(getResponsiveButtonStyle());
    };

    let timeout: number;
    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateResponsiveStyle, 100);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);
    
    // Update when phone position changes
    updateResponsiveStyle();

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
      clearTimeout(timeout);
    };
  }, [getResponsiveButtonStyle, phonePosition]);

  // Initialize theme immediately when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

  // Phone position detection - Enhanced for all phone sizes
  useEffect(() => {
    if (!isOpen || !isInitialized) return;

    const detectPhonePosition = () => {
      const phoneContainer = document.querySelector('[data-phone-container="true"]') as HTMLElement;
      if (!phoneContainer) return;

      const rect = phoneContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate optimal positioning based on phone size and viewport
      const phoneTop = rect.top;
      const phoneLeft = rect.left;
      const phoneWidth = rect.width;
      const phoneHeight = rect.height;
      
      // Dynamic spacing based on phone size and available space
      let selectorHeight = 60; // Base height for theme selector
      
      // Adjust selector height based on viewport size
      if (viewportHeight < 600) {
        selectorHeight = 45; // Smaller on very small screens
      } else if (viewportHeight < 800) {
        selectorHeight = 50; // Medium on medium screens
      }
      
      // Calculate top position with safety margin
      const availableTopSpace = phoneTop;
      const safeTopMargin = Math.max(10, availableTopSpace * 0.1); // 10% of available space or minimum 10px
      const optimalTop = Math.max(safeTopMargin, phoneTop - selectorHeight - 15);
      
      setPhonePosition({
        top: optimalTop,
        left: phoneLeft + phoneWidth / 2,
        width: phoneWidth,
        phoneHeight: phoneHeight,
        availableSpace: availableTopSpace,
        selectorHeight: selectorHeight
      });
    };

    // Initial detection with multiple attempts for reliability
    setTimeout(detectPhonePosition, 100);
    setTimeout(detectPhonePosition, 300);
    setTimeout(detectPhonePosition, 500);
    
    // Update on resize/orientation change with debounce
    let resizeTimeout: number;
    const debouncedDetection = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(detectPhonePosition, 150);
    };
    
    window.addEventListener('resize', debouncedDetection);
    window.addEventListener('orientationchange', debouncedDetection);
    window.addEventListener('scroll', debouncedDetection); // Also track scroll changes
    
    return () => {
      window.removeEventListener('resize', debouncedDetection);
      window.removeEventListener('orientationchange', debouncedDetection);
      window.removeEventListener('scroll', debouncedDetection);
      clearTimeout(resizeTimeout);
    };
  }, [isOpen, isInitialized]);

  // Calculate dynamic phone scale based on viewport
  useEffect(() => {
    if (!isOpen) return;

    const calculatePhoneScale = () => {
      // Only apply dynamic scaling on mobile
      if (window.innerWidth >= 1024) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
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

  // Disable Lenis when demo is open to prevent conflicts with normal scrolling
  useEffect(() => {
    if (isOpen) {
      // Disable Lenis smooth scrolling during demo
      if (window.lenis) {
        window.lenis.stop();
      }
      
      return () => {
        // Re-enable Lenis when demo closes
        if (window.lenis) {
          window.lenis.start();
        }
      };
    }
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

  // Enhanced scroll detection - Separate handling for touch vs mouse
  useEffect(() => {
    if (!isOpen) return;

    // Device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const getTargetScrollContainer = (clientX: number, clientY: number): HTMLElement | null => {
      const elementUnderCursor = document.elementFromPoint(clientX, clientY);
      if (!elementUnderCursor) return null;

      const phoneContainer = elementUnderCursor.closest('[data-phone-container="true"]');
      if (!phoneContainer) return null;

      // Priority 1: Check for product detail scroll area
      const productDetailContainer = elementUnderCursor.closest('[data-product-detail-scroll="true"]');
      if (productDetailContainer) {
        return productDetailContainer as HTMLElement;
      }

      // Priority 2: Check for horizontal scroll (categories)
      const categoriesContainer = elementUnderCursor.closest('.flex.overflow-x-auto');
      if (categoriesContainer && categoriesContainer.closest('[data-phone-container="true"]')) {
        return categoriesContainer as HTMLElement;
      }

      // Priority 3: Check for cart scroll area
      const cartContainer = elementUnderCursor.closest('[data-phone-cart-scroll="true"]');
      if (cartContainer) {
        return cartContainer as HTMLElement;
      }

      // Priority 4: Check for main menu scroll container
      const mainScrollContainer = phoneContainer.querySelector('[data-phone-scroll-container="true"]');
      if (mainScrollContainer && (mainScrollContainer as HTMLElement).scrollHeight > (mainScrollContainer as HTMLElement).clientHeight) {
        return mainScrollContainer as HTMLElement;
      }

      return null;
    };

    // DESKTOP SCROLL HANDLING (Mouse wheel)
    const handleWheel = (e: WheelEvent) => {
      if (isTouchDevice) return; // Skip on touch devices
      
      const targetContainer = getTargetScrollContainer(e.clientX, e.clientY);
      if (targetContainer) {
        e.preventDefault();
        e.stopPropagation();
        
        const isHorizontalContainer = targetContainer.classList.contains('overflow-x-auto');
        
        if (isHorizontalContainer) {
          // Convert vertical scroll to horizontal for categories
          const newScrollLeft = Math.max(0, Math.min(
            targetContainer.scrollWidth - targetContainer.clientWidth, 
            targetContainer.scrollLeft + (e.deltaY * 2.0)
          ));
          targetContainer.scrollLeft = newScrollLeft;
        } else {
          // Vertical scrolling for menu
          const newScrollTop = Math.max(0, Math.min(
            targetContainer.scrollHeight - targetContainer.clientHeight, 
            targetContainer.scrollTop + e.deltaY * 1.5
          ));
          targetContainer.scrollTop = newScrollTop;
        }
      }
    };

    // TOUCH SCROLL HANDLING - Natural finger scrolling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScrollTop = 0;
    let touchStartScrollLeft = 0;
    let activeScrollContainer: HTMLElement | null = null;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        
        // Find the scroll container
        activeScrollContainer = getTargetScrollContainer(touch.clientX, touch.clientY);
        
        if (activeScrollContainer) {
          touchStartScrollTop = activeScrollContainer.scrollTop;
          touchStartScrollLeft = activeScrollContainer.scrollLeft;
          isScrolling = false;
          
          // Add smooth transition class for natural feel
          activeScrollContainer.style.scrollBehavior = 'auto';
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && activeScrollContainer) {
        const touch = e.touches[0];
        const deltaX = touchStartX - touch.clientX;
        const deltaY = touchStartY - touch.clientY;
        
        // Determine if this is a scroll gesture
        if (!isScrolling && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
          isScrolling = true;
        }
        
        if (isScrolling) {
          e.preventDefault();
          e.stopPropagation();
          
          const isHorizontalContainer = activeScrollContainer.classList.contains('overflow-x-auto');
          
          if (isHorizontalContainer) {
            // Horizontal scrolling for categories - use X delta
            const newScrollLeft = Math.max(0, Math.min(
              activeScrollContainer.scrollWidth - activeScrollContainer.clientWidth,
              touchStartScrollLeft + deltaX
            ));
            activeScrollContainer.scrollLeft = newScrollLeft;
          } else {
            // Vertical scrolling for menu - use Y delta
            const newScrollTop = Math.max(0, Math.min(
              activeScrollContainer.scrollHeight - activeScrollContainer.clientHeight,
              touchStartScrollTop + deltaY
            ));
            activeScrollContainer.scrollTop = newScrollTop;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (activeScrollContainer) {
        // Add momentum scrolling for natural feel
        activeScrollContainer.style.scrollBehavior = 'smooth';
        
        // Reset after a short delay
        setTimeout(() => {
          if (activeScrollContainer) {
            activeScrollContainer.style.scrollBehavior = 'auto';
          }
        }, 300);
      }
      
      activeScrollContainer = null;
      isScrolling = false;
    };

    // KEYBOARD HANDLING (unchanged)
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
        
        const phoneContainer = document.querySelector('[data-phone-container="true"]');
        const mainContainer = phoneContainer?.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
        if (mainContainer) {
          const scroll = scrollKeys[e.key];
          const newScrollTop = Math.max(0, Math.min(
            mainContainer.scrollHeight - mainContainer.clientHeight,
            mainContainer.scrollTop + scroll.y
          ));
          const newScrollLeft = Math.max(0, Math.min(
            mainContainer.scrollWidth - mainContainer.clientWidth,
            mainContainer.scrollLeft + scroll.x
          ));
          mainContainer.scrollTop = newScrollTop;
          mainContainer.scrollLeft = newScrollLeft;
        }
      }
    };

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
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
          data-demo-overlay="true"
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
            {/* Demo title - MOBILE VERSION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.3
              }}
              onClick={onClose}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-4 lg:transform-none z-60 cursor-pointer"
              aria-label="Demo sluiten"
            >
              {/* MOBILE: Losse tekst - ALLEEN OP MOBIEL */}
              <div className="lg:hidden text-center text-white">
                <h3 className="text-lg font-semibold mb-1">TableTech Klant-demo</h3>
                <p className="text-xs text-white/80">Alles is volledig functioneel</p>
              </div>
              
              {/* DESKTOP: Kruisje - ALLEEN OP DESKTOP */}
              <div className="hidden lg:block bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full transition-all duration-200 hover:scale-110">
                <IoClose size={32} />
              </div>
            </motion.div>

            {/* Mobile Theme Selector - ABOVE PHONE - MOBILE ONLY */}
            {phonePosition && (
              <div 
                className="lg:hidden absolute z-50" 
                style={{ 
                  top: phonePosition.top,
                  left: phonePosition.left,
                  transform: 'translateX(-50%)',
                  maxWidth: `min(100vw, ${Math.max(320, phonePosition.width * 1.4)}px)`,
                  width: 'fit-content'
                }}
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.3, 
                    duration: 0.4
                  }}
                >
                  <div 
                    className="bg-white/10 backdrop-blur-xl rounded-xl p-1.5 text-white border border-white/20" 
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    <div 
                      className="flex justify-center items-center px-0.5 no-scrollbar"
                      style={{ 
                        gap: responsiveStyle.gap,
                        overflowX: 'visible',
                        flexWrap: 'nowrap'
                      }}
                    >
                      {themes.map((theme, index) => (
                        <motion.button
                          key={`mobile-phone-${theme.id}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: 0.4 + (index * 0.05),
                            duration: 0.2
                          }}
                          onClick={() => setActiveTheme(theme.id)}
                          className={`rounded-md font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 flex items-center justify-center text-center ${
                            activeTheme === theme.id
                              ? `theme-button-${theme.id} theme-button-active border border-white/40`
                              : "bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/20 hover:border-white/30"
                          }`}
                          style={{
                            fontSize: responsiveStyle.fontSize,
                            padding: responsiveStyle.padding,
                            minWidth: responsiveStyle.minWidth,
                            minHeight: responsiveStyle.minHeight,
                            maxWidth: responsiveStyle.maxWidth
                          }}
                        >
                          <span 
                            className="text-center leading-tight font-medium"
                            style={{
                              fontSize: window.innerWidth < 350 ? '0.38rem' : 'inherit',
                              lineHeight: window.innerWidth < 350 ? '1.1' : '1.2'
                            }}
                          >
                            {window.innerWidth < 320 && theme.name.length > 6
                              ? theme.name.replace(' ', '\n')
                              : theme.name
                            }
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Mobile Navigation Buttons - ECHT ONDER DE TELEFOON */}
            {phonePosition && (
              <div 
                className="lg:hidden absolute z-40" 
                style={{ 
                  // Gebruik de echte telefoon positie + hoogte + minder ruimte = HOGER
                  top: phonePosition.top + (phonePosition.phoneHeight || 600) + 80, // Minder ruimte: 80px gap onder telefoon (was 120px)
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: `${Math.min(phonePosition.width * 1.1, window.innerWidth - 30)}px`, // Iets breder: 110% van telefoon breedte
                  width: 'fit-content'
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.6, 
                    duration: 0.4
                  }}
                  className="flex w-full"
                  style={{
                    // Iets meer gap voor grotere buttons
                    gap: `${Math.max(8, Math.min(16, phonePosition.width * 0.035))}px`,
                    padding: '0'
                  }}
                >
                  {/* Terug naar homepage button - GROTER */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white rounded-lg font-medium transition-all duration-200 border border-white/20"
                    style={{
                      // Grotere styling voor betere zichtbaarheid
                      fontSize: `${Math.max(12, Math.min(15, phonePosition.width * 0.042))}px`, // Groter: 4.2% van telefoonbreedte
                      padding: `${Math.max(10, Math.min(14, phonePosition.width * 0.035))}px ${Math.max(12, Math.min(18, phonePosition.width * 0.045))}px`, // Meer padding
                      minWidth: `${Math.max(100, phonePosition.width * 0.4)}px`, // Breder: 40% van telefoonbreedte
                      maxWidth: `${phonePosition.width * 0.48}px` // Max 48% van telefoonbreedte
                    }}
                  >
                    Terug naar homepage
                  </motion.button>
                  
                  {/* Demo werknemer button - GROTER en kleur past bij actief thema */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSwitchToEmployee}
                    className={`flex-1 text-white rounded-lg font-medium transition-all duration-200 shadow-lg ${getCurrentTheme().color} ${getCurrentTheme().hoverColor}`}
                    style={{
                      // Grotere styling voor betere zichtbaarheid
                      fontSize: `${Math.max(12, Math.min(15, phonePosition.width * 0.042))}px`, // Groter: 4.2% van telefoonbreedte
                      padding: `${Math.max(10, Math.min(14, phonePosition.width * 0.035))}px ${Math.max(12, Math.min(18, phonePosition.width * 0.045))}px`, // Meer padding
                      minWidth: `${Math.max(100, phonePosition.width * 0.4)}px`, // Breder: 40% van telefoonbreedte
                      maxWidth: `${phonePosition.width * 0.48}px` // Max 48% van telefoonbreedte
                    }}
                  >
                    Demo werknemer
                  </motion.button>
                </motion.div>
              </div>
            )}

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
                        onClick={() => {
                          setActiveTheme(theme.id);
                          // Scroll to top when switching themes on desktop
                          setTimeout(() => {
                            const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
                            if (mainScrollContainer) {
                              mainScrollContainer.scrollTop = 0;
                              // Also reset horizontal scroll for categories
                              const categoriesContainer = document.querySelector('.flex.overflow-x-auto') as HTMLElement;
                              if (categoriesContainer) {
                                categoriesContainer.scrollLeft = 0;
                              }
                            }
                          }, 50);
                        }}
                        className={`px-3 py-2 rounded-md font-medium transition-all duration-300 text-xs whitespace-nowrap ${
                          activeTheme === theme.id
                            ? `theme-button-${theme.id} theme-button-active border border-white/40`
                            : "bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/20 hover:border-white/30"
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

export default DemoOverlay;