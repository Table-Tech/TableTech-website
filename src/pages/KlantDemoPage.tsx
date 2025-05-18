import React from "react";
import PhoneMock from "../components/PhoneMock";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useLenisScroll } from "../components/useLenisScroll";
import { CallToAction } from "../components/CallToAction";

import planten from "../assets/Planten.png";

const KlantDemoPage: React.FC = () => {
  useLenisScroll();

  return (
    <div
      className="min-h-screen flex flex-col text-[#F5F0EB]"
      style={{
        backgroundColor: "#2C1E1A",
        backgroundImage: `url(${planten})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-start py-16 px-4">
        <div className="mt-24 text-center max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Ervaar hoe makkelijk het is</h1>
          <p className="mb-8 text-lg">
            Simuleer hoe gasten bestellingen plaatsen via hun telefoon.
          </p>
        </div>

        <div
          className="h-[600px] w-[320px] overflow-hidden rounded-[2rem] border-4 border-black shadow-2xl bg-white"
          data-lenis-prevent
        >
          <div className="h-full overflow-y-auto scrollbar-none">
            <PhoneMock />
          </div>
        </div>
      </main>
      <CallToAction />

      <Footer />
    </div>
  );
};

export default KlantDemoPage;
