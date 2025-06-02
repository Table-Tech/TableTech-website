import React, { useEffect, useRef } from "react";
import { BenefitsOne } from "../pages/LandingPage/Benefits";
import { BenefitsTwo } from "../pages/LandingPage/Benefits-2";
import { BenefitsThree } from "../pages/LandingPage/Benefits-3";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const HorizontalScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const panels = gsap.utils.toArray(".panel");

    if (!container || panels.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          pin: true,
          scrub: 1,
          anticipatePin: 1, // 💡 voorkomt flitsen
          snap: 1 / (panels.length - 1),
          end: () => "+=" + container.offsetWidth,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full overflow-hidden relative">
      <div
        ref={scrollRef}
        className="horizontal-scroll relative flex w-[300vw] h-screen overflow-hidden bg-[#1e1208]"
      >
        <div className="panel w-screen h-screen shrink-0 overflow-hidden">
          <BenefitsOne />
        </div>
        <div className="panel w-screen h-screen shrink-0 overflow-hidden">
          <BenefitsTwo />
        </div>
        <div className="panel w-screen h-screen shrink-0 overflow-hidden">
          <BenefitsThree />
        </div>
      </div>
    </div>
  );
};