// src/pages/LandingPage/LandingPage.tsx
import React from "react";
import { HeroSection } from "./HeroSection";
import { Navbar } from "../../components/Navbar";
import { BenefitsPinned } from "../../components/BenefitsPinned";
import { PricingNew } from "./PricingNew";
import { useLenisScroll } from "../../components/useLenisScroll";
import { Footer } from "../../components/Footer";
import RestaurantThemesPage from "./restaurant-themes";
import ContactSection from "../../components/ContactBookingSection";

const LandingPage: React.FC = () => {
  useLenisScroll();

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="w-full">
        <HeroSection />
      </section>

      {/* Benefits Pinned Scrolling Section */}
      <section id="benefits" className="w-full bg-gradient-to-br from-gray-50 to-white">
        <BenefitsPinned />
      </section>

      {/* Restaurant Themes Section */}
      <section id="themes" className="w-full">
        <RestaurantThemesPage />
      </section>


      {/* Smooth transition from pricing to footer */}
      <div className="w-full relative">
        {/* Pricing Section */}
        <section id="pricing" className="w-full">
          <PricingNew />
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full">
          <ContactSection />
        </section>


        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;