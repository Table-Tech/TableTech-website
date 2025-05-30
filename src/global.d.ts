// Lenis smooth scroll library
interface LenisInstance {
  scrollTo: (target: HTMLElement | number, options?: { 
    duration?: number; 
    easing?: (t: number) => number;
    immediate?: boolean;
  }) => void;
  destroy: () => void;
  start: () => void;
  stop: () => void;
}

// Extend window object
declare global {
  interface Window {
    lenis?: LenisInstance;
  }
}

export {};