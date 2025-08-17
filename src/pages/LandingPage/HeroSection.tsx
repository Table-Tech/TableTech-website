import React, { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
// Image moved to public: /images/qr-codes/iyd.webp;
import { LaptopMockup } from "../../components/LaptopMockup";

// Lazy load demo components for better performance
const CustomerDemoOverlay = lazy(() => import("../../components/DemoOverlay"));
const EmployeeDemoOverlay = lazy(() => import("../../components/DemoOverlay-laptop"));

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
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
          Your browser does not support HTML5 video.
        </video>

        {/* Donkere overlay */}
        <div className="absolute inset-0 bg-[#3b2a1d]/60 z-0" />

        {/* Inhoud */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 3xl:px-40 pt-32 sm:pt-40 pb-16 sm:pb-20 text-white text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight sm:leading-snug drop-shadow-md text-center">
            {t('hero.title')}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto xl:text-xl leading-relaxed text-center">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4 sm:gap-6 lg:gap-8 max-w-8xl mx-auto">
            {/* Customer Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-7 lg:py-8 xl:py-10 rounded-2xl text-center shadow-2xl w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto hover:scale-105 transition-all duration-300 group border-2 border-white/30 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[500px] xl:min-h-[560px] 2xl:min-h-[600px]">
              <div className="flex-1 flex flex-col h-full">
                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 text-white">
                  {t('hero.customerDemo.title')}
                </h3>
                <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed flex-shrink-0">
                  {t('hero.customerDemo.description')}
                </p>
                
                {/* QR Code Component - Desktop Only */}
                <div className="hidden lg:flex mb-4 flex-1 flex-col justify-center items-center">
                  <div className="relative w-full max-w-sm xl:max-w-md 2xl:max-w-lg mx-auto transform scale-100 hover:scale-105 transition-transform duration-300">
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg border-2 border-white/40 p-6 xl:p-8" style={{backgroundColor: 'rgba(255, 255, 255, 0.15)'}}>
                      <div className="bg-white p-4 xl:p-5 rounded-xl mx-auto w-fit shadow-2xl">
                        <img 
                          src="/images/qr-codes/iyd.webp" 
                          alt="Scan QR code voor menu demo" 
                          className="w-32 h-32 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 mx-auto filter brightness-105 contrast-110"
                          loading="eager"
                        />
                      </div>
                      <div className="text-center mt-4 xl:mt-5">
                        <p className="text-white/95 text-sm xl:text-base font-medium">
                          {t('hero.customerDemo.qrInstruction')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 flex-shrink-0">
                <button
                  onClick={handleOpenCustomerDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white hover:from-yellow-800 hover:to-yellow-900 px-12 sm:px-14 lg:px-18 py-4 sm:py-5 h-[56px] sm:h-[60px] rounded-full text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 hover:scale-105 transform active:scale-95 shadow-xl hover:shadow-2xl hover:cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_6s_infinite] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center w-full max-w-[320px] lg:max-w-[360px] ring-2 ring-yellow-600/40 hover:ring-yellow-600/60 border-2 border-white/20"
                >
                {isPreloading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('loading')}
                  </span>
                ) : (
                  t('hero.customerDemo.button')
                )}
                </button>
              </div>
            </div>

            {/* Employee Demo Card */}
            <div className="bg-white/10 backdrop-blur-md px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-7 lg:py-8 xl:py-10 rounded-2xl text-center shadow-2xl w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto hover:scale-105 transition-all duration-300 group border-2 border-white/30 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[500px] xl:min-h-[560px] 2xl:min-h-[600px]">
              <div className="flex-1 flex flex-col h-full">
                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 text-white">
                  {t('hero.employeeDemo.title')}
                </h3>
                <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed flex-shrink-0">
                  {t('hero.employeeDemo.description')}
                </p>
                
                {/* Laptop Mockup - Desktop Only */}
                <div className="hidden lg:flex mb-4 flex-1 flex-col justify-center items-center">
                  <div className="w-full max-w-sm xl:max-w-md 2xl:max-w-lg mx-auto">
                    <LaptopMockup />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 flex-shrink-0">
                <button
                  onClick={handleOpenEmployeeDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white hover:from-yellow-800 hover:to-yellow-900 px-12 sm:px-14 lg:px-18 py-4 sm:py-5 h-[56px] sm:h-[60px] rounded-full text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 hover:scale-105 transform active:scale-95 shadow-xl hover:shadow-2xl hover:cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-[shimmer_6s_infinite] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center w-full max-w-[320px] lg:max-w-[360px] ring-2 ring-yellow-600/40 hover:ring-yellow-600/60 border-2 border-white/20"
                >
                {isPreloading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('loading')}
                  </span>
                ) : (
                  t('hero.employeeDemo.button')
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
              <span className="text-lg font-medium">{t('demoLoading')}</span>
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
              <span className="text-lg font-medium">{t('dashboardDemoLoading')}</span>
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