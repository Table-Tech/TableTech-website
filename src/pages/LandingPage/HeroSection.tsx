import React, { useState, lazy, Suspense } from "react";

// Lazy load demo components for better performance
const CustomerDemoOverlay = lazy(() => import("../../components/DemoOverlay").then(module => ({ default: module.DemoOverlay })));
const EmployeeDemoOverlay = lazy(() => import("../../components/DemoOverlay-laptop").then(module => ({ default: module.DemoOverlay })));

export const HeroSection: React.FC = () => {
  const [isCustomerDemoOpen, setIsCustomerDemoOpen] = useState(false);
  const [isEmployeeDemoOpen, setIsEmployeeDemoOpen] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleOpenCustomerDemo = async () => {
    setIsPreloading(true);
    // Faster preload with Promise.resolve for immediate loading
    await Promise.resolve(import("../../components/DemoOverlay"));
    setIsPreloading(false);
    
    setIsCustomerDemoOpen(true);
    setIsEmployeeDemoOpen(false);
    document.body.style.overflow = 'hidden';
  };

  const handleOpenEmployeeDemo = async () => {
    setIsPreloading(true);
    // Faster preload with Promise.resolve for immediate loading
    await Promise.resolve(import("../../components/DemoOverlay-laptop"));
    setIsPreloading(false);
    
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
        className="relative w-full h-screen flex flex-col justify-between overflow-hidden text-center snap-start bg-black"
      >
        {/* Achtergrondvideo */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
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
            De toekomst van bestellen.
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-10 max-w-3xl mx-auto 2xl:text-xl">
            Laat gasten bestellen & betalen via QR – sneller, veiliger, slimmer.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            {/* Customer Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition-all duration-300 group border border-white/20">
              <h3 className="text-base font-semibold mb-2">Probeer als Klant</h3>
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                Bekijk hoe gasten eenvoudig bestellen via QR-code.
              </p>
              <button
                onClick={handleOpenCustomerDemo}
                type="button"
                disabled={isPreloading}
                className="inline-block bg-gradient-to-r from-yellow-700 to-yellow-800 text-white hover:from-yellow-800 hover:to-yellow-900 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform active:scale-95 shadow-lg hover:shadow-xl hover:cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_6s_infinite] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPreloading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Laden...
                  </span>
                ) : (
                  "Start klant demo"
                )}
              </button>
            </div>

            {/* Employee Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition-all duration-300 group border border-white/20">
              <h3 className="text-base font-semibold mb-2">
                Probeer als Werknemer
              </h3>
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                Zie hoe het dashboard werkt voor personeel.
              </p>
              <button
                onClick={handleOpenEmployeeDemo}
                type="button"
                disabled={isPreloading}
                className="inline-block bg-gradient-to-r from-yellow-700 to-yellow-800 text-white hover:from-yellow-800 hover:to-yellow-900 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 transform active:scale-95 shadow-lg hover:shadow-xl hover:cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_6s_infinite] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPreloading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Laden...
                  </span>
                ) : (
                  "Start dashboard demo"
                )}
              </button>
            </div>
          </div>

          </div>
        
        {/* Fade effect onderaan */}
        <div className="absolute bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-[#2f1d14] z-10" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Customer Demo Overlay with Loading */}
      <Suspense fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Demo laden...</span>
            </div>
          </div>
        </div>
      }>
        <CustomerDemoOverlay
          isOpen={isCustomerDemoOpen}
          onClose={handleCloseAllDemos}
          onSwitchToEmployee={handleSwitchToEmployee}
        />
      </Suspense>

      {/* Employee Demo Overlay with Loading */}
      <Suspense fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Dashboard demo laden...</span>
            </div>
          </div>
        </div>
      }>
        <EmployeeDemoOverlay
          isOpen={isEmployeeDemoOpen}
          onClose={handleCloseAllDemos}
          onSwitchToCustomer={handleSwitchToCustomer}
        />
      </Suspense>
    </>
  );
};