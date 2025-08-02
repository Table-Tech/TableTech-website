// src/hooks/useBreakpoint.ts
import { useEffect, useState } from "react";

export const useBreakpoint = () => {
  const [width, setWidth] = useState<number>(
    typeof window === "undefined" ? 0 : window.innerWidth
  );

  const getBreakpoint = (w: number) => ({
    width: w,
    isMobile: w < 640,
    isTablet: w >= 640 && w < 1024,
    isDesktop: w >= 1024,
    isLargeScreen: w >= 1440,
    isXLargeScreen: w >= 1920,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let timeoutId: NodeJS.Timeout;
      
      const handleResize = () => {
        // Debounce resize events for better performance
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setWidth(window.innerWidth);
        }, 100);
      };

      window.addEventListener("resize", handleResize, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return getBreakpoint(width);
};
