import React from "react";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import "./index.css";
// import other pages as you build them

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/pricing" element={<PricingPage />} />
  </Routes>
);

export default App;
