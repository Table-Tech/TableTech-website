// src/pages/PricingPage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const PricingPage: React.FC = () => (
  <>
    <Navbar />
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-gray-900 py-24 px-4 overflow-hidden">
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">
            Vergelijk onze abonnementen
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-white/50 rounded-xl overflow-hidden shadow-md">
              <thead>
                <tr className="bg-white/70 text-blue-900 font-semibold">
                  <th className="p-4 border border-white/50">Functie</th>
                  <th className="p-4 border border-white/50 text-center">
                    Starter<br />
                    <span className="text-xs font-normal">(€65/m of €650/j)</span>
                  </th>
                  <th className="p-4 border border-white/50 text-center">
                    Standaard<br />
                    <span className="text-xs font-normal">(€70/m of €700/j)</span>
                  </th>
                  <th className="p-4 border border-white/50 text-center">
                    Professional<br />
                    <span className="text-xs font-normal">(€85/m of €850/j)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur text-gray-800">
                {[
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
                  ["Proefperiode", "14 dagen", "14 dagen", "14 dagen"]
                ].map(([feature, starter, standard, pro], i) => (
                  <tr key={i} className="border border-white/50">
                    <td className="p-3 border border-white/50">{feature}</td>
                    <td className="p-3 text-center border border-white/50">{starter}</td>
                    <td className="p-3 text-center border border-white/50">{standard}</td>
                    <td className="p-3 text-center border border-white/50">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bovenste fade-in effect */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-t from-cyan-50 via-white to-transparent z-0" />
    </section>

    <CallToAction />
    <Footer />
  </>
);
