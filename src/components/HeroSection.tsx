// src/components/HeroSection.tsx
import React, { useEffect, useState } from "react";
import mock1 from "../assets/hero-mockup-1.png";
import mock2 from "../assets/hero-mockup-2.png";
import mock3 from "../assets/hero-mockup-3.png";

const images = [mock1, mock2, mock3];

export const HeroSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-blue-50 pb-40 pt-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/30 backdrop-blur-md">
          {/* 🎞️ Videoachtergrond */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 brightness-75"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            Je browser ondersteunt geen video.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 z-10" />

          {/* Content */}
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-10 gap-12">
            {/* Tekst */}
            <div className="max-w-xl text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                De nieuwe manier van bestellen in jouw restaurant
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
              </p>
              <a
                href="#cta"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
              >
                Vraag een demo aan
              </a>
            </div>

            {/* Slideshow met hover-effect */}
            <div className="relative w-full md:w-1/2 max-w-sm transform-gpu perspective-[1500px] transition-all duration-500 ease-in-out hover:scale-105 hover:rotate-1">
              <img
                src={images[(index + 1) % images.length]}
                alt="Volgende afbeelding"
                className="absolute top-8 left-8 w-full rounded-xl opacity-30 scale-[0.9] blur-sm shadow-xl transform rotate-y-[18deg] -rotate-x-2 transition-all duration-700 z-0"
              />
              <img
                src={images[index]}
                alt={`Mockup ${index + 1}`}
                className="relative z-10 rounded-xl shadow-2xl transform-gpu transition-transform duration-700 ease-in-out scale-[1]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fade naar volgende sectie */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-blue-50 z-20 pointer-events-none" />

      {/* Scroll hint */}
      <div className="mt-10 text-center text-blue-600 text-2xl animate-bounce z-30 relative">
        ↓
      </div>
    </section>
  );
};
