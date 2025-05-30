// src/components/CallToAction.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const CallToAction: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleStartTrial = () => {
    // Hier kun je later een echte signup flow implementeren
    alert("Bedankt voor je interesse! We nemen binnenkort contact met je op voor je gratis proefperiode.");
  };

  return (
    <section id="cta" className="relative bg-[#2C1E1A] text-white py-20 px-4 w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E86C28] via-transparent to-[#E86C28]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #E86C28 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #E86C28 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 flex justify-center">
        <div
          ref={ref}
          className={`bg-[#3A2B24]/80 backdrop-blur-lg border border-[#4A372E]/50 rounded-3xl shadow-2xl p-12 transform transition-all duration-1000 ease-out w-full max-w-5xl text-center ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-[#FFD382] bg-clip-text text-transparent">
              Klaar om jouw restaurant te revolutioneren?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Sluit je aan bij tientallen restaurants die al kiezen voor TableTech. 
              Verhoog je omzet, verminder werkdruk en verbeter de klantervaring.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button
              onClick={handleStartTrial}
              className="group relative bg-[#E86C28] hover:bg-[#C3561D] hover:scale-105 hover:shadow-2xl transition-all duration-300 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl overflow-hidden"
            >
              <span className="relative z-10">Start gratis proefperiode</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#E86C28] to-[#C3561D] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            
            <Link
              to="/demo/klant"
              className="group border-2 border-white/30 hover:border-white hover:bg-white/10 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              <span className="group-hover:scale-105 transition-transform duration-300 inline-block">
                Bekijk demo
              </span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#E86C28] rounded-full mr-2 animate-pulse"></div>
              <span>30 dagen gratis proberen</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#E86C28] rounded-full mr-2 animate-pulse"></div>
              <span>Geen opstartkosten</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#E86C28] rounded-full mr-2 animate-pulse"></div>
              <span>Altijd opzegbaar</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#E86C28] rounded-full mr-2 animate-pulse"></div>
              <span>Nederlandse support</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/70 text-sm mb-2">
              Vragen? Bel ons direct op{" "}
              <a 
                href="tel:+31853030723" 
                className="text-[#E86C28] hover:text-[#FFD382] font-semibold transition-colors"
              >
                +31 85 303 07 23
              </a>
            </p>
            <p className="text-white/70 text-sm">
              Of mail naar{" "}
              <a 
                href="mailto:info@tabletech.nl" 
                className="text-[#E86C28] hover:text-[#FFD382] font-semibold transition-colors"
              >
                info@tabletech.nl
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};