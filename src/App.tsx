// src/App.tsx
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const FeaturePage = lazy(() => import("./pages/FeaturePage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const SupportChat = lazy(() => import("./pages/SupportChat"));
const KlantDemoPage = lazy(() => import("./pages/KlantDemoPage"));
const RestaurantThemesPage = lazy(() => import("./pages/LandingPage/restaurant-themes"));

import ScrollToTop from "./components/ScrollToTop";
import { ScrollDots } from "./components/ScrollDotss";

import "./index.css";

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <ScrollDots />
      <SupportChat />
      
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/demo" element={<KlantDemoPage />} />
          <Route path="/themes" element={<RestaurantThemesPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;