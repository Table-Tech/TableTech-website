// src/components/HorizontalScroll.tsx
import React, { useEffect, useRef } from "react";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const HorizontalScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const panels = gsap.utils.toArray(".panel");

    if (!container || panels.length === 0) return;

    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Functie om naar dichtstbijzijnde sectie te snappen
    const snapToNearestSection = (progress: number) => {
      let targetProgress: number;
      let sectionName: string;

      if (progress <= 0.25) {
        targetProgress = 0;
        sectionName = "Benefits 1";
      } else if (progress <= 0.75) {
        targetProgress = 0.5;
        sectionName = "Benefits 2";
      } else {
        targetProgress = 1.0;
        sectionName = "Benefits 3";
      }

      const tolerance = 0.001;
      const distance = Math.abs(progress - targetProgress);

      if (distance > tolerance) {
        const st = scrollTriggerInstance;
        if (st) {
          const targetY = st.start + (targetProgress * (st.end - st.start));

          gsap.to(window, {
            duration: 0.4,
            ease: "power2.out",
            scrollTo: targetY,
            onComplete: () => {
              console.log(`Perfect snap to ${sectionName} (${Math.round(targetProgress * 100)}%)`);
              setTimeout(() => {
                if (scrollTriggerInstance) {
                  const finalTargetY = scrollTriggerInstance.start + (targetProgress * (scrollTriggerInstance.end - scrollTriggerInstance.start));
                  window.scrollTo(0, finalTargetY);
                }
              }, 50);
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
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          pin: true,
          scrub: 0.05,
          anticipatePin: 1,
          end: () => "+=" + (container.offsetWidth * 0.8),
          onUpdate: (self) => {
            scrollTriggerInstance = self;
            isScrolling = true;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              if (isScrolling) {
                isScrolling = false;
                snapToNearestSection(self.progress);
              }
            }, 200);
          },
        },
      });
    }, container);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('wheel', handleWheelEnd);
      window.removeEventListener('touchend', handleWheelEnd);
      ctx.revert();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden relative">
      <div
        ref={scrollRef}
        className="horizontal-scroll relative flex w-[300vw] h-screen overflow-hidden"
        style={{
          backgroundImage: `url('/background-benefits.jpg')`, // Vervang met jouw afbeelding pad
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Optionele overlay voor betere leesbaarheid */}
        <div className="absolute inset-0 bg-black/30 z-0" />
        
        <div id="benefits1" className="panel w-screen h-screen shrink-0 overflow-hidden relative z-10">
          <BenefitsOne />
        </div>
        <div id="benefits2" className="panel w-screen h-screen shrink-0 overflow-hidden relative z-10">
          <BenefitsTwo />
        </div>
        <div id="benefits3" className="panel w-screen h-screen shrink-0 overflow-hidden relative z-10">
          <BenefitsThree />
        </div>
      </div>
    </div>
  );
};