import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Navbar } from "../components/Navbar";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
import { FaUser, FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";
import planten2 from "../assets/afbeeldingen/Planten.png";
import { useLenisScroll } from "../components/useLenisScroll";

export const ContactPage: React.FC = () => {
  useLenisScroll();

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    emailjs
      .sendForm("service_fye4t2s", "template_g0yqwdl", form.current, "WvojOqr0UVF9lHbU_")
      .then(() => {
        alert("Bericht verzonden!");
        form.current?.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("Er ging iets mis. Probeer het opnieuw.");
      });
  };

  return (
    <div className="bg-[#2C1E1A] text-[#F5F0EB] min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />

      {/* Hero afbeelding */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={planten2}
          alt="Contact Hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2C1E1A]/20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Neem contact op
          </h1>
        </div>
      </div>

      {/* Inhoud */}
      <main className="pt-12 sm:pt-16 flex-grow w-full">
        <section className="py-16 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64">
          <div className="w-full max-w-5xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vragen? Wij staan voor je klaar
            </h2>
            <p className="mb-4 max-w-xl mx-auto">
              Heb je vragen over sales of een samenwerking? Laat je gegevens achter en we nemen snel contact op.
            </p>
            <p className="max-w-xl mx-auto">
              Voor <strong>support</strong> kun je mailen naar{" "}
              <a
                href="mailto:info@tabletech.nl"
                className="text-[#FFD382] underline font-medium"
              >
                info@tabletech.nl
              </a>.
            </p>
          </div>

          <form
            ref={form}
            onSubmit={sendEmail}
            className="mt-6 w-full max-w-5xl mx-auto bg-white/70 text-[#2C1E1A] border border-[#E8D8CE] rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-6"
          >
            <h3 className="text-xl font-semibold text-center">Contactgegevens</h3>
            <p className="text-sm text-center mb-6">
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
                className="bg-[#A77B5D] hover:bg-[#916249] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition"
              >
                Verstuur bericht
              </button>
            </div>
          </form>
        </section>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
