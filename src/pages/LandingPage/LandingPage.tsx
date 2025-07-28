// src/pages/LandingPage/LandingPage.tsx
import React from "react";
import { HeroSection } from "./HeroSection";
import { CallToAction } from "../../components/CallToAction";
import { Navbar } from "../../components/Navbar";
import { ScrollDots } from "../../components/ScrollDotss";
import { HorizontalScroll } from "../../components/HorizontalScroll";
import { PricingSection } from "./Pricing";
import { useLenisScroll } from "../../components/useLenisScroll";
import { Footer } from "../../components/Footer";
import RestaurantThemesPage from "../../pages/LandingPage/restaurant-themes";

const LandingPage: React.FC = () => {
  useLenisScroll();

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <ScrollDots />

      {/* Hero Section */}
      <section id="hero" className="w-full">
        <HeroSection />
      </section>

      {/* Benefits Horizontal Scroll Section */}
      <section id="benefits" className="w-full">
        <HorizontalScroll />
      </section>

      {/* Restaurant Themes Section */}
      <section id="themes" className="w-full">
        <RestaurantThemesPage />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full">
        <PricingSection />
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