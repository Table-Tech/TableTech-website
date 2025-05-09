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
      glow: true,
    },
    {
      title: "Productvoorraad bijhouden",
      description: "Laat automatisch gerechten verdwijnen die tijdelijk niet beschikbaar zijn.",
      animation: ProductVooraad,
      glow: true,
    },
    {
      title: "Fooi via mobiel",
      description: "Gasten kunnen veilig fooi geven via hun telefoon – zonder contant geld of pinpas.",
      animation: FooiGevenAnimation,
      glow: true,
    },
    {
      title: "Digitale bonnen & minder papierverbruik",
      description: "Klanten ontvangen hun bon digitaal – duurzaam én geen papieren rommel meer.",
      animation: DigitalReceiptAnimation,
      glow: true,
    },
    {
      title: "Meertalig menu",
      description: "Menu automatisch vertaald – ideaal voor internationale gasten zonder taalbarrières.",
      animation: Multitalen,
      glow: true,
    },
    {
      title: "Upsell-opties bij bestelling",
      description:
        "Toon slimme suggesties tijdens het bestelproces – verhoog de gemiddelde bestelwaarde.",
        animation: Upsell,
      glow: true,
    },
    {
      title: "Feedback verzamelen",
      description:
        "Gasten geven direct feedback na betaling – waardevol zonder dat personeel iets hoeft te vragen.",
      animation: Feedback,
      glow: false,
    },
    {
      title: "Personeelsnotificaties",
      description:
        "Meldingen voor personeel bij nieuwe of aangepaste bestellingen – geen handmatig roepen meer.",
      animation: ChefAnimation,
      glow: false,
    },
    {
      title: "Minder personeelsdruk",
      description: "Door zelfbediening besparen ondernemers flink op personeel – zeker in drukke tijden.",
      animation: StaffPressure,
      glow: true,
    },
    {
      title: "Hogere klanttevredenheid",
      description:
        "Gasten ervaren snelheid, duidelijkheid en controle – wat leidt tot hogere reviews en herhaalbezoeken.",
        animation: HappyClients,
      glow: false,
    },
    {
      title: "Efficiënter werken",
      description:
        "Van bestelling tot betaling – alles digitaal geregeld. Minder fouten, sneller rondes lopen.",
        animation: EffcientWork,
      glow: false,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-gradient-to-b from-white via-blue-50 to-cyan-50 text-gray-900 min-h-screen">
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-900">
              Onze functies
            </h1>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-2">
              {features.map(({ title, description, animation, glow }, index) => (
                <motion.div
                  key={title}
                  className="bg-white border border-blue-100 shadow-[0_8px_30px_rgba(0,191,255,0.08)] rounded-2xl p-8 flex flex-col items-center text-center transition duration-300"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className={`mb-6 w-40 h-40 flex items-center justify-center ${
                      glow ? "drop-shadow-[0_0_16px_rgba(0,191,255,0.45)]" : ""
                    }`}
                  >
                    {animation ? (
                      <Lottie animationData={animation} loop={true} />
                    ) : (
                      <div className="text-5xl">✨</div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-800">{title}</h3>
                  <p className="text-gray-800 text-sm">{description}</p>
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
