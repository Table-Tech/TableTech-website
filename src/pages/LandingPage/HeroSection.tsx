import React from "react";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col justify-between overflow-hidden text-center snap-start bg-black"
    >
      {/* Achtergrondvideo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/background-2.webm" type="video/webm" />
        Je browser ondersteunt geen HTML5 video.
      </video>

      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/60 z-0" />

      {/* Inhoud */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 2xl:px-20 3xl:px-40 pt-40 pb-20 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl font-bold mb-6 leading-snug drop-shadow-md">
          De nieuwe manier van bestellen in jouw restaurant
        </h1>
        <p className="text-base sm:text-lg text-white/90 mb-10 max-w-3xl mx-auto 2xl:text-xl">
          Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition">
            <h3 className="text-base font-semibold mb-1">Probeer als Klant</h3>
            <p className="text-white/80 mb-3 text-sm">
              Bekijk hoe gasten eenvoudig bestellen via QR.
            </p>
            <Link
              to="/demo/klant"
              className="inline-block bg-white text-[#7b4f35] hover:bg-[#f5f0e6] px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Start demo
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition">
            <h3 className="text-base font-semibold mb-1">
              Probeer als Werknemer
            </h3>
            <p className="text-white/80 mb-3 text-sm">
              Zie hoe het dashboard werkt voor personeel.
            </p>
            <a
              href="/demo/werknemer"
              className="inline-block bg-white text-[#7b4f35] hover:bg-[#f5f0e6] px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Start demo
            </a>
          </div>
        </div>
      </div>

      {/* Fade effect onderaan (gefixed positionering) */}
      <div className="absolute bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-[#2f1d14] z-10" />
    </section>
  );
};
