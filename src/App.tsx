// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import de one-pager - CORRECTE PATH
import OnePageLanding from "./pages/LandingPage/LandingPage";

// Behoud de demo en andere specifieke pagina's
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import ScrollToTop from "./components/ScrollToTop";
import { SupportChat } from "./pages/SupportChat";
import KlantDemoPage from "./pages/KlantDemoPage";

import "./index.css";

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <SupportChat />
      <Routes>
        {/* ✅ Hoofdpagina is nu de one-pager */}
        <Route path="/" element={<OnePageLanding />} />
        
        {/* ✅ Demo pagina's blijven apart */}
        <Route path="/demo/klant" element={<KlantDemoPage />} />
        
        {/* ✅ Behoud alleen essentiële aparte pagina's */}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        
        {/* ✅ Alle andere routes redirecten naar home met anchor links */}
        <Route path="/features" element={<HomeRedirect anchor="#benefits" />} />
        <Route path="/pricing" element={<HomeRedirect anchor="#pricing" />} />
        <Route path="/about" element={<HomeRedirect anchor="#features" />} />
      </Routes>
    </>
  );
};

// Helper component voor redirects naar sections
const HomeRedirect: React.FC<{ anchor: string }> = ({ anchor }) => {
  React.useEffect(() => {
    // Redirect naar home met smooth scroll naar sectie
    window.location.href = `/${anchor}`;
  }, [anchor]);

  return null;
};

export default App;