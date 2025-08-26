import React, { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
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
    await Promise.resolve(import("../../components/DemoOverlay"));
    setIsPreloading(false);
    
    setIsCustomerDemoOpen(true);
    setIsEmployeeDemoOpen(false);
    document.body.style.overflow = 'hidden';
  };

  const handleOpenEmployeeDemo = async () => {
    setIsPreloading(true);
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
        className="relative w-full min-h-screen flex flex-col overflow-hidden text-center snap-start bg-black"
      >
        {/* Background video */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:hidden"
            style={{
              backgroundImage: `url(/images/backgrounds/telefoon-fallback-achtergrond.webp)`,
              backgroundColor: '#3b2a1d',
              backgroundPosition: '90% center',
              zIndex: 0
            }}
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/backgrounds/telefoon-fallback-achtergrond.webp"
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{
              objectPosition: 'center center',
              backgroundColor: 'transparent',
              zIndex: 1
            }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              video.style.display = 'none';
            }}
          >
            <source src="/videos/background-2.webm" type="video/webm" />
            <source src="/videos/telefoon.webm" type="video/webm" />
            <source src="/videos/background-2.mp4" type="video/mp4" />
            <source src="/videos/telefoon.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark overlay - brown tint for all devices */}
        <div className="absolute inset-0 bg-amber-900/10 z-[2]" />
        
        {/* Main content - Proper spacing from navbar with responsive breakpoints */}
        <div className="relative z-10 w-full min-h-screen flex flex-col text-white">
          {/* Spacer for navbar - responsive heights */}
          <div className="h-20 xs:h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 2xl:h-44 flex-shrink-0"></div>
          
          {/* Content container - Flex grow to fill space and center vertically */}
          <div className="flex-1 flex flex-col justify-center px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 sm:py-10 md:py-12">
            {/* Inner content wrapper with max width */}
            <div className="w-full max-w-7xl mx-auto">
              {/* Title - Responsive sizing for all devices */}
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 
                           font-bold mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 
                           leading-tight drop-shadow-md text-center">
                {t('hero.title')}
              </h1>
              
              {/* Subtitle - Responsive for all screens */}
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 
                          text-white/90 mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 
                          max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl 
                          mx-auto leading-relaxed text-center px-2">
                {t('hero.subtitle')}
              </p>

              {/* Mobile Phones (up to 639px) - Centered vertically */}
              <div className="sm:hidden flex flex-col space-y-4 max-w-sm mx-auto w-full px-3">
              {/* Customer Demo Card - Mobile Groter */}
              <div className="bg-gradient-to-br from-stone-700/50 to-amber-800/50 backdrop-blur-lg 
                           p-5 xs:p-6 rounded-xl text-center shadow-xl border border-stone-600/50 
                           min-h-[200px] xs:min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-br from-stone-600 to-stone-700 p-3 xs:p-3.5 rounded-xl shadow-md">
                      <svg className="w-6 h-6 xs:w-7 xs:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-base xs:text-lg font-bold mb-2 xs:mb-2.5 text-white drop-shadow-lg">
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 text-sm xs:text-base mb-4 xs:mb-5 leading-relaxed px-2">
                    {t('hero.customerDemo.description')}
                  </p>
                </div>
                <button
                  onClick={handleOpenCustomerDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white 
                           hover:from-amber-700 hover:to-amber-800 px-6 xs:px-8 py-3 xs:py-3.5 
                           rounded-full text-sm xs:text-base font-semibold transition-all 
                           duration-300 hover:scale-105 shadow-lg w-full border border-amber-500/30 
                           active:scale-95 min-h-[44px] xs:min-h-[48px]"
                >
                  {isPreloading ? t('loading') : t('hero.customerDemo.button')}
                </button>
              </div>

              {/* Employee Demo Card - Mobile Groter */}
              <div className="bg-gradient-to-br from-stone-800/50 to-amber-800/50 backdrop-blur-lg 
                           p-5 xs:p-6 rounded-xl text-center shadow-xl border border-stone-700/50 
                           min-h-[200px] xs:min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-br from-stone-700 to-stone-800 p-3 xs:p-3.5 rounded-xl shadow-md">
                      <svg className="w-6 h-6 xs:w-7 xs:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM8 20h8" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-base xs:text-lg font-bold mb-2 xs:mb-2.5 text-white drop-shadow-lg">
                    {t('hero.employeeDemo.title')}
                  </h3>
                  <p className="text-white/90 text-sm xs:text-base mb-4 xs:mb-5 leading-relaxed px-2">
                    {t('hero.employeeDemo.description')}
                  </p>
                </div>
                <button
                  onClick={handleOpenEmployeeDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white 
                           hover:from-amber-700 hover:to-amber-800 px-6 xs:px-8 py-3 xs:py-3.5 
                           rounded-full text-sm xs:text-base font-semibold transition-all 
                           duration-300 hover:scale-105 shadow-lg w-full border border-amber-500/30 
                           active:scale-95 min-h-[44px] xs:min-h-[48px]"
                >
                  {isPreloading ? t('loading') : t('hero.employeeDemo.button')}
                </button>
              </div>
              </div>

              {/* Small Tablets (640px to 767px) - Gelijk aan desktop maar kleiner */}
              <div className="hidden sm:grid md:hidden grid-cols-2 gap-3 max-w-3xl mx-auto">
              {/* Customer Demo Card - Small Tablet met QR */}
              <div className="bg-white/10 backdrop-blur-md 
                           p-4 rounded-xl text-center shadow-xl border-2 border-white/30 
                           min-h-[320px] flex flex-col justify-between hover:scale-105 transition-all duration-300">
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-base font-bold mb-2 text-white">
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 text-xs mb-3 leading-relaxed">
                    {t('hero.customerDemo.description')}
                  </p>
                  
                  {/* QR Code voor kleine tablets */}
                  <div className="flex mb-3 flex-1 flex-col justify-center items-center">
                    <div className="relative w-full max-w-[140px] mx-auto transform hover:scale-105 transition-transform duration-300">
                      <div className="relative w-full rounded-lg overflow-hidden shadow-lg backdrop-blur-lg border border-white/40 p-2" 
                           style={{backgroundColor: 'rgba(255, 255, 255, 0.15)'}}>
                        <div className="bg-white p-2 rounded-md mx-auto w-fit shadow-lg">
                          <img 
                            src="/images/qr-codes/iyd.webp" 
                            alt="Scan QR code voor menu demo" 
                            className="w-16 h-16 mx-auto"
                            loading="eager"
                          />
                        </div>
                        <div className="text-center mt-1">
                          <p className="text-white/95 text-[10px] font-medium">
                            {t('hero.customerDemo.qrInstruction')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleOpenCustomerDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                           hover:from-yellow-800 hover:to-yellow-900 px-5 py-2.5 
                           rounded-full text-sm font-bold transition-all duration-300 
                           hover:scale-105 shadow-lg w-full border border-white/20 
                           active:scale-95 min-h-[40px]"
                >
                  {isPreloading ? t('loading') : t('hero.customerDemo.button')}
                </button>
              </div>

              {/* Employee Demo Card - Small Tablet met Laptop */}
              <div className="bg-white/10 backdrop-blur-md 
                           p-4 rounded-xl text-center shadow-xl border-2 border-white/30 
                           min-h-[320px] flex flex-col justify-between hover:scale-105 transition-all duration-300">
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-base font-bold mb-2 text-white">
                    {t('hero.employeeDemo.title')}
                  </h3>
                  <p className="text-white/90 text-xs mb-3 leading-relaxed">
                    {t('hero.employeeDemo.description')}
                  </p>
                  
                  {/* Laptop Mockup voor kleine tablets */}
                  <div className="flex mb-3 flex-1 flex-col justify-center items-center">
                    <div className="w-full max-w-[140px] mx-auto scale-60">
                      <LaptopMockup />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleOpenEmployeeDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                           hover:from-yellow-800 hover:to-yellow-900 px-5 py-2.5 
                           rounded-full text-sm font-bold transition-all duration-300 
                           hover:scale-105 shadow-lg w-full border border-white/20 
                           active:scale-95 min-h-[40px]"
                >
                  {isPreloading ? t('loading') : t('hero.employeeDemo.button')}
                </button>
              </div>
              </div>

              {/* Medium iPads & Tablets (768px to 1023px) - Gelijk aan desktop maar compacter */}
              <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 max-w-4xl mx-auto">
              {/* Customer Demo Card - Medium Tablet/iPad met QR */}
              <div className="bg-white/10 backdrop-blur-md 
                           p-5 rounded-2xl text-center shadow-xl border-2 border-white/30 
                           min-h-[360px] flex flex-col justify-between hover:scale-105 transition-all duration-300">
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-lg font-bold mb-3 text-white">
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    {t('hero.customerDemo.description')}
                  </p>
                  
                  {/* QR Code voor tablets */}
                  <div className="flex mb-4 flex-1 flex-col justify-center items-center">
                    <div className="relative w-full max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300">
                      <div className="relative w-full rounded-xl overflow-hidden shadow-xl backdrop-blur-lg border-2 border-white/40 p-3" 
                           style={{backgroundColor: 'rgba(255, 255, 255, 0.15)'}}>
                        <div className="bg-white p-3 rounded-lg mx-auto w-fit shadow-xl">
                          <img 
                            src="/images/qr-codes/iyd.webp" 
                            alt="Scan QR code voor menu demo" 
                            className="w-20 h-20 mx-auto"
                            loading="eager"
                          />
                        </div>
                        <div className="text-center mt-2">
                          <p className="text-white/95 text-xs font-medium">
                            {t('hero.customerDemo.qrInstruction')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleOpenCustomerDemo}
                    type="button"
                    disabled={isPreloading}
                    className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                             hover:from-yellow-800 hover:to-yellow-900 px-6 py-3 
                             rounded-full text-sm font-bold transition-all duration-300 
                             hover:scale-105 shadow-lg w-full border border-white/20 
                             active:scale-95 min-h-[44px]"
                  >
                    {isPreloading ? t('loading') : t('hero.customerDemo.button')}
                  </button>
                </div>
              </div>

              {/* Employee Demo Card - Medium Tablet/iPad met Laptop */}
              <div className="bg-white/10 backdrop-blur-md 
                           p-5 rounded-2xl text-center shadow-xl border-2 border-white/30 
                           min-h-[360px] flex flex-col justify-between hover:scale-105 transition-all duration-300">
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-lg font-bold mb-3 text-white">
                    {t('hero.employeeDemo.title')}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    {t('hero.employeeDemo.description')}
                  </p>
                  
                  {/* Laptop Mockup voor tablets */}
                  <div className="flex mb-4 flex-1 flex-col justify-center items-center">
                    <div className="w-full max-w-xs mx-auto scale-75">
                      <LaptopMockup />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleOpenEmployeeDemo}
                    type="button"
                    disabled={isPreloading}
                    className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                             hover:from-yellow-800 hover:to-yellow-900 px-6 py-3 
                             rounded-full text-sm font-bold transition-all duration-300 
                             hover:scale-105 shadow-lg w-full border border-white/20 
                             active:scale-95 min-h-[44px]"
                  >
                    {isPreloading ? t('loading') : t('hero.employeeDemo.button')}
                  </button>
                </div>
              </div>
              </div>

              {/* Desktop (1024px and up) - Centered vertically with larger cards */}
              <div className="hidden lg:flex flex-row justify-center items-stretch gap-8 xl:gap-10 2xl:gap-12 mx-auto">
              {/* Customer Demo Card - Desktop Iets groter */}
              <div className="bg-white/10 backdrop-blur-md 
                           px-7 lg:px-9 xl:px-11 2xl:px-13 
                           py-7 lg:py-9 xl:py-11 2xl:py-13 
                           rounded-2xl lg:rounded-3xl text-center shadow-2xl 
                           w-full max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-2xl 
                           hover:scale-105 transition-all duration-300 group 
                           border-2 border-white/30 flex flex-col justify-between 
                           min-h-[430px] lg:min-h-[470px] xl:min-h-[510px] 2xl:min-h-[550px]">
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-4 lg:mb-5 text-white">
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 mb-5 lg:mb-6 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed">
                    {t('hero.customerDemo.description')}
                  </p>
                  
                  {/* QR Code - Iets groter */}
                  <div className="hidden lg:flex mb-6 flex-1 flex-col justify-center items-center">
                    <div className="relative w-full max-w-sm lg:max-w-md xl:max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                      <div className="relative w-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-lg border-2 border-white/40 p-4 lg:p-5 xl:p-6" 
                           style={{backgroundColor: 'rgba(255, 255, 255, 0.15)'}}>
                        <div className="bg-white p-4 lg:p-5 xl:p-6 rounded-xl mx-auto w-fit shadow-2xl">
                          <img 
                            src="/images/qr-codes/iyd.webp" 
                            alt="Scan QR code voor menu demo" 
                            className="w-28 h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 mx-auto"
                            loading="eager"
                          />
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-white/95 text-base lg:text-lg xl:text-xl font-medium">
                            {t('hero.customerDemo.qrInstruction')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleOpenCustomerDemo}
                    type="button"
                    disabled={isPreloading}
                    className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                             hover:from-yellow-800 hover:to-yellow-900 
                             px-12 lg:px-14 xl:px-16 
                             py-4 lg:py-5 
                             h-[56px] lg:h-[60px] xl:h-[64px] 
                             rounded-full text-lg lg:text-xl xl:text-2xl font-bold 
                             transition-all duration-300 hover:scale-105 transform active:scale-95 
                             shadow-xl hover:shadow-2xl 
                             w-full max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] 
                             ring-2 ring-yellow-600/40 hover:ring-yellow-600/60 
                             border-2 border-white/20"
                  >
                    {isPreloading ? t('loading') : t('hero.customerDemo.button')}
                  </button>
                </div>
              </div>

              {/* Employee Demo Card - Desktop Iets groter */}
              <div className="bg-white/10 backdrop-blur-md 
                           px-7 lg:px-9 xl:px-11 2xl:px-13 
                           py-7 lg:py-9 xl:py-11 2xl:py-13 
                           rounded-2xl lg:rounded-3xl text-center shadow-2xl 
                           w-full max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-2xl 
                           hover:scale-105 transition-all duration-300 group 
                           border-2 border-white/30 flex flex-col justify-between 
                           min-h-[430px] lg:min-h-[470px] xl:min-h-[510px] 2xl:min-h-[550px]">
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-4 lg:mb-5 text-white">
                    {t('hero.employeeDemo.title')}
                  </h3>
                  <p className="text-white/90 mb-5 lg:mb-6 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed">
                    {t('hero.employeeDemo.description')}
                  </p>
                  
                  {/* Laptop Mockup - Iets groter */}
                  <div className="hidden lg:flex mb-6 flex-1 flex-col justify-center items-center">
                    <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg mx-auto scale-90 lg:scale-105 xl:scale-120">
                      <LaptopMockup />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleOpenEmployeeDemo}
                    type="button"
                    disabled={isPreloading}
                    className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                             hover:from-yellow-800 hover:to-yellow-900 
                             px-12 lg:px-14 xl:px-16 
                             py-4 lg:py-5 
                             h-[56px] lg:h-[60px] xl:h-[64px] 
                             rounded-full text-lg lg:text-xl xl:text-2xl font-bold 
                             transition-all duration-300 hover:scale-105 transform active:scale-95 
                             shadow-xl hover:shadow-2xl 
                             w-full max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] 
                             ring-2 ring-yellow-600/40 hover:ring-yellow-600/60 
                             border-2 border-white/20"
                  >
                    {isPreloading ? t('loading') : t('hero.employeeDemo.button')}
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
          
          {/* Bottom spacing - Smaller to avoid too much empty space */}
          <div className="h-4 sm:h-6 md:h-8 lg:h-10 xl:h-12 flex-shrink-0"></div>
        </div>
        
        {/* Fade effect at bottom */}
        <div className="absolute bottom-0 h-16 w-full bg-gradient-to-b from-transparent to-[#2f1d14] z-5" />

        {/* Scroll indicator - Hidden on very small screens */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Demo Overlays */}
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