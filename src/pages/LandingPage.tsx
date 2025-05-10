// src/pages/LandingPage.tsx
import { HeroSection } from "../components/HeroSection";
import { Benefits } from "../components/Benefits";
import { DashboardPreview } from "../components/DashboardPreview";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ScrollDots } from "../components/ScrollDotss";
import { VerticalLightStream } from "../components/VerticalLigthStream";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-blue-100 via-white to-cyan-100 min-h-screen text-gray-900">
      <Navbar />
      <main className="pt-20">
        <VerticalLightStream />
        <ScrollDots />
        <HeroSection />
        <Benefits />
        <DashboardPreview />
        <section className="pt-12 pb-6">
          <CallToAction />
        </section>
        <footer className="py-6">
          <Footer />
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
