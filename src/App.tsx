// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./index.css";

const App: React.FC = () => {
  return (
    <Routes>
      {/* ✅ Laadt de volledige landing page met donkere stijl en 3D placeholder */}
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
