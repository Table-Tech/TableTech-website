// src/pages/FeaturePage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Animaties
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
import CircleAnimation from "../assets/animations/cirlce-aniamtion.json";

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
    null,
    {
      title: "Meertalig menu",
      description: "Menu automatisch vertaald – ideaal voor internationale gasten zonder taalbarrières.",
      animation: Multitalen,
    },
    {
      title: "Upsell-opties bij bestelling",
      description: "Toon slimme suggesties tijdens het bestelproces – verhoog de gemiddelde bestelwaarde.",
      animation: Upsell,
    },
    null,
    {
      title: "Feedback verzamelen",
      description: "Gasten geven direct feedback na betaling – waardevol zonder dat personeel iets hoeft te vragen.",
      animation: Feedback,
    },
    {
      title: "Personeelsnotificaties",
      description: "Meldingen voor personeel bij nieuwe of aangepaste bestellingen – geen handmatig roepen meer.",
      animation: ChefAnimation,
    },
    {
      title: "Minder personeelsdruk",
      description: "Door zelfbediening besparen ondernemers flink op personeel – zeker in drukke tijden.",
      animation: StaffPressure,
    },
    {
      title: "Hogere klanttevredenheid",
      description: "Gasten ervaren snelheid, duidelijkheid en controle – wat leidt tot hogere reviews en herhaalbezoeken.",
      animation: HappyClients,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-100 via-white to-cyan-100 min-h-screen text-gray-900">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section id="dashboard" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900">
                Onze functies
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                {features.map((item, index) => {
                  if (item === null) {
                    return (
                      <div
                        key={`circle-animation-${index}`}
                        className="w-full flex items-center justify-center col-span-1"
                      >
                        <Lottie
                          animationData={CircleAnimation}
                          loop
                          className="w-64 h-64 sm:w-72 sm:h-72"
                        />
                      </div>
                    );
                  }

                  const { title, description, animation } = item;

                  return (
                    <motion.div
                      key={title}
                      className="relative w-[260px] sm:w-[300px] h-[220px] bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl overflow-hidden group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{
                        y: -6,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 350, damping: 18 },
                      }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04, duration: 0.35 }}
                    >
                      <div className="absolute top-0 left-0 w-full bg-blue-600 text-white text-sm font-semibold py-2 text-center rounded-t-2xl z-20">
                        {title}
                      </div>

                      <div className="pointer-events-none z-0 flex items-center justify-center h-full pt-5">
                        <Lottie animationData={animation} loop className="w-24 h-24 sm:w-28 sm:h-28" />
                      </div>

                      <div className="absolute top-0 left-0 w-full h-full pt-[38px] bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-linear flex flex-col items-center justify-center text-center px-4 z-10 rounded-2xl">
                        <p className="text-sm text-gray-700">{description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <CallToAction />
      </main>

      <footer className="py-4">
        <Footer />
      </footer>
    </div>
  );
};

export default FeaturePage;
