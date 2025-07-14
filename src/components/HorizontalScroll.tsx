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
            }, 500); // Nog snellere timeout
          },
        },
      });

      // Functie om naar dichtstbijzijnde sectie te snappen
      const snapToNearestSection = (progress: number) => {
        let targetProgress: number;
        let sectionName: string;
        
        // Met gelijke verdeling: elke sectie krijgt precies 33.33% van de timeline
        // Benefits 1 volledig zichtbaar bij progress 0
        // Benefits 2 volledig zichtbaar bij progress 0.5  
        // Benefits 3 volledig zichtbaar bij progress 1
        
        // Bereken zichtbaarheid voor gelijke sectie verdeling
        const benefit1Visibility = Math.max(0, Math.min(1, 1 - (progress * 2))); // 100% bij 0, 0% bij 0.5
        const benefit2Visibility = Math.max(0, Math.min(1, 1 - Math.abs(progress - 0.5) * 2)); // 100% bij 0.5
        const benefit3Visibility = Math.max(0, Math.min(1, (progress - 0.5) * 2)); // 100% bij 1
        
        // Vind welke sectie het meest zichtbaar is
        if (benefit1Visibility >= benefit2Visibility && benefit1Visibility >= benefit3Visibility) {
          targetProgress = 0;
          sectionName = "Benefits 1";
        } else if (benefit2Visibility >= benefit1Visibility && benefit2Visibility >= benefit3Visibility) {
          targetProgress = 0.5;
          sectionName = "Benefits 2";
        } else {
          targetProgress = 1;
          sectionName = "Benefits 3";
        }
        
        // Alleen snappen als we niet al op de juiste plek zijn
        const tolerance = 0.02;
        const distance = Math.abs(progress - targetProgress);
        
        if (distance > tolerance) {
          const st = scrollTriggerInstance;
          if (st) {
            const targetY = st.start + (targetProgress * (st.end - st.start));
            
            gsap.to(window, {
              duration: 0.3,
              ease: "power2.out",
              scrollTo: targetY,
              onComplete: () => {
                console.log(`Snapped to ${sectionName} (${Math.round(targetProgress * 100)}%) - B1: ${Math.round(benefit1Visibility * 100)}%, B2: ${Math.round(benefit2Visibility * 100)}%, B3: ${Math.round(benefit3Visibility * 100)}%`);
              }
            });
          }
        }
      };
    }, container);

    return () => {
      clearTimeout(scrollTimeout);
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