// src/pages/AboutPage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const AboutPage: React.FC = () => (
  <div className="bg-gradient-to-b from-blue-100 via-white to-cyan-100 min-h-screen text-gray-900 flex flex-col">
    <Navbar />

    <main className="pt-20 sm:pt-24 scale-[0.97] transform origin-top transition-transform duration-300 flex-grow">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
            Over TableTech
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Wie zijn wij?</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Bij TableTech geloven we in slimme digitale oplossingen voor de horeca. Ons team is gepassioneerd over het efficiënter, soepeler en toekomstbestendig maken van restaurantoperaties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Onze Missie</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Wij willen restaurants helpen door de werkdruk te verlagen, de klantervaring te verbeteren en het bestel- en betaalproces te moderniseren – eenvoudig en digitaal.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Wat bieden wij?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
              Onze contactloze oplossing zorgt ervoor dat gasten met één scan:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
              <li>Het digitale menu bekijken</li>
              <li>Bestellingen direct via hun telefoon plaatsen</li>
              <li>Direct betalen zonder te wachten</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Waarom kiezen voor TableTech?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
              <li>Snellere service en minder wachttijd</li>
              <li>Tevreden gasten & positieve beleving</li>
              <li>Meer omzet door efficiënte workflow</li>
              <li>Gebruiksvriendelijk dashboard voor personeel en keuken</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Ons Team</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              TableTech is gebouwd door een jong en gemotiveerd team met ervaring in IT, software en ondernemerschap. Wij zijn er om restaurants te helpen groeien in een digitale wereld.
            </p>
          </section>
        </div>
      </section>

      <section className="p-0 m-0">
        <div className="flex justify-center">
          <CallToAction />
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default AboutPage;
