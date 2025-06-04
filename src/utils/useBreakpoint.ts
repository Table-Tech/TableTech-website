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
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return getBreakpoint(width);
};
