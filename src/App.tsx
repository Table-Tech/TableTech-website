import React from "react";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import "./index.css";
// import other pages as you build them

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    {/* future routes:
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      ...
    */}
  </Routes>
);

export default App;
