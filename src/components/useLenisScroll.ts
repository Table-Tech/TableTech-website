// src/hooks/useLenisScroll.ts
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useLenisScroll = () => {

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const lenis = new Lenis({
      lerp: 0.15,
      duration: 0.6,
      smoothWheel: true,
      wheelMultiplier: 1.8,
      infinite: false,
      gestureOrientation: 'vertical'
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

    // Optimized fade-in animations with reduced overhead
    const fadeElements = gsap.utils.toArray(".fade-in");
    if (fadeElements.length > 0) {
      gsap.from(fadeElements, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: fadeElements[0],
          start: "top 80%",
          toggleActions: "play none none none",
          scroller: document.body,
          batch: true,
        },
      });
    }

    // Optimized container scroll animations
    const containerElements = gsap.utils.toArray(".container-scroll-element");
    if (containerElements.length > 0) {
      gsap.from(containerElements, {
        opacity: 0.9,
        y: 15,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerElements[0],
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          scroller: document.body,
          batch: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);
};