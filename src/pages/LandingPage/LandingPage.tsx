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
  <section id="hero" className="w-full scroll-mt-24">
        <HeroSection />
      </section>

      {/* Benefits Pinned Scrolling Section */}
  <section id="benefits" className="w-full bg-gradient-to-br from-gray-50 to-white scroll-mt-24">
        <BenefitsPinned />
      </section>

      {/* Restaurant Themes Section */}
  <section id="themes" className="w-full scroll-mt-24">
        <RestaurantThemesPage />
      </section>


      {/* Pricing Section */}
  <section id="pricing" className="w-full scroll-mt-24">
        <PricingNew />
      </section>

      {/* Contact Section */}
  <section id="contact" className="w-full scroll-mt-24">
        <ContactSection />
      </section>

      {/* Footer */}
      <div className="w-full relative">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;