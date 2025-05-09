// src/pages/FeaturePage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import statsAnimation from "../assets/animations/statistics-animation.json";
import ChefAnimation from "../assets/animations/chef-animation1.json";
import DigitalReceiptAnimation from "../assets/animations/Digtial-bon-animation.json";
import FooiGevenAnimation from "../assets/animations/fooi-geven-animation.json";
import ProductVooraad from "../assets/animations/product-stock-animation.json";
import Multitalen from "../assets/animations/Multi-talen-animation.json";
import Feedback from "../assets/animations/feedback-animation.json";
import Upsell from "../assets/animations/upsell-animatie.json";
import StaffPressure from "../assets/animations/staffPressure-animation.json";
import HappyClients from "../assets/animations/happy-clinet-animation.json";
import EffcientWork from "../assets/animations/efficient-work-animation.json";

export const FeaturePage: React.FC = () => {
  const features = [
    {
      title: "Statistieken & inzichten",
      description:
        "Bekijk bestellingen, omzet en populaire gerechten per dag, week of maand in overzichtelijke dashboards.",
      animation: statsAnimation,
    },
    {
      title: "Productvoorraad bijhouden",
      description: "Laat automatisch gerechten verdwijnen die tijdelijk niet beschikbaar zijn.",
      animation: ProductVooraad,
    },
    {
      title: "Fooi via mobiel",
      description: "Gasten kunnen veilig fooi geven via hun telefoon – zonder contant geld of pinpas.",
      animation: FooiGevenAnimation,
    },
    {
      title: "Digitale bonnen & minder papierverbruik",
      description: "Klanten ontvangen hun bon digitaal – duurzaam én geen papieren rommel meer.",
      animation: DigitalReceiptAnimation,
    },
    {
      title: "Meertalig menu",
      description: "Menu automatisch vertaald – ideaal voor internationale gasten zonder taalbarrières.",
      animation: Multitalen,
    },
    {
      title: "Upsell-opties bij bestelling",
      description:
        "Toon slimme suggesties tijdens het bestelproces – verhoog de gemiddelde bestelwaarde.",
      animation: Upsell,
    },
    {
      title: "Feedback verzamelen",
      description:
        "Gasten geven direct feedback na betaling – waardevol zonder dat personeel iets hoeft te vragen.",
      animation: Feedback,
    },
    {
      title: "Personeelsnotificaties",
      description:
        "Meldingen voor personeel bij nieuwe of aangepaste bestellingen – geen handmatig roepen meer.",
      animation: ChefAnimation,
    },
    {
      title: "Minder personeelsdruk",
      description: "Door zelfbediening besparen ondernemers flink op personeel – zeker in drukke tijden.",
      animation: StaffPressure,
    },
    {
      title: "Hogere klanttevredenheid",
      description:
        "Gasten ervaren snelheid, duidelijkheid en controle – wat leidt tot hogere reviews en herhaalbezoeken.",
      animation: HappyClients,
    },
    {
      title: "Efficiënter werken",
      description:
        "Van bestelling tot betaling – alles digitaal geregeld. Minder fouten, sneller rondes lopen.",
      animation: EffcientWork,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 scale-[0.90] origin-top bg-gradient-to-b from-white via-blue-50 to-cyan-50 text-gray-900 min-h-screen">
        <section className="py-20 px-4">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-14 text-blue-900">
              Onze functies
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
              {features.map(({ title, description, animation }, index) => (
                <motion.div
                  key={title}
                  className="relative w-[340px] h-[220px] bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center group transition-all duration-300 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  {/* Animatie groter */}
                  <div className="pointer-events-none z-0 scale-110">
                    <Lottie animationData={animation} loop={true} className="w-32 h-32" />
                  </div>

                  {/* Hover-informatie */}
                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 z-10">
                    <h3 className="text-base font-semibold text-blue-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-700">{description}</p>
                  </div>
                </motion.div>
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
