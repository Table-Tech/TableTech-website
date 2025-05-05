// src/components/HeroSection.tsx
import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-blue-50 via-white to-blue-50 pb-32 pt-24 px-4 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/30 backdrop-blur-md group transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
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
            <div className="max-w-xl text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                De nieuwe manier van bestellen in jouw restaurant
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
              </p>
            </div>

            {/* 🔄 Twee demo blokken in mockup-formaat */}
            <div className="relative w-full md:w-1/2 max-w-sm flex flex-col gap-6">
              <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur hover:scale-105 transition shadow-lg text-white text-center">
                <h3 className="text-lg font-semibold mb-2">Probeer als Klant</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Bekijk hoe gasten eenvoudig bestellen via QR.
                </p>
                <a
                  href="/demo/klant"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-white text-sm font-medium transition"
                >
                  Start demo
                </a>
              </div>
              <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur hover:scale-105 transition shadow-lg text-white text-center">
                <h3 className="text-lg font-semibold mb-2">Probeer als Werknemer</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Zie hoe het dashboard werkt voor personeel.
                </p>
                <a
                  href="/demo/werknemer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-white text-sm font-medium transition"
                >
                  Start demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fade & hint */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-blue-50 z-20 pointer-events-none" />
      <div className="mt-10 text-center text-blue-600 text-2xl animate-bounce z-30 relative">
        
      </div>
    </section>
  );
};
