// src/pages/PricingPage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

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
    <div className="bg-gradient-to-b from-blue-100 via-white to-cyan-100 min-h-screen text-gray-900 flex flex-col">
      <Navbar />

      <main className="pt-20 sm:pt-24 flex-grow scale-[0.97] transform origin-top transition-transform duration-300">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container max-w-6xl mx-auto">
            <div className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-10">
                Vergelijk onze abonnementen
              </h1>

              <div className="overflow-x-auto text-xs sm:text-sm">
                <table className="w-full border border-black border-collapse">
                  <thead>
                    <tr className="bg-white text-blue-900 font-semibold border-b border-black">
                      <th className="p-4 border-r border-black text-left">Functie</th>
                      <th className="p-4 border-r border-black text-center">
                        Starter<br />
                        <span className="text-[10px] sm:text-xs font-normal">(€65/m of €650/j)</span>
                      </th>
                      <th className="p-4 border-r border-black text-center">
                        Standaard<br />
                        <span className="text-[10px] sm:text-xs font-normal">(€70/m of €700/j)</span>
                      </th>
                      <th className="p-4 text-center">
                        Professional<br />
                        <span className="text-[10px] sm:text-xs font-normal">(€85/m of €850/j)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-800">
                    {pricingData.map(([feature, starter, standard, pro], i) => (
                      <tr key={i} className="border-b border-black">
                        <td className="p-3 border-r border-black text-left">{feature}</td>
                        <td className="p-3 text-center border-r border-black">{starter}</td>
                        <td className="p-3 text-center border-r border-black">{standard}</td>
                        <td className="p-3 text-center">{pro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="m-0 p-0">
          <CallToAction />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
