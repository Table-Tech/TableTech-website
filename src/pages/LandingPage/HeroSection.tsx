import React, { useState, lazy, Suspense, useCallback } from "react";
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

  const handleOpenCustomerDemo = useCallback(async () => {
    setIsPreloading(true);
    await Promise.resolve(import("../../components/DemoOverlay"));
    setIsPreloading(false);

    setIsCustomerDemoOpen(true);
    setIsEmployeeDemoOpen(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleOpenEmployeeDemo = useCallback(async () => {
    setIsPreloading(true);
    await Promise.resolve(import("../../components/DemoOverlay-laptop"));
    setIsPreloading(false);

    setIsEmployeeDemoOpen(true);
    setIsCustomerDemoOpen(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseAllDemos = useCallback(() => {
    setIsCustomerDemoOpen(false);
    setIsEmployeeDemoOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const handleSwitchToEmployee = useCallback(() => {
    setIsCustomerDemoOpen(false);
    setIsEmployeeDemoOpen(true);
  }, []);

  const handleSwitchToCustomer = useCallback(() => {
    setIsEmployeeDemoOpen(false);
    setIsCustomerDemoOpen(true);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative w-full min-h-screen flex flex-col overflow-hidden text-center snap-start bg-black"
      >
        {/* Background video */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:hidden hero-mobile-background"
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/backgrounds/telefoon-fallback-achtergrond.webp"
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 hero-video-positioning"
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              video.className += ' hero-video-error-hidden';
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
          
          {/* Content container - Responsive vertical positioning */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 md:py-20 lg:justify-start lg:pt-8 hero-content-container">
            {/* Inner content wrapper with max width */}
            <div className="w-full max-w-7xl mx-auto">
              {/* Title - Scaled down */}
              <h1 className="font-bold leading-tight drop-shadow-md text-center text-white hero-title-responsive">
                {t('hero.title')}
              </h1>
              
              {/* Subtitle - Closer to title */}
              <p className="text-white/90 leading-relaxed text-center mx-auto px-6 hero-subtitle-responsive">
                {t('hero.subtitle')}
              </p>

              {/* Mobile Layout - More spaced out */}
              <div className="sm:hidden flex flex-col w-full px-6 hero-mobile-layout">
              {/* Customer Demo Card - Scaled down */}
              <div className="bg-gradient-to-br from-stone-700/50 to-amber-800/50 backdrop-blur-lg 
                           text-center shadow-xl border border-stone-600/50 rounded-xl flex flex-col justify-between hero-card-mobile">
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-br from-stone-600 to-stone-700 p-3 xs:p-3.5 rounded-xl shadow-md">
                      <svg className="w-6 h-6 xs:w-7 xs:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-white drop-shadow-lg"
                      style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 leading-relaxed"
                     style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    {t('hero.customerDemo.description')}
                  </p>
                </div>
                <button
                  onClick={handleOpenCustomerDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white 
                           hover:from-amber-700 hover:to-amber-800 rounded-full font-semibold transition-all 
                           duration-300 hover:scale-105 shadow-lg w-full border border-amber-500/30 
                           active:scale-95"
                  style={{
                    padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 6vw, 2rem)',
                    fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                    minHeight: 'clamp(40px, 6vh, 48px)'
                  }}
                >
                  {isPreloading ? t('loading') : t('hero.customerDemo.button')}
                </button>
              </div>

              {/* Employee Demo Card - Mobile Responsive */}
              <div className="bg-gradient-to-br from-stone-800/50 to-amber-800/50 backdrop-blur-lg 
                           text-center shadow-xl border border-stone-700/50 rounded-xl flex flex-col justify-between"
                   style={{
                     padding: 'clamp(1rem, 4vw, 1.5rem)',
                     minHeight: 'clamp(140px, 20vh, 200px)'
                   }}>
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-br from-stone-700 to-stone-800 p-3 xs:p-3.5 rounded-xl shadow-md">
                      <svg className="w-6 h-6 xs:w-7 xs:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM8 20h8" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-white drop-shadow-lg"
                      style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                    {t('hero.employeeDemo.title')}
                  </h3>
                  <p className="text-white/90 leading-relaxed"
                     style={{ fontSize: 'clamp(0.75rem, 3vw, 0.9rem)', marginBottom: 'clamp(1rem, 3vw, 1.25rem)' }}>
                    {t('hero.employeeDemo.description')}
                  </p>
                </div>
                <button
                  onClick={handleOpenEmployeeDemo}
                  type="button"
                  disabled={isPreloading}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white 
                           hover:from-amber-700 hover:to-amber-800 rounded-full font-semibold transition-all 
                           duration-300 hover:scale-105 shadow-lg w-full border border-amber-500/30 
                           active:scale-95"
                  style={{
                    padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 6vw, 2rem)',
                    fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                    minHeight: 'clamp(40px, 6vh, 48px)'
                  }}
                >
                  {isPreloading ? t('loading') : t('hero.employeeDemo.button')}
                </button>
              </div>
              </div>

              {/* Small Tablet Layout - More breathing room */}
              <div className="hidden sm:grid md:hidden grid-cols-2 mx-auto"
                   style={{
                     gap: 'clamp(1.5rem, 4vw, 3rem)',
                     maxWidth: 'min(85vw, 700px)'
                   }}>
              {/* Customer Demo Card - Scaled down */}
              <div className="bg-white/10 backdrop-blur-md text-center shadow-xl border-2 border-white/30 
                           rounded-xl flex flex-col justify-between hover:scale-105 transition-all duration-300"
                   style={{
                     padding: 'clamp(1.5rem, 4vw, 2rem)',
                     minHeight: 'clamp(240px, 28vh, 280px)'
                   }}>
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="font-bold text-white"
                      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 leading-relaxed"
                     style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    {t('hero.customerDemo.description')}
                  </p>
                  
                  {/* QR Code - Responsive */}
                  <div className="flex flex-1 flex-col justify-center items-center"
                       style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <div className="relative transform hover:scale-105 transition-transform duration-300"
                         style={{ maxWidth: 'clamp(120px, 15vw, 160px)' }}>
                      <div className="relative rounded-lg overflow-hidden shadow-lg backdrop-blur-lg border border-white/40 hero-qr-background qr-container-padding">
                        <div className="bg-white rounded-md mx-auto w-fit shadow-lg qr-inner-padding">
                          <img 
                            src="/images/qr-codes/iyd.webp" 
                            alt="Scan QR code voor menu demo" 
                            loading="eager"
                            className="qr-image-responsive"
                          />
                        </div>
                        <div className="text-center qr-text-margin">
                          <p className="text-white/95 font-medium"
                             style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
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
                           hover:from-yellow-800 hover:to-yellow-900 rounded-full font-bold transition-all duration-300 
                           hover:scale-105 shadow-lg w-full border border-white/20 active:scale-95"
                  style={{
                    padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.2rem, 4vw, 1.5rem)',
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    minHeight: 'clamp(36px, 5vh, 44px)'
                  }}
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

              {/* Medium iPads & Tablets (768px to 1023px) - Normal positioning */}
              <div 
                className="hidden md:grid lg:hidden grid-cols-2 gap-4 max-w-4xl mx-auto"
                style={{
                  marginTop: 'clamp(1rem, 3vh, 2rem)' // Normal spacing after title/subtitle
                }}
              >
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
                    <div className="w-full max-w-sm mx-auto scale-100">
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

              {/* Desktop Layout - More spaced out */}
              <div className="hidden lg:flex flex-row justify-center items-stretch mx-auto"
                   style={{
                     gap: 'clamp(2rem, 5vw, 4rem)',
                     maxWidth: 'min(85vw, 1000px)'
                   }}>
              {/* Customer Demo Card - Desktop Scaled */}
              <div className="bg-white/10 backdrop-blur-md text-center shadow-2xl 
                           border-2 border-white/30 flex flex-col justify-between 
                           hover:scale-105 transition-all duration-300 group"
                   style={{
                     padding: 'clamp(2rem, 4vw, 2.5rem)',
                     borderRadius: 'clamp(1rem, 2vw, 1.5rem)',
                     width: '100%',
                     maxWidth: 'clamp(280px, 35vw, 400px)',
                     minHeight: 'clamp(280px, 32vh, 350px)'
                   }}>
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="font-bold text-white"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    {t('hero.customerDemo.title')}
                  </h3>
                  <p className="text-white/90 leading-relaxed"
                     style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    {t('hero.customerDemo.description')}
                  </p>
                  
                  {/* QR Code - Desktop Responsive */}
                  <div className="hidden lg:flex flex-1 flex-col justify-center items-center"
                       style={{ marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    <div className="relative transform hover:scale-105 transition-transform duration-300"
                         style={{ maxWidth: 'clamp(180px, 20vw, 240px)' }}>
                      <div className="relative overflow-hidden shadow-2xl backdrop-blur-lg border-2 border-white/40" 
                           style={{
                             backgroundColor: 'rgba(255, 255, 255, 0.15)',
                             borderRadius: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                             padding: 'clamp(0.75rem, 2vw, 1rem)'
                           }}>
                        <div className="bg-white rounded-lg mx-auto w-fit shadow-2xl"
                             style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                          <img 
                            src="/images/qr-codes/iyd.webp" 
                            alt="Scan QR code voor menu demo" 
                            loading="eager"
                            style={{
                              width: 'clamp(80px, 10vw, 120px)',
                              height: 'clamp(80px, 10vw, 120px)'
                            }}
                          />
                        </div>
                        <div className="text-center"
                             style={{ marginTop: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                          <p className="text-white/95 font-medium"
                             style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
                            {t('hero.customerDemo.qrInstruction')}
                          </p>
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
                    className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                             hover:from-yellow-800 hover:to-yellow-900 rounded-full font-bold 
                             transition-all duration-300 hover:scale-105 transform active:scale-95 
                             shadow-xl hover:shadow-2xl w-full
                             ring-2 ring-yellow-600/40 hover:ring-yellow-600/60 
                             border-2 border-white/20"
                    style={{
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(2rem, 5vw, 3rem)',
                      fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                      minHeight: 'clamp(44px, 6vh, 56px)',
                      maxWidth: 'clamp(280px, 30vw, 360px)'
                    }}
                  >
                    {isPreloading ? t('loading') : t('hero.customerDemo.button')}
                  </button>
                </div>
              </div>

              {/* Employee Demo Card - Desktop Responsive */}
              <div className="bg-white/10 backdrop-blur-md text-center shadow-2xl 
                           border-2 border-white/30 flex flex-col justify-between 
                           hover:scale-105 transition-all duration-300 group"
                   style={{
                     padding: 'clamp(1.25rem, 3vw, 2rem)',
                     borderRadius: 'clamp(1rem, 2vw, 1.5rem)',
                     width: '100%',
                     maxWidth: 'clamp(300px, 40vw, 500px)',
                     minHeight: 'clamp(320px, 40vh, 450px)'
                   }}>
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="font-bold text-white"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    {t('hero.employeeDemo.title')}
                  </h3>
                  <p className="text-white/90 leading-relaxed"
                     style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    {t('hero.employeeDemo.description')}
                  </p>
                  
                  {/* Laptop Mockup - Desktop Responsive */}
                  <div className="hidden lg:flex flex-1 flex-col justify-center items-center"
                       style={{ marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    <div className="mx-auto"
                         style={{
                           maxWidth: 'clamp(200px, 25vw, 300px)',
                           transform: 'scale(clamp(0.7, 1vw, 1))'
                         }}>
                      <LaptopMockup />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleOpenEmployeeDemo}
                    type="button"
                    disabled={isPreloading}
                    className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white 
                             hover:from-yellow-800 hover:to-yellow-900 rounded-full font-bold 
                             transition-all duration-300 hover:scale-105 transform active:scale-95 
                             shadow-xl hover:shadow-2xl w-full
                             ring-2 ring-yellow-600/40 hover:ring-yellow-600/60 
                             border-2 border-white/20"
                    style={{
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(2rem, 5vw, 3rem)',
                      fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                      minHeight: 'clamp(44px, 6vh, 56px)',
                      maxWidth: 'clamp(280px, 30vw, 360px)'
                    }}
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
      <Suspense fallback={null}>
        <CustomerDemoOverlay
          isOpen={isCustomerDemoOpen}
          onClose={handleCloseAllDemos}
          onSwitchToEmployee={handleSwitchToEmployee}
        />
      </Suspense>

      <Suspense fallback={null}>
        <EmployeeDemoOverlay
          isOpen={isEmployeeDemoOpen}
          onClose={handleCloseAllDemos}
          onSwitchToCustomer={handleSwitchToCustomer}
        />
      </Suspense>
    </>
  );
};