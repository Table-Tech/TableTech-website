// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero"; // ✅ complete homepage wrapper
import "./index.css";

const App: React.FC = () => {
  return (
    <Routes>
      {/* ✅ Dit toont de volledige homepage met 3D én alle secties */}
      <Route path="/" element={<Hero />} />
    </Routes>
  );
};

export default App;
