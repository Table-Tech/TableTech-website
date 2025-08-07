// src/pages/LandingPage/LandingPage.tsx
import React from "react";
import { HeroSection } from "./HeroSection";
import { CallToAction } from "../../components/CallToAction";
import { Navbar } from "../../components/Navbar";
import { BenefitsScrollLock } from "../../components/BenefitsScrollLock";
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

      {/* Benefits Horizontal Lock Section */}
      <section id="benefits" className="w-full h-screen relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
        <BenefitsScrollLock />
      </section>

      {/* Restaurant Themes Section */}
      <section id="themes" className="w-full">
        <RestaurantThemesPage />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full">
        <PricingNew />
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full">
        <ContactSection />
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