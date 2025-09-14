// src/App.tsx
import { lazy, Suspense, useEffect, useState } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const CookieConsentBanner = lazy(() => import("./components/CookieConsentBanner"));
import LoadingScreen from "./components/LoadingScreen";

import ScrollToTop from "./components/ScrollToTop";
import { ScrollDots } from "./components/ScrollDots";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import securityManager from "./utils/security";

import "./index.css";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initialize security on app load
    securityManager.ensureCSRFToken();

    // Simulate loading time and preload critical components
    const initializeApp = async () => {
      try {
        // Minimum loading time for smooth UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Preload critical components
        await Promise.all([
          import("./pages/LandingPage/LandingPage"),
          import("./components/CookieConsentBanner")
        ]);

        setIsLoading(false);
        // Small delay before showing content for smooth transition
        setTimeout(() => setShowContent(true), 300);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
        setShowContent(true);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <ScrollToTop />
      <ScrollDots />
      <ScrollProgressBar />
      <Suspense fallback={null}>
        <LandingPage />
      </Suspense>
      <Suspense fallback={null}>
        <CookieConsentBanner />
      </Suspense>
    </div>
  );
};

export default App;