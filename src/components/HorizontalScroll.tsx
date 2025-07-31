// src/components/HorizontalScroll.tsx
import React, { useEffect, useRef } from "react";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import SharedBackground from "./SharedBackground";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const HorizontalScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const panels = gsap.utils.toArray<HTMLElement>(".panel");
    if (panels.length === 0) return;

    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Function to snap to nearest section
    const snapToNearestSection = (progress: number) => {
      let targetProgress: number;
      let sectionName: string;

      // Adjusted for 3 sections with equal spacing
      if (progress < 0.33) {
        targetProgress = 0;
        sectionName = "Benefits 1";
      } else if (progress < 0.67) {
        targetProgress = 0.5;
        sectionName = "Benefits 2";
      } else {
        targetProgress = 1;
        sectionName = "Benefits 3";
      }

      const tolerance = 0.001;
      const distance = Math.abs(progress - targetProgress);

      if (distance > tolerance) {
        const st = scrollTriggerInstance;
        if (st) {
          const targetY = st.start + (targetProgress * (st.end - st.start));

          gsap.to(window, {
            duration: 0.6,
            ease: "power2.inOut",
            scrollTo: targetY,
            onComplete: () => {
              console.log(`Snapped to ${sectionName}`);
            }
          });
        }
      }
    };

    const handleWheelEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (scrollTriggerInstance) {
          snapToNearestSection(scrollTriggerInstance.progress);
        }
      }, 150);
    };

    window.addEventListener('wheel', handleWheelEnd, { passive: true });
    window.addEventListener('touchend', handleWheelEnd, { passive: true });

    const ctx = gsap.context(() => {
      // Set initial positions - panels slide in from right
      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { 
            x: 0,
            autoAlpha: 1 // First panel is visible
          }); 
        } else {
          gsap.set(panel, { 
            x: "100vw", // Start completely off-screen to the right
            autoAlpha: 0 // Other panels are hidden
          }); 
        }
      });

      // Create a timeline for better control
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`, // 2 viewport heights for 3 sections
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          pinSpacing: false, // Prevent extra space after pinned section
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollTriggerInstance = self;
            isScrolling = true;

            // Update visibility based on progress - ensure only one panel is visible at a time
            const progress = self.progress;
            panels.forEach((panel, i) => {
              if (i === 0) {
                // First panel visible from start to 0.33
                gsap.set(panel, { autoAlpha: progress < 0.33 ? 1 : 0 });
              } else if (i === 1) {
                // Second panel visible from 0.33 to 0.67
                gsap.set(panel, { autoAlpha: progress >= 0.33 && progress < 0.67 ? 1 : 0 });
              } else if (i === 2) {
                // Third panel visible from 0.67 to end
                gsap.set(panel, { autoAlpha: progress >= 0.67 ? 1 : 0 });
              }
            });

            // Clear any existing timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout for snapping
            scrollTimeout = setTimeout(() => {
              if (isScrolling) {
                isScrolling = false;
                snapToNearestSection(self.progress);
              }
            }, 150);
          },
        },
      });

      // Slide animations - each panel slides in from right and then slides out to left
      // Benefits 1 -> Benefits 2 transition
      tl.to(panels[1], {
        x: 0, // Slide in from right
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0)
      .to(panels[0], {
        x: "-100vw", // Slide out to left
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0)
      
      // Benefits 2 -> Benefits 3 transition
      .to(panels[2], {
        x: 0, // Slide in from right
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.5)
      .to(panels[1], {
        x: "-100vw", // Slide out to left
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.5);
    }, container);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('wheel', handleWheelEnd);
      window.removeEventListener('touchend', handleWheelEnd);
      ctx.revert();
    };
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <SharedBackground>
        <div className="w-full h-full relative overflow-hidden">
          <div
            ref={scrollRef}
            className="horizontal-scroll relative w-full h-full"
          >
            <div id="benefits1" className="panel absolute inset-0 w-full h-full overflow-hidden" style={{ pointerEvents: 'auto' }}>
              <BenefitsOne />
            </div>
            <div id="benefits2" className="panel absolute inset-0 w-full h-full overflow-hidden" style={{ pointerEvents: 'auto' }}>
              <BenefitsTwo />
            </div>
            <div id="benefits3" className="panel absolute inset-0 w-full h-full overflow-hidden" style={{ pointerEvents: 'auto' }}>
              <BenefitsThree />
            </div>
          </div>
        </div>
      </SharedBackground>
    </div>
  );
};