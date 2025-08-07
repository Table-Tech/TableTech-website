// src/global.d.ts
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

interface Window {
  lenis?: {
    scroll: number;
    scrollTo: (target: number | string | HTMLElement, options?: {
      offset?: number;
      duration?: number;
      easing?: (t: number) => number;
      immediate?: boolean;
      lock?: boolean;
      force?: boolean;
      onComplete?: () => void;
    }) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    raf: (time: number) => void;
    start: () => void;
    stop: () => void;
    destroy: () => void;
  };
}