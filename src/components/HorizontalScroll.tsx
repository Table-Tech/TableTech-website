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

      // Perfecte sectie verdeling: 0, 0.5, 1.0
      // Met strikte snap zones om perfecte uitlijning te garanderen

      if (progress <= 0.25) {
        // Zone 1: 0% - 25% snaps naar sectie 1 (0%)
        targetProgress = 0;
        sectionName = "Benefits 1";
      } else if (progress <= 0.75) {
        // Zone 2: 25% - 75% snaps naar sectie 2 (50%)
        targetProgress = 0.5;
        sectionName = "Benefits 2";
      } else {
        // Zone 3: 75% - 100% snaps naar sectie 3 (100%)
        targetProgress = 1.0;
        sectionName = "Benefits 3";
      }

      // Ultra-strikte tolerantie: snap altijd als er ook maar een klein verschil is
      const tolerance = 0.001; // 0.1% tolerantie
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
              // Extra verificatie: forceer exacte positie
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

    // Extra wheel event listener voor perfecte controle
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
      // Zeer snelle en soepele animatie voor alle secties
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none", // Geen easing voor smooth scrub
        scrollTrigger: {
          trigger: container,
          start: "top top",
          pin: true,
          scrub: 0.05, // Nog lagere scrub waarde voor zeer snelle scroll
          anticipatePin: 1,
          end: () => "+=" + (container.offsetWidth * 0.8), // Nog kortere scroll afstand
          onUpdate: (self) => {
            scrollTriggerInstance = self;
            isScrolling = true;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              if (isScrolling) {
                isScrolling = false;
                snapToNearestSection(self.progress);
              }
            }, 200); // Ultra snelle timeout voor directe snap
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
        className="horizontal-scroll relative flex w-[300vw] h-screen overflow-hidden bg-[#1e1208]"
      >
        <div id="benefits1" className="panel w-screen h-screen shrink-0 overflow-hidden">
          <BenefitsOne />
        </div>
        <div id="benefits2" className="panel w-screen h-screen shrink-0 overflow-hidden">
          <BenefitsTwo />
        </div>
        <div id="benefits3" className="panel w-screen h-screen shrink-0 overflow-hidden">
          <BenefitsThree />
        </div>
      </div>
    </div>
  );
};