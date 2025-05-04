// src/pages/LandingPage.tsx
import { HeroSection } from "../components/Herosection";
import { Benefits } from "../components/Benefits";
import { DashboardPreview } from "../components/DashboardPreview";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <HeroSection />
        <Benefits />
        <DashboardPreview />
        <CallToAction />
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
