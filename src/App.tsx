// src/App.tsx
import { lazy, Suspense, useEffect } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const CookieConsentBanner = lazy(() => import("./components/CookieConsentBanner"));

import ScrollToTop from "./components/ScrollToTop";
import { ScrollDots } from "./components/ScrollDots";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import securityManager from "./utils/security";

import "./index.css";

const App: React.FC = () => {
  useEffect(() => {
    // Initialize security on app load
    securityManager.ensureCSRFToken();
  }, []);

  return (
    <>
      <ScrollToTop />
      <ScrollDots />
      <ScrollProgressBar />
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <LandingPage />
      </Suspense>
      <Suspense fallback={null}>
        <CookieConsentBanner />
      </Suspense>
    </>
  );
};

export default App;