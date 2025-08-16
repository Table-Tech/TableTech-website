// GSAP initialization and configuration
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger defaults
ScrollTrigger.config({
  // Ensure compatibility with smooth scrolling libraries
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
});

// Export configured gsap and ScrollTrigger
export { gsap, ScrollTrigger };

// Helper function to kill all ScrollTriggers (useful for cleanup)
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Helper function to refresh ScrollTrigger
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

// Helper to create a smooth scroll to element
export const smoothScrollTo = (target: string | number | HTMLElement, duration = 1) => {
  gsap.to(window, {
    scrollTo: target,
    duration,
    ease: 'power2.inOut'
  });
};