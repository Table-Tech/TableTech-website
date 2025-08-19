// src/hooks/useLenisScroll.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useLenisScroll = () => {
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // If useLocation fails (component not in Router context), use fallback
    location = { pathname: "/" };
  }

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const lenis = new Lenis({
      lerp: 0.15,
      duration: 0.6,
      smoothWheel: true,
      wheelMultiplier: 1.8,
    });

    // Koppel Lenis aan window
    window.lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.refresh();

    gsap.utils.toArray(".fade-in").forEach((el: unknown) => {
      if (el instanceof HTMLElement) {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
      lenis.destroy();
      window.lenis = undefined;
    };
  }, [location.pathname]);
};