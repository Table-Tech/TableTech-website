import React, { useState } from "react";
import { CustomCursor } from "../../components/CustomCursor";
import { DemoOverlay as CustomerDemoOverlay } from "../../components/DemoOverlay";
import { DemoOverlay as EmployeeDemoOverlay } from "../../components/DemoOverlay-laptop";

export const HeroSection: React.FC = () => {
  const [isCustomerDemoOpen, setIsCustomerDemoOpen] = useState(false);
  const [isEmployeeDemoOpen, setIsEmployeeDemoOpen] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleOpenCustomerDemo = () => {
    setIsCustomerDemoOpen(true);
    setIsEmployeeDemoOpen(false);
    document.body.style.overflow = 'hidden';
  };

  const handleOpenEmployeeDemo = () => {
    setIsEmployeeDemoOpen(true);
    setIsCustomerDemoOpen(false);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseAllDemos = () => {
    setIsCustomerDemoOpen(false);
    setIsEmployeeDemoOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleSwitchToEmployee = () => {
    setIsCustomerDemoOpen(false);
    setIsEmployeeDemoOpen(true);
  };

  const handleSwitchToCustomer = () => {
    setIsEmployeeDemoOpen(false);
    setIsCustomerDemoOpen(true);
  };

  return (
    <>
      <section
        id="hero"
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
        className="relative w-full h-screen flex flex-col justify-between overflow-hidden text-center snap-start bg-black"
      >
        <CustomCursor hover={cursorHover} visible={cursorVisible} />
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
            {/* Customer Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition-all duration-300 group border border-white/20">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🍽️</div>
              <h3 className="text-base font-semibold mb-2">Probeer als Klant</h3>
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                Bekijk hoe gasten eenvoudig bestellen via QR-code.
              </p>
              <button
                onClick={handleOpenCustomerDemo}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                className="inline-block bg-white text-[#7b4f35] hover:bg-[#f5f0e6] px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform active:scale-95 shadow-lg hover:shadow-xl"
              >
                Start klant demo
              </button>
            </div>

            {/* Employee Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition-all duration-300 group border border-white/20">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">👨‍💼</div>
              <h3 className="text-base font-semibold mb-2">
                Probeer als Werknemer
              </h3>
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                Zie hoe het dashboard werkt voor personeel.
              </p>
              <button
                onClick={handleOpenEmployeeDemo}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                className="inline-block bg-white text-[#7b4f35] hover:bg-[#f5f0e6] px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform active:scale-95 shadow-lg hover:shadow-xl"
              >
                Start dashboard demo
              </button>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="text-sm font-semibold mb-1">Sneller</h4>
              <p className="text-xs text-white/70">Geen wachten op personeel</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="text-sm font-semibold mb-1">Veiliger</h4>
              <p className="text-xs text-white/70">Contactloos bestellen</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="text-sm font-semibold mb-1">Slimmer</h4>
              <p className="text-xs text-white/70">Real-time analytics</p>
            </div>
          </div>
        </div>

        {/* Fade effect onderaan */}
        <div className="absolute bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-[#2f1d14] z-10" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-2">Ontdek meer</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Customer Demo Overlay */}
      <CustomerDemoOverlay
        isOpen={isCustomerDemoOpen}
        onClose={handleCloseAllDemos}
        onSwitchToEmployee={handleSwitchToEmployee}
      />

      {/* Employee Demo Overlay */}
      <EmployeeDemoOverlay
        isOpen={isEmployeeDemoOpen}
        onClose={handleCloseAllDemos}
        onSwitchToCustomer={handleSwitchToCustomer}
      />
    </>
  );
};