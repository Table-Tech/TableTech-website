// src/components/ScrollToTop.tsx
import { useEffect } from "react";

const ScrollToTop: React.FC = () => {
  useEffect(() => {
    // Kill eventuele animatie
    if (window.lenis) {
      // Forceer stoppen
      window.lenis.stop();
      
      // Scroll direct naar boven
      window.lenis.scrollTo(0, { immediate: true });
      
      // Forceer positie hard in DOM zelf
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Start Lenis opnieuw, na render
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.start();
        }
      }, 50);
    } else {
      // Fallback zonder Lenis
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  return null;
};

export default ScrollToTop;