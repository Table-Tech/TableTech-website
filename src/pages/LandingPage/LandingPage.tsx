// src/pages/OnePageLanding.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLenisScroll } from "../../components/useLenisScroll";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ScrollDots } from "../../components/ScrollDotss";
import { HorizontalScroll } from "../../components/HorizontalScroll";
import { DashboardPreview } from "../../pages/LandingPage/DashboardPreview";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OnePageLanding: React.FC = () => {
  useLenisScroll();

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <ScrollDots />
      
      {/* Hero Section met Video - Ultra Uitgezoomd */}
      <HeroSection />
      
      {/* Jouw Horizontale Scroll Sectie met Benefits, Benefits-2, Benefits-3 */}
      <section id="benefits" className="w-full">
        <HorizontalScroll />
      </section>
      
      {/* Dashboard Preview */}
      <DashboardPreview />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Final CTA */}
      <FinalCTASection />
      
      <Footer />
    </div>
  );
};

// Hero Section - Ultra uitgezoomd en veel groter
const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col justify-center overflow-hidden text-center bg-black"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background-2.webm" type="video/webm" />
        <source src="/videos/background-2.mp4" type="video/mp4" />
        Je browser ondersteunt geen HTML5 video.
      </video>

      {/* Dark Overlay - geen oranje */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 z-10" />

      {/* Content - Ultra Uitgezoomd */}
      <div className="relative z-20 w-full max-w-[140rem] mx-auto px-8 sm:px-16 lg:px-24 2xl:px-48 3xl:px-72 text-white">
        <h1 className="text-6xl sm:text-8xl md:text-9xl xl:text-[10rem] 3xl:text-[14rem] font-bold mb-16 leading-[0.85] drop-shadow-2xl animate-fade-in tracking-tight">
          De nieuwe manier van bestellen in jouw restaurant
        </h1>
        <p className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl text-white/90 mb-32 max-w-8xl mx-auto leading-relaxed drop-shadow-lg font-light">
          Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-20 mb-32">
          <div className="bg-white/15 backdrop-blur-xl px-20 py-20 rounded-3xl text-center shadow-2xl w-full max-w-3xl hover:scale-105 hover:bg-white/20 transition-all duration-500 border border-white/30 group">
            <h3 className="text-4xl font-bold mb-8 text-white group-hover:text-yellow-100 transition-colors">Probeer als Klant</h3>
            <p className="text-white/85 mb-12 text-2xl leading-relaxed">
              Bekijk hoe gasten eenvoudig bestellen via QR.
            </p>
            <Link
              to="/demo/klant"
              className="inline-block bg-white text-[#8B4513] hover:bg-yellow-100 hover:scale-105 px-16 py-8 rounded-2xl text-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start demo
            </Link>
          </div>
          <div className="bg-white/15 backdrop-blur-xl px-20 py-20 rounded-3xl text-center shadow-2xl w-full max-w-3xl hover:scale-105 hover:bg-white/20 transition-all duration-500 border border-white/30 group">
            <h3 className="text-4xl font-bold mb-8 text-white group-hover:text-yellow-100 transition-colors">Probeer als Werknemer</h3>
            <p className="text-white/85 mb-12 text-2xl leading-relaxed">
              Zie hoe het dashboard werkt voor personeel.
            </p>
            <a
              href="/demo/werknemer"
              className="inline-block bg-white text-[#8B4513] hover:bg-yellow-100 hover:scale-105 px-16 py-8 rounded-2xl text-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start demo
            </a>
          </div>
        </div>

        {/* Scroll indicator - veel groter */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-12 h-20 border-4 border-white/60 rounded-full flex justify-center">
            <div className="w-3 h-8 bg-white/60 rounded-full mt-5 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Smooth transition naar horizontale scroll */}
      <div className="absolute bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-[#8B4513] z-15" />
    </section>
  );
};

