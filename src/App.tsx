import React from "react";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { FeaturePage } from "./pages/FeaturePage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import "./index.css";
// import other pages as you build them

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/features" element={<FeaturePage />} />
    <Route path="/pricing" element={<PricingPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
  </Routes>
);

export default App;
