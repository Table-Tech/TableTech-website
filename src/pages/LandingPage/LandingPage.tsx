// src/pages/LandingPage/LandingPage.tsx
import React from "react";
import { HeroSection } from "./HeroSection";
import { CallToAction } from "../../components/CallToAction";
import { Navbar } from "../../components/Navbar";
import { BenefitsHorizontalLock } from "../../components/BenefitsHorizontalLock";
import { PricingSectionB2B } from "./PricingB2B";
import { useLenisScroll } from "../../components/useLenisScroll";
import { Footer } from "../../components/Footer";
import RestaurantThemesPage from "./restaurant-themes";

const LandingPage: React.FC = () => {
  useLenisScroll();

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="w-full">
        <HeroSection />
      </section>

      {/* Benefits Horizontal Lock Section */}
      <section id="benefits" className="w-full h-screen relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
        <BenefitsHorizontalLock />
      </section>

      {/* Restaurant Themes Section */}
      <section id="themes" className="w-full">
        <RestaurantThemesPage />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full">
        <PricingSectionB2B />
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="w-full">
        <CallToAction />
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;