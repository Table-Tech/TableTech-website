// src/App.tsx
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const SupportChat = lazy(() => import("./pages/SupportChat"));
const MenuDemo = lazy(() => import("./pages/MenuDemo/MenuDemo"));

import ScrollToTop from "./components/ScrollToTop";
import { ScrollDots } from "./components/ScrollDots";

import "./index.css";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <ScrollToTop />
      {isLandingPage && <ScrollDots />}
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/menu-demo" element={<MenuDemo />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <SupportChat />
      </Suspense>
    </>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;