import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BenefitsOne } from '../pages/LandingPage/Benefits';
import { BenefitsTwo } from '../pages/LandingPage/Benefits-2';
import { BenefitsThree } from '../pages/LandingPage/Benefits-3';
import '../styles/benefits-pinned.css';
// Background image moved to public: /images/backgrounds/optie4.webp

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Declare window.lenis type
declare global {
  interface Window {
    lenis?: {
      stop: () => void;
      start: () => void;
      scrollTo: (target: number | string | HTMLElement, options?: {
        offset?: number;
        duration?: number;
        easing?: (t: number) => number;
        immediate?: boolean;
        lock?: boolean;
        force?: boolean;
      }) => void;
    };
  }
}

interface BenefitsPinnedProps {
  className?: string;
}

export const BenefitsPinned: React.FC<BenefitsPinnedProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const currentPanelRef = useRef<number>(-1);

  // Handle video end - keep paused
  const handleVideoEnd = useCallback((event: Event) => {
    const video = event.target as HTMLVideoElement;
    video.pause();
  }, []);

  // Function to disable video playback - videos are temporarily disabled
  const playVideosInPanel = useCallback((panelElement: HTMLDivElement, panelIndex: number) => {
    if (!panelElement) return;
    
    // Only handle if we've switched to a different panel
    if (currentPanelRef.current === panelIndex) return;
    
    // Update current panel
    currentPanelRef.current = panelIndex;
    
    // Find all video elements in the panel and pause them
    const videos = panelElement.querySelectorAll('video');
    videos.forEach((video) => {
      // Remove any existing event listeners
      video.removeEventListener('ended', handleVideoEnd);
      
      // Ensure videos are paused
      video.pause();
      video.currentTime = 0;
    });
  }, [handleVideoEnd]);

  useLayoutEffect(() => {
    // Wait for DOM to be ready
    if (!containerRef.current || !wrapperRef.current) return;

    const panels = panelsRef.current.filter(Boolean);
    if (panels.length === 0) return;

    // Kill any existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Temporarily disable Lenis smooth scroll if it exists
    const lenisInstance = window.lenis;
    if (lenisInstance) {
      lenisInstance.stop();
    }

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Calculate the total scroll distance
      const totalPanels = panels.length;
      const scrollDistance = window.innerHeight * (totalPanels - 0.5);
      
      // Detect mobile/touchscreen devices
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
      
      // Create horizontal scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: isMobile ? 0.5 : 1, // Faster scrubbing on mobile for touchscreen
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Track current panel for video playback
            const progress = self.progress;
            const panelIndex = Math.min(
              Math.floor(progress * panels.length),
              panels.length - 1
            );
            
            // Play videos when entering a new panel
            const currentPanel = panels[panelIndex];
            if (currentPanel) {
              playVideosInPanel(currentPanel, panelIndex);
            }
          },
          onEnter: () => {
            // Stop Lenis when entering pinned section
            if (lenisInstance) {
              lenisInstance.stop();
            }
          },
          onLeave: () => {
            // Re-enable Lenis when leaving pinned section
            if (lenisInstance) {
              lenisInstance.start();
            }
          },
          onEnterBack: () => {
            // Stop Lenis when re-entering from below
            if (lenisInstance) {
              lenisInstance.stop();
            }
          },
          onLeaveBack: () => {
            // Re-enable Lenis when leaving back up
            if (lenisInstance) {
              lenisInstance.start();
            }
          }
        }
      });

      // Animate panels horizontally
      panels.forEach((panel, i) => {
        if (i === 0) return; // First panel stays in place
        
        // Set initial position
        gsap.set(panel, {
          xPercent: 100,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        });
        
        // Animate panel sliding in from right
        tl.to(panel, {
          xPercent: 0,
          duration: 1,
          ease: "none"
        }, i - 0.5);
        
        // If not the last panel, slide it out to the left
        if (i < panels.length - 1) {
          tl.to(panel, {
            xPercent: -100,
            duration: 1,
            ease: "none"
          }, i + 0.5);
        }
      });
      
      // Also animate the first panel out
      if (panels.length > 1) {
        tl.to(panels[0], {
          xPercent: -100,
          duration: 1,
          ease: "none"
        }, 0.5);
      }
      
      // Play videos in first panel on mount
      if (panels[0]) {
        playVideosInPanel(panels[0], 0);
      }

    }, containerRef);

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
      
      // Reset current panel tracking
      currentPanelRef.current = -1;
      
      // Re-enable Lenis if it was disabled
      if (lenisInstance) {
        lenisInstance.start();
      }
    };
  }, [playVideosInPanel]);

  return (
    <div 
      ref={wrapperRef}
      className={`benefits-wrapper relative w-full ${className}`}
      style={{
        minHeight: '100vh',
        background: 'transparent' // Maintain transparent background
      }}
    >
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(/images/backgrounds/optie4.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Content Container */}
      <div 
        ref={containerRef}
        className="benefits-container relative z-10 w-full h-screen overflow-hidden"
        style={{
          background: 'transparent' // Keep content transparent to show background
        }}
      >

        {/* Panels Container */}
        <div className="relative w-full h-full">
          {/* Panel 1 - Benefits One */}
          <div 
            ref={el => panelsRef.current[0] = el!}
            className="panel absolute w-full h-full flex items-center justify-center"
            style={{ 
              zIndex: 1,
              willChange: 'transform'
            }}
          >
            <div className="w-full h-full">
              <BenefitsOne />
            </div>
          </div>

          {/* Panel 2 - Benefits Two */}
          <div 
            ref={el => panelsRef.current[1] = el!}
            className="panel absolute w-full h-full flex items-center justify-center"
            style={{ 
              zIndex: 2,
              willChange: 'transform'
            }}
          >
            <div className="w-full h-full">
              <BenefitsTwo />
            </div>
          </div>

          {/* Panel 3 - Benefits Three */}
          <div 
            ref={el => panelsRef.current[2] = el!}
            className="panel absolute w-full h-full flex items-center justify-center"
            style={{ 
              zIndex: 3,
              willChange: 'transform'
            }}
          >
            <div className="w-full h-full">
              <BenefitsThree />
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/70 text-sm flex flex-col items-center z-50">
          <span>Scroll voor meer</span>
          <svg
            className="w-6 h-6 mt-2 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};