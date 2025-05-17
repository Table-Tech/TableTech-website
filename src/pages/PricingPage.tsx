// src/pages/PricingPage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import planten2 from "../assets/Planten.png";

export const PricingPage: React.FC = () => {
  const pricingData = [
    ["Tablet inbegrepen", "❌ Huur €12/m", "✔ 1 tablet", "✔ 1+ tablets"],
    ["Dashboard & bestellingen", "✔", "✔", "✔"],
    ["QR-menu met logo", "✔", "✔", "✔"],
    ["Online betalingen", "✔", "✔", "✔"],
    ["Onbeperkt aantal tafels", "✔", "✔", "✔"],
    ["Kassa-integratie", "✔", "✔", "✔"],
    ["Printer-integratie", "✔", "✔", "✔"],
    ["Afhaal & bezorgopties", "✔", "✔", "✔"],
    ["Analytics & rapporten", "❌", "✔", "✔ geavanceerd"],
    ["Exportmogelijkheden", "❌", "✔", "✔"],
    ["Meerdere gebruikers", "❌", "✔", "✔"],
    ["Upsell/Cross-sell", "❌", "❌", "✔"],
    ["Volledige branding", "❌", "❌", "✔ (kleur, logo, stijl)"],
    ["Prioriteit support", "❌", "❌", "✔ 24/7"],
    ["Installatie op locatie", "❌", "❌", "✔ inbegrepen"],
    ["Extra vestiging", "€45/m", "€35/m", "Op maat"],
    ["Proefperiode", "14 dagen", "14 dagen", "14 dagen"],
  ];

  return (
    <div className="bg-[#2C1E1A] text-[#F5F0EB] min-h-screen flex flex-col">
      <Navbar />

      {/* Hero bovenaan - helder zoals FeaturePage */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={planten2}
          alt="Pricing Hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2C1E1A]/20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Vergelijk onze abonnementen
          </h1>
        </div>
      </div>

      <main className="pt-12 sm:pt-16 flex-grow">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container max-w-6xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md border border-[#E8D8CE] rounded-3xl shadow-2xl p-6 sm:p-10">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#3B2A1D]">
                Wat krijg je per pakket?
              </h2>

              <div className="overflow-x-auto text-xs sm:text-sm">
                <table className="w-full border border-[#cbb6a0] border-collapse text-[#2C1E1A] bg-white/90">
                  <thead>
                    <tr className="bg-[#A77B5D] text-white font-semibold border-b border-[#d5c8bb]">
                      <th className="p-4 border-r border-[#d5c8bb] text-left">Functie</th>
                      <th className="p-4 border-r border-[#d5c8bb] text-center">
                        Starter<br />
                        <span className="text-[10px] sm:text-xs font-normal">(€65/m of €650/j)</span>
                      </th>
                      <th className="p-4 border-r border-[#d5c8bb] text-center">
                        Standaard<br />
                        <span className="text-[10px] sm:text-xs font-normal">(€70/m of €700/j)</span>
                      </th>
                      <th className="p-4 text-center">
                        Professional<br />
                        <span className="text-[10px] sm:text-xs font-normal">(€85/m of €850/j)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingData.map(([feature, starter, standard, pro], i) => (
                      <tr key={i} className="border-b border-[#d5c8bb]">
                        <td className="p-3 border-r border-[#d5c8bb] text-left">{feature}</td>
                        <td className="p-3 text-center border-r border-[#d5c8bb]">{starter}</td>
                        <td className="p-3 text-center border-r border-[#d5c8bb]">{standard}</td>
                        <td className="p-3 text-center">{pro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
