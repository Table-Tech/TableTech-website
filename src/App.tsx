// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import { FeaturePage } from "./pages/FeaturePage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { SupportChat } from "./pages/SupportChat";
import KlantDemoPage from "./pages/KlantDemoPage";

import "./index.css";

const App: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/klant-demo" element={<KlantDemoPage />} />
      <Route path="/support" element={<SupportChat />} /> {/* Optional as a full page */}
    </Route>
  </Routes>
);

export default App;
