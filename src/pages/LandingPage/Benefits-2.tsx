import React from "react";
import plantenBg from "../../assets/afbeeldingen/optie4.png";

export const BenefitsTwo: React.FC = () => {
  return (
    <section
      id="benefits-2"
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0 overflow-hidden"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/20 z-0" />

      {/* Inhoud wrapper met responsive paddings */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64">
        </div>
    </section>
  );
};