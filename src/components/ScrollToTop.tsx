import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Stap 1: kill eventuele animatie
    if (window.lenis) {
      // Forceer stoppen hierdoor gaat die ding niet onder beginnen bij nieuwe pagina als je snel scrolt en klikt op andere pagina
      window.lenis.stop();

      // Scroll direct naar boven
      window.lenis.scrollTo(0, { immediate: true });

      // ✨ EXTRA: forceer positie hard in DOM zelf
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Start Lenis opnieuw, na render
      setTimeout(() => {
        window.lenis?.start();
      }, 100); // iets langere delay helpt hier
    } else {
      // fallback zonder Lenis
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