// Pricing Section - Ultra uitgezoomd
const PricingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full py-40 bg-gradient-to-br from-[#F5E6D3] via-white to-[#E8D5B7] min-h-screen flex items-center"
    >
      <div className="w-full px-12 sm:px-16 lg:px-24 2xl:px-40 3xl:px-56">
        <div className="max-w-[120rem] mx-auto">
          <div 
            className={`text-center mb-24 transform transition-all duration-1000 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-6xl md:text-8xl xl:text-9xl 3xl:text-[10rem] font-bold text-[#8B4513] mb-16 leading-tight">
              Simpele, transparante prijzen
            </h2>
            <p className="text-3xl xl:text-4xl 3xl:text-5xl text-[#8B4513]/80 max-w-6xl mx-auto leading-relaxed">
              Kies het plan dat bij jouw restaurant past. Altijd met 30 dagen gratis proberen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              {
                name: "Starter",
                price: "€29",
                period: "/maand",
                features: [
                  "Tot 5 tafels",
                  "Basis QR menu",
                  "Online bestellingen",
                  "Email support"
                ],
                popular: false
              },
              {
                name: "Professional",
                price: "€79",
                period: "/maand",
                features: [
                  "Tot 25 tafels",
                  "Geavanceerd dashboard",
                  "Voorraad management",
                  "Prioriteit support",
                  "Analytics & rapportage"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "€149",
                period: "/maand",
                features: [
                  "Onbeperkt tafels",
                  "Volledige integratie",
                  "Dedicated account manager",
                  "24/7 telefoon support",
                  "Custom features"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/95 backdrop-blur-lg border-3 rounded-3xl shadow-xl p-16 hover:scale-105 transition-all duration-500 transform ${
                  plan.popular 
                    ? "border-[#FF6B35] shadow-[#FF6B35]/20 scale-105" 
                    : "border-[#D2B48C] hover:border-[#FF6B35]/50"
                } ${
                  visible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#FF6B35] text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg">
                      Populair
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-bold text-[#8B4513] mb-8">
                    {plan.name}
                  </h3>
                  <div className="mb-8">
                    <span className="text-6xl font-bold text-[#FF6B35]">
                      {plan.price}
                    </span>
                    <span className="text-2xl text-[#8B4513]/70">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-8 mb-12">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-[#8B4513] text-xl">
                      <span className="text-[#FF6B35] mr-5 text-2xl">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-6 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#FF6B35] hover:bg-[#E55A2B] text-white shadow-lg hover:shadow-xl"
                      : "bg-[#F5E6D3] hover:bg-[#FF6B35] hover:text-white text-[#8B4513] border-3 border-[#D2B48C] hover:border-[#FF6B35]"
                  }`}
                >
                  Start gratis proefperiode
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Final CTA Section - Ultra uitgezoomd
const FinalCTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleStartTrial = (): void => {
    alert("Bedankt voor je interesse! We nemen binnenkort contact met je op voor je gratis proefperiode.");
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full py-40 bg-gradient-to-br from-[#8B4513] to-[#654321] overflow-hidden min-h-screen flex items-center"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/30 via-transparent to-[#FF6B35]/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #FF6B35 4px, transparent 4px),
                           radial-gradient(circle at 80% 80%, #FF6B35 4px, transparent 4px)`,
          backgroundSize: '140px 140px',
          animation: 'float 15s ease-in-out infinite reverse'
        }}></div>
      </div>

      <div className="relative z-10 w-full px-12 sm:px-16 lg:px-24 2xl:px-40 3xl:px-56">
        <div 
          className={`max-w-8xl mx-auto text-center transform transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <h2 className="text-6xl md:text-8xl xl:text-9xl 3xl:text-[10rem] font-bold text-white mb-20 leading-tight">
            Klaar om jouw restaurant te <span className="text-[#FF6B35]">digitaliseren</span>?
          </h2>
          
          <p className="text-3xl xl:text-4xl 3xl:text-5xl text-white/90 mb-24 max-w-6xl mx-auto leading-relaxed">
            Sluit je aan bij honderden restaurants die al kiezen voor TableTech. 
            Start vandaag nog met je 30 dagen gratis proefperiode.
          </p>

          <div className="flex flex-col sm:flex-row gap-12 justify-center items-center mb-24">
            <button 
              onClick={handleStartTrial}
              className="bg-[#FF6B35] hover:bg-[#E55A2B] hover:scale-105 hover:shadow-2xl transition-all duration-300 text-white px-18 py-8 rounded-2xl text-3xl font-bold shadow-xl group"
            >
              <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                Start gratis proefperiode
              </span>
            </button>
            
            <Link
              to="/demo/klant"
              className="border-4 border-white/40 hover:border-white hover:bg-white/10 text-white px-18 py-8 rounded-2xl text-3xl font-bold transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              Bekijk demo
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-16 text-white/80 text-2xl">
            <div className="flex items-center">
              <span className="text-[#FF6B35] mr-4 text-3xl">✓</span>
              <span>30 dagen gratis</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#FF6B35] mr-4 text-3xl">✓</span>
              <span>Geen opstartkosten</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#FF6B35] mr-4 text-3xl">✓</span>
              <span>Altijd opzegbaar</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#FF6B35] mr-4 text-3xl">✓</span>
              <span>Nederlandse support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnePageLanding;