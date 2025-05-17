import React from "react";
import plantenBg from "../assets/Planten.png";

export const BenefitsTwo: React.FC = () => {
  return (
    <section
      id="benefits-2"
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      <div className="absolute inset-0 bg-[#3b2a1d]/20 z-0" />
      <div className="relative z-10 container mx-auto max-w-4xl text-center px-4">
        <div className="bg-[#f5efe7]/80 backdrop-blur-md border border-[#b89b85]/30 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#5e3d2b] mb-6">Meer functies</h2>
          <ul className="space-y-4 text-[#5f4534] text-sm">
            <li>📱 <strong>Mobiele optimalisatie:</strong> Direct bestellen vanaf elke smartphone.</li>
            <li>📊 <strong>Dashboard analyse:</strong> Realtime inzichten in verkoop en voorkeuren.</li>
            <li>🔄 <strong>Voorraadkoppeling:</strong> Synchronisatie met je keukensysteem.</li>
            <li>🛎️ <strong>Snelle service melding:</strong> Gasten kunnen personeel oproepen.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
