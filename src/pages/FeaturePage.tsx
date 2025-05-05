// src/pages/FeaturePage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const FeaturePage: React.FC = () => {
  const features = [
    {
      title: "QR-bestellen aan tafel",
      description: "Laat gasten eenvoudig hun bestelling plaatsen met een simpele QR-scan – geen wachttijd meer.",
      icon: "📱",
    },
    {
      title: "Direct betalen via mobiel",
      description: "Snelle en veilige betaling direct vanaf de telefoon – geen fysieke pinpassen of bonnen nodig.",
      icon: "💳",
    },
    {
      title: "Realtime dashboard",
      description: "Volg bestellingen, omzet en tafelactiviteit in realtime vanaf elk apparaat.",
      icon: "📊",
    },
    {
      title: "Eenvoudig menubeheer",
      description: "Pas je menu razendsnel aan, voeg nieuwe items toe of zet gerechten tijdelijk uit.",
      icon: "🧾",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-gradient-to-b from-white via-blue-50 to-cyan-50 text-gray-900">
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-900">
              Onze functies
            </h1>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 mb-20">
              {features.map(({ title, description, icon }) => (
                <div
                  key={title}
                  className="bg-white/30 border border-white/40 backdrop-blur-md rounded-2xl shadow-xl p-8 transition hover:shadow-2xl hover:scale-[1.02] flex flex-col"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-800">{title}</h3>
                  <p className="text-gray-800 text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};
