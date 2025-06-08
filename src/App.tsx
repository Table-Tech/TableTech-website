// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import { FeaturePage } from "./pages/FeaturePage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import ScrollToTop from "./components/ScrollToTop";
import { ScrollDots } from "./components/ScrollDotss";
import { SupportChat } from "./pages/SupportChat";
import KlantDemoPage from "./pages/KlantDemoPage";
import RestaurantThemesPage from "./pages//LandingPage/restaurant-themes";

import "./index.css";

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <ScrollDots />
      <SupportChat />
      
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
    </>
  );
};

export default App;