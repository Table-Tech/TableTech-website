// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { FeaturePage } from "./pages/FeaturePage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { ScrollProgressBar } from "./components/ScrollProgressBar";

import "./index.css";

const App: React.FC = () => (
  <>
    {/* Scroll voortgangsbalk */}
    <ScrollProgressBar />

    {/* Paginaroutes */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
    </Routes>
  </>
);

export default App;
