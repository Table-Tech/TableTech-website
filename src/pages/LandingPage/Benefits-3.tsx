import React from "react";
import plantenBg from "../../assets/afbeeldingen/optie4.png";

export const BenefitsThree: React.FC = () => {
  return (
    <section
      id="benefits-3"
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0 overflow-hidden"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/20 z-0" />
      
      {/* Empty content - just the background */}
    </section>
  );
};