import React, { useEffect, useRef } from "react";
import { Benefits } from "./Benefits";
import { BenefitsTwo } from "./Benefits-2";
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
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + container.scrollWidth,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={scrollRef}
      className="horizontal-scroll relative flex w-[200vw] h-screen overflow-hidden bg-[#1e1208]"
    >
      <div className="panel w-screen h-screen shrink-0 overflow-hidden">
        <Benefits />
      </div>
      <div className="panel w-screen h-screen shrink-0 overflow-hidden">
        <BenefitsTwo />
      </div>
    </div>
  );
};
