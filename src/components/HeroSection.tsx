// src/components/HeroSection.tsx
import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-blue-50 via-white to-blue-50 pb-24 pt-16 px-2 overflow-hidden"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/30 backdrop-blur-md group transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
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

          <div className="absolute inset-0 bg-black/20 z-10" />

          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-6 gap-10">
            <div className="max-w-lg text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                De nieuwe manier van bestellen in jouw restaurant
              </h1>
              <p className="text-base text-white/80 mb-4">
                Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
              </p>
            </div>

            <div className="relative w-full md:w-1/2 max-w-xs flex flex-col gap-4">
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur hover:scale-105 transition shadow-lg text-white text-center">
                <h3 className="text-base font-semibold mb-1">Probeer als Klant</h3>
                <p className="text-white/80 mb-3 text-sm">
                  Bekijk hoe gasten eenvoudig bestellen via QR.
                </p>
                <a
                  href="/demo/klant"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white text-sm font-medium transition"
                >
                  Start demo
                </a>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur hover:scale-105 transition shadow-lg text-white text-center">
                <h3 className="text-base font-semibold mb-1">Probeer als Werknemer</h3>
                <p className="text-white/80 mb-3 text-sm">
                  Zie hoe het dashboard werkt voor personeel.
                </p>
                <a
                  href="/demo/werknemer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white text-sm font-medium transition"
                >
                  Start demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
