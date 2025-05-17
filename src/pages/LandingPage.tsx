import { HeroSection } from "../components/HeroSection";
import { DashboardPreview } from "../components/DashboardPreview";
import { CallToAction } from "../components/CallToAction";
import { Navbar } from "../components/Navbar";
import { ScrollDots } from "../components/ScrollDotss";
import { HorizontalScroll } from "../components/HorizontalScroll";
import { useLenisScroll } from "../components/useLenisScroll";

const LandingPage: React.FC = () => {
  useLenisScroll();

  return (
    <div className="overflow-hidden">
      <Navbar />
      <HeroSection />
      <ScrollDots />

      {/* Horizontaal scrollgedeelte */}
      <HorizontalScroll />

      {/* Daarna verder verticaal scrollen */}
      <DashboardPreview />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
