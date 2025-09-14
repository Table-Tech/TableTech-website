// src/pages/LandingPage/LandingPage.tsx
import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { HeroSection } from "./HeroSection";
import { Navbar } from "../../components/Navbar";
import { useLenisScroll } from "../../components/useLenisScroll";
import { Footer } from "../../components/Footer";

// Lazy load heavy components
const BenefitsPinned = lazy(() => import("../../components/BenefitsPinned").then(module => ({ default: module.BenefitsPinned })));
const PricingNew = lazy(() => import("./PricingNew").then(module => ({ default: module.PricingNew })));
const RestaurantThemesPage = lazy(() => import("./restaurant-themes"));
const ContactSection = lazy(() => import("../../components/ContactBookingSection"));
const ContainerScroll = lazy(() => import("../../components/ContainerScroll"));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
  </div>
);


const LandingPage: React.FC = () => {
  const { t } = useTranslation();
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
        <Suspense fallback={<SectionLoader />}>
          <BenefitsPinned />
        </Suspense>
      </section>

      {/* Restaurant Themes Section */}
  <section id="themes" className="w-full scroll-mt-24">
        <Suspense fallback={<SectionLoader />}>
          <RestaurantThemesPage />
        </Suspense>
      </section>

      {/* 3D Container Scroll Section */}
      <section className="w-full relative overflow-visible">
        <Suspense fallback={<SectionLoader />}>
          <ContainerScroll
            title={
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                  <span dangerouslySetInnerHTML={{ __html: t('experienceTitles.dashboardExperience') }} />
                </h2>
              </div>
            }
            card={
              <div className="w-full h-full relative overflow-hidden">
                {/* Video content - no overlay text */}
              </div>
            }
          />
        </Suspense>
      </section>

      {/* Pricing Section */}
  <section id="pricing" className="w-full scroll-mt-24">
        <Suspense fallback={<SectionLoader />}>
          <PricingNew />
        </Suspense>
      </section>

      {/* Contact Section - seamless on mobile */}
      <section id="contact" className="w-full scroll-mt-24">
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </section>

      {/* Footer - direct connection on mobile, spacing on larger screens */}
      <div className="w-full relative">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;