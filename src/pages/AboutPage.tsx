import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import planten2 from "../assets/afbeeldingen/Planten.png";
import { useLenisScroll } from "../components/useLenisScroll"; // ✅ Lenis scroll hook

export const AboutPage: React.FC = () => {
  useLenisScroll(); // ✅ Activeer smooth scroll

  // Scroll direct naar boven bij mount
  useEffect(() => {
    requestAnimationFrame(() => {
      const lenis = window.lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0); // fallback
      }
    });
  }, []);

  return (
    <div className="bg-[#2C1E1A] text-[#F5F0EB] min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={planten2}
          alt="About Hero"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2C1E1A]/20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Over TableTech
          </h1>
        </div>
      </div>

      <main className="pt-12 sm:pt-16 flex-grow">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white/70 text-[#2C1E1A] border border-[#E8D8CE] rounded-3xl shadow-2xl p-6 sm:p-10">
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Wie zijn wij?</h2>
              <p>Bij TableTech geloven we in slimme digitale oplossingen voor de horeca...</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Onze Missie</h2>
              <p>Wij willen restaurants helpen door de werkdruk te verlagen...</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Wat bieden wij?</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Het digitale menu bekijken</li>
                <li>Bestellingen direct via hun telefoon plaatsen</li>
                <li>Direct betalen zonder te wachten</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Waarom kiezen voor TableTech?</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Snellere service en minder wachttijd</li>
                <li>Tevreden gasten & positieve beleving</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Ons Team</h2>
              <p>TableTech is gebouwd door een jong en gemotiveerd team...</p>
            </section>
          </div>
        </section>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
