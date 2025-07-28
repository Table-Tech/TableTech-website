import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Stap 1: kill eventuele animatie
    if (window.lenis) {
      const lenis = window.lenis as Record<string, unknown>;
      // Forceer stoppen hierdoor gaat die ding niet onder beginnen bij nieuwe pagina als je snel scrolt en klikt op andere pagina
      if (typeof lenis.stop === 'function') {
        (lenis.stop as () => void)();
      }

      // Scroll direct naar boven
      if (typeof lenis.scrollTo === 'function') {
        (lenis.scrollTo as (target: number, options?: Record<string, unknown>) => void)(0, { immediate: true });
      }

      // ✨ EXTRA: forceer positie hard in DOM zelf
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Start Lenis opnieuw, na render
      setTimeout(() => {
        const lenis = window.lenis as Record<string, unknown>;
        if (lenis && typeof lenis.start === 'function') {
          (lenis.start as () => void)();
        }
      }, 50); // Faster restart for better responsiveness
    } else {
      // fallback zonder Lenis
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
