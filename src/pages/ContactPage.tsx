// src/pages/ContactPage.tsx
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { FaUser, FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";

export const ContactPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    emailjs
      .sendForm("service_fye4t2s", "template_g0yqwdl", form.current, "WvojOqr0UVF9lHbU_")
      .then(() => {
        alert("Message sent!");
        form.current?.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("Something went wrong, please try again.");
      });
  };

  return (
    <>
      <Navbar />

      <main className="scale-[0.90] origin-top bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-gray-900 pt-24 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">
            Vragen? Wij staan voor je klaar
          </h2>
          <p className="mb-4 max-w-xl mx-auto text-sm md:text-base">
            Heb je vragen over sales of een samenwerking? Laat je gegevens achter en we nemen snel contact op.
          </p>
          <p className="mb-10 max-w-xl mx-auto text-sm md:text-base">
            Voor <strong>support</strong> kun je mailen naar{" "}
            <a href="mailto:info@tabletech.nl" className="text-blue-600 underline font-medium">
              info@tabletech.nl
            </a>.
          </p>
        </div>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="mt-12 max-w-4xl mx-auto bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6"
        >
          <h3 className="text-xl font-semibold text-center text-blue-800">Contactgegevens</h3>
          <p className="text-sm text-center text-gray-700 mb-6">
            Laat je gegevens achter, we reageren zo snel mogelijk.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Naam"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
                required
              />
              <FaUser className="absolute top-3.5 left-4 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
                required
              />
              <FaEnvelope className="absolute top-3.5 left-4 text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="06 123 45 678"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
              />
              <FaPhone className="absolute top-3.5 left-4 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="text"
                name="company"
                placeholder="Bedrijfsnaam"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-black placeholder:text-gray-400"
              />
              <FaBuilding className="absolute top-3.5 left-4 text-gray-500" />
            </div>
          </div>

          <div>
            <textarea
              rows={4}
              name="message"
              placeholder="Je bericht..."
              className="w-full px-6 py-4 rounded-2xl bg-white text-black placeholder:text-gray-400 resize-none"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition"
            >
              Verstuur bericht
            </button>
          </div>
        </form>
      </main>

      <CallToAction />
      <Footer />
    </>
  );
};
