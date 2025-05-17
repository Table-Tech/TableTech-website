import React from "react";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-screen min-h-screen overflow-hidden text-center snap-start"
    >
      {/* Achtergrondvideo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/background-2.mp4" type="video/mp4" />
        Je browser ondersteunt geen HTML5 video.
      </video>

      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/60 z-0" />

      {/* Inhoud */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-40 pb-28 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug drop-shadow-md">
          De nieuwe manier van bestellen in jouw restaurant
        </h1>
        <p className="text-lg text-white/90 mb-10">
          Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-xs hover:scale-105 transition">
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
          <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-xs hover:scale-105 transition">
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

      {/* Smooth fade naar volgende sectie */}
      <div className="h-32 w-full bg-gradient-to-b from-transparent to-[#2f1d14] z-10 relative" />
    </section>
  );
};
