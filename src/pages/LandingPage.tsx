// src/pages/LandingPage.tsx
import { HeroSection } from "../components/HeroSection";
import { DashboardPreview } from "../components/DashboardPreview";
import { CallToAction } from "../components/CallToAction";
import { Navbar } from "../components/Navbar";
import { ScrollDots } from "../components/ScrollDotss";
import { HorizontalScroll } from "../components/HorizontalScroll";
import { useLenisScroll } from "../components/useLenisScroll";
import { Footer } from "../components/Footer";

const LandingPage: React.FC = () => {
  useLenisScroll();

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ScrollDots />

      {/* Horizontaal scrollgedeelte */}
      <section className="w-full">
        <HorizontalScroll />
      </section>

      {/* Daarna verder verticaal scrollen */}
      <section className="w-full">
        <DashboardPreview />
      </section>

      <section className="w-full">
        <CallToAction />
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
