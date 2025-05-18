// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Gebruik Lenis instance op window, of fallback naar native
    requestAnimationFrame(() => {
      const lenis = window.lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
