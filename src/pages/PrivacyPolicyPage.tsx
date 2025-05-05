// src/pages/PrivacyPolicyPage.tsx
import React from "react";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";

export const PrivacyPolicyPage: React.FC = () => (
  <>
    <Navbar />

    <section className="bg-gradient-to-b from-blue-50 via-white to-cyan-50 py-24 px-4 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
          Privacybeleid
        </h1>

        <p className="mb-6 text-gray-700 leading-relaxed">
          Bij TableTech nemen we jouw privacy serieus. In dit beleid leggen we uit welke gegevens we verzamelen, waarom we dat doen en hoe we deze beschermen.
        </p>

        <h2 className="text-xl font-semibold mb-3 text-blue-800">1. Gegevens die we verzamelen</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
          <li>Naam, e-mailadres en telefoonnummer</li>
          <li>Bedrijfsinformatie</li>
          <li>Informatie over bestellingen en gebruik van de app</li>
        </ul>

        <h2 className="text-xl font-semibold mb-3 text-blue-800">2. Waarom we deze informatie gebruiken</h2>
        <p className="text-gray-700 mb-6">
          Wij gebruiken jouw gegevens om onze diensten te leveren, verbeteren en beveiligen. Denk aan het beheren van jouw restaurantaccount, het versturen van updates, en het analyseren van gebruikspatronen.
        </p>

        <h2 className="text-xl font-semibold mb-3 text-blue-800">3. Delen met derden</h2>
        <p className="text-gray-700 mb-6">
          TableTech verkoopt jouw gegevens nooit aan derden. We delen enkel gegevens met vertrouwde partners die ons helpen onze dienst te leveren (zoals hostingproviders).
        </p>

        <h2 className="text-xl font-semibold mb-3 text-blue-800">4. Jouw rechten</h2>
        <p className="text-gray-700 mb-6">
          Je hebt het recht om je gegevens in te zien, aan te passen of te verwijderen. Neem contact met ons op via{" "}
          <a href="mailto:privacy@tabletech.nl" className="text-blue-600 underline">
            privacy@tabletech.nl
          </a>{" "}
          voor verzoeken met betrekking tot jouw gegevens.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Laatst bijgewerkt: 5 mei 2025
        </p>
      </div>
    </section>

    <CallToAction />
    <Footer />
  </>
);
