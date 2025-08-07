import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import planten2 from "../assets/afbeeldingen/Planten.png";
import { useLenisScroll } from "../components/useLenisScroll"; // ✅ toegevoegd

export const PrivacyPolicyPage: React.FC = () => {
  useLenisScroll(); // ✅ activeer smooth scroll

  return (
    <div className="bg-[#2C1E1A] text-[#F5F0EB] min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={planten2}
          alt="Privacy Hero"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2C1E1A]/20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Privacybeleid
          </h1>
        </div>
      </div>

      <main className="pt-12 sm:pt-16 flex-grow">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white/70 text-[#2C1E1A] border border-[#E8D8CE] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
            <p className="mb-6">Bij TableTech nemen we jouw privacy serieus...</p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-3">1. Gegevens die we verzamelen</h2>
            <ul className="list-disc list-inside mb-6 space-y-1">
              <li>Naam, e-mailadres en telefoonnummer</li>
              <li>Bedrijfsinformatie</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold mb-3">2. Waarom we deze informatie gebruiken</h2>
            <p className="mb-6">Wij gebruiken jouw gegevens om onze diensten te leveren...</p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-3">3. Delen met derden</h2>
            <p className="mb-6">TableTech verkoopt jouw gegevens nooit aan derden...</p>

            <h2 className="text-xl sm:text-2xl font-semibold mb-3">4. Jouw rechten</h2>
            <p className="mb-6">Je hebt het recht om je gegevens in te zien...</p>

            <p className="text-sm text-gray-500 mt-10">Laatst bijgewerkt: 5 mei 2025</p>
          </div>
        </section>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
