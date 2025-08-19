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
import ContainerScroll from "../../components/ContainerScroll";


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

      {/* 3D Container Scroll Section */}
      <section className="w-full">
        <ContainerScroll 
          title={
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                Jouw <span className="text-[#E86C28]">Dashboard</span> Ervaring
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                Beheer je restaurant moeiteloos met ons intuïtieve <span className="text-[#E86C28] font-semibold">dashboard</span>. Krijg direct inzicht en geniet van eenvoudige bediening.
              </p>
            </div>
          }
          card={null}
        />
      </section>

      {/* Pricing Section */}
  <section id="pricing" className="w-full scroll-mt-24">
        <PricingNew />
      </section>

      {/* Contact Section - seamless transition to footer */}
      <section id="contact" className="w-full scroll-mt-24">
        <ContactSection />
      </section>

      {/* Footer - no visual separation */}
      <div className="w-full relative">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;