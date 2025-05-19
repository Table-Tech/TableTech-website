// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-blue-100 via-white to-cyan-100 min-h-screen text-gray-900">
      <Navbar />

      <main className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <Outlet />
      </main>

      <footer className="py-6">
        <Footer />
      </footer>
    </div>
  );
};
