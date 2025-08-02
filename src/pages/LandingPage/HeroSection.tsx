import React, { useState, lazy, Suspense } from "react";
import qrCodeImage from "../../assets/afbeeldingen/iyd.png";
import { LaptopMockup } from "../../components/LaptopMockup";

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

          <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
            {/* Customer Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 pl-8 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition-all duration-300 group border border-white/20 flex flex-col justify-between min-h-[250px] md:min-h-[280px] lg:min-h-[480px]">
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-semibold mb-2">Probeer als Klant</h3>
                <p className="text-white/80 mb-4 text-sm leading-relaxed">
                  Scan QR-code of start klant demo om te bekijken hoe gasten het ervaren.
                </p>
                
                {/* QR Code Component - Desktop Only */}
                <div className="hidden lg:flex mb-3 flex-1 flex-col justify-center">
                  <div className="text-center mb-4">
                    <p className="text-white/80 text-sm font-medium">Scan QR-code of</p>
                  </div>
                  <div className="relative w-full max-w-xs mx-auto transform scale-100 hover:scale-105 transition-transform duration-300">
                    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl backdrop-blur-lg border border-white/30 p-8" style={{backgroundColor: 'rgba(255, 255, 255, 0.15)'}}>
                      <div className="bg-white p-3 rounded-lg mx-auto w-fit shadow-2xl">
                        <img 
                          src={qrCodeImage} 
                          alt="Scan QR code voor menu demo" 
                          className="w-36 h-36 mx-auto filter brightness-105 contrast-110"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-white/90 text-xs font-medium">Scan the QR code or click the button below</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleOpenCustomerDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white hover:from-yellow-800 hover:to-yellow-900 px-10 py-3 h-[44px] rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 transform active:scale-95 shadow-xl hover:shadow-2xl hover:cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_6s_infinite] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px] ring-2 ring-yellow-400/20 hover:ring-yellow-400/40"
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
            </div>

            {/* Employee Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 pr-8 py-5 rounded-xl text-center shadow-lg w-full max-w-sm md:max-w-md 2xl:max-w-lg hover:scale-105 transition-all duration-300 group border border-white/20 flex flex-col justify-between min-h-[250px] md:min-h-[280px] lg:min-h-[480px]">
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-semibold mb-2">
                  Probeer als Werknemer
                </h3>
                <p className="text-white/80 mb-4 text-sm leading-relaxed">
                  Zie hoe het dashboard werkt voor personeel.
                </p>
                
                {/* Laptop Mockup - Desktop Only */}
                <div className="hidden lg:flex mb-3 flex-1 flex-col justify-center">
                  <LaptopMockup />
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleOpenEmployeeDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white hover:from-yellow-800 hover:to-yellow-900 px-10 py-3 h-[44px] rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 transform active:scale-95 shadow-xl hover:shadow-2xl hover:cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_6s_infinite] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px] ring-2 ring-yellow-400/20 hover:ring-yellow-400/40"
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