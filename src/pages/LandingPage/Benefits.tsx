import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import plantenBg from "../../assets/afbeeldingen/optie4.png";
import pastaImg from "../../assets/afbeeldingen/pasta.jpeg";

type AppScreen = {
  id: string;
  title: string;
  description: string;
  content: JSX.Element;
};

export const BenefitsOne: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isManualMode, setIsManualMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const appScreens: AppScreen[] = [
    {
      id: "menu",
      title: "Digitaal Menu Bekijken",
      description: "Gasten scannen de QR code en bekijken direct het volledige menu op hun telefoon",
      content: (
        <div className="h-full bg-white text-gray-800 overflow-hidden">
          {/* Header */}
          <div className="text-center p-2 bg-gradient-to-b from-red-50 to-white">
            <h3 className="text-sm font-bold text-gray-800">TableTech</h3>
            <p className="text-[10px] text-gray-500">Tafel 12 • Restaurant Menu</p>
            <div className="flex justify-center mt-1">
              <span className="bg-red-100 px-2 py-0.5 rounded-full text-[10px] font-semibold text-red-600 border border-red-200">Populair</span>
            </div>
          </div>
          
          {/* Menu Items Grid - 4 items */}
          <div className="grid grid-cols-2 gap-1.5 p-2">
            <div className="bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
              <img
                src="/menu/menu1.jpg"
                alt="Prawn Raisukaree"
                className="w-full h-16 object-cover rounded mb-1"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Prawn Raisukaree</h4>
              <p className="text-[9px] text-gray-600">Verse garnalen, rijst</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-gray-800">€12.00</span>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
              <img
                src="/menu/menu3.jpg"
                alt="Chicken Katsu"
                className="w-full h-16 object-cover rounded mb-1"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Chicken Katsu</h4>
              <p className="text-[9px] text-gray-600">Krokante kip, curry</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-gray-800">€10.50</span>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
              <img
                src="/menu/menu5.jpg"
                alt="Fresh Lemonade"
                className="w-full h-16 object-cover rounded mb-1"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Fresh Lemonade</h4>
              <p className="text-[9px] text-gray-600">Verse citroen, munt</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-gray-800">€3.50</span>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-1.5 shadow-sm border border-gray-100">
              <img
                src={pastaImg}
                alt="Pasta Carbonara"
                className="w-full h-16 object-cover rounded mb-1"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Pasta Carbonara</h4>
              <p className="text-[9px] text-gray-600">Romige pasta</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-gray-800">€11.50</span>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex justify-start gap-1.5 px-2 pb-2 overflow-x-auto">
            <div className="bg-red-100 px-2 py-0.5 rounded-full border border-red-200 whitespace-nowrap">
              <span className="text-[10px] font-semibold text-red-600">Populair</span>
            </div>
            <div className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">
              <span className="text-[10px] text-gray-600">Pizza</span>
            </div>
            <div className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">
              <span className="text-[10px] text-gray-600">Curry</span>
            </div>
            <div className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">
              <span className="text-[10px] text-gray-600">Drinks</span>
            </div>
            <div className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">
              <span className="text-[10px] text-gray-600">Pasta</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ordering",
      title: "Bestelling Plaatsen",
      description: "Eenvoudig items toevoegen aan winkelwagentje zonder wachten op personeel",
      content: (
        <div className="h-full bg-white text-gray-800 overflow-hidden">
          {/* Header */}
          <div className="text-center p-2 bg-gradient-to-b from-green-50 to-white border-b border-green-100">
            <h3 className="text-sm font-bold text-gray-800">TableTech</h3>
            <p className="text-[10px] text-gray-500">Jouw Bestelling • Tafel 12</p>
            <div className="bg-green-100 rounded-full px-3 py-0.5 mt-1 inline-block">
              <p className="text-[10px] text-green-700 font-semibold">✓ 4 items toegevoegd</p>
            </div>
          </div>
          
          {/* Cart Items */}
          <div className="p-2 space-y-1.5 max-h-[60%] overflow-y-auto">
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="/menu/menu1.jpg"
                    alt="Prawn Raisukaree"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-800">2x Prawn Raisukaree</h4>
                    <p className="text-[9px] text-gray-600">Extra garnalen</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600">€24.00</span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="/menu/menu5.jpg"
                    alt="Fresh Lemonade"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-800">2x Fresh Lemonade</h4>
                    <p className="text-[9px] text-gray-600">Extra ijs</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600">€7.00</span>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="/menu/menu3.jpg"
                    alt="Chicken Katsu"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-800">1x Chicken Katsu</h4>
                    <p className="text-[9px] text-gray-600">Medium spicy</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600">€10.50</span>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={pastaImg}
                    alt="Pasta Carbonara"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-800">1x Pasta Carbonara</h4>
                    <p className="text-[9px] text-gray-600">Extra kaas</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-600">€11.50</span>
              </div>
            </div>
          </div>
          
          {/* Special request */}
          <div className="px-2">
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
              <p className="text-[10px] text-gray-600">
                <span className="font-semibold">Opmerking:</span> Graag alles tegelijk serveren
              </p>
            </div>
          </div>
          
          {/* Total & Order Button */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
            <div className="bg-gray-100 rounded-lg p-2 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Subtotaal:</span>
                <span className="text-xs text-gray-800">€53.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-800">Totaal:</span>
                <span className="text-sm font-bold text-gray-800">€53.00</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg py-3 text-center shadow-sm">
              <p className="text-white font-bold text-sm">🛒 Bestelling Plaatsen</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "payment",
      title: "Veilig Betalen",
      description: "Betaling via iDEAL, creditcard of andere betaalmethoden zonder kassarij",
      content: (
        <div className="h-full bg-white text-gray-800 flex flex-col">
          {/* Header */}
          <div className="text-center p-2 bg-gradient-to-b from-purple-50 to-white">
            <h3 className="text-sm font-bold text-purple-600">TableTech</h3>
            <p className="text-[10px] text-gray-500">Betaling • Tafel 12</p>
          </div>
          
          {/* Order Summary */}
          <div className="flex-1 px-2 pb-2">
            <div className="bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-200 mb-2">
              <h4 className="font-bold text-xs mb-2 text-center text-gray-800">Bestellingsoverzicht</h4>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-700">2x Prawn Raisukaree</span>
                  <span className="font-semibold text-gray-800">€24.00</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-700">2x Fresh Lemonade</span>
                  <span className="font-semibold text-gray-800">€7.00</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-700">1x Chicken Katsu</span>
                  <span className="font-semibold text-gray-800">€10.50</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-700">1x Pasta Carbonara</span>
                  <span className="font-semibold text-gray-800">€11.50</span>
                </div>
                <div className="flex justify-between pt-1 text-xs font-bold border-t">
                  <span>Totaal</span>
                  <span className="text-purple-600">€53.00</span>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="space-y-1">
              <h5 className="text-[10px] font-semibold text-gray-700">Kies betaalmethode:</h5>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-1.5 text-center">
                  <div className="text-sm mb-0.5">💳</div>
                  <p className="text-[9px] font-semibold text-blue-700">iDEAL</p>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-center">
                  <div className="text-sm mb-0.5">💰</div>
                  <p className="text-[9px] font-semibold text-gray-600">Contant</p>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-center">
                  <div className="text-sm mb-0.5">📱</div>
                  <p className="text-[9px] font-semibold text-gray-600">Apple Pay</p>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-center">
                  <div className="text-sm mb-0.5">💳</div>
                  <p className="text-[9px] font-semibold text-gray-600">Creditcard</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Button */}
          <div className="p-2 bg-white border-t border-gray-200">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg py-2 text-center shadow-lg">
              <p className="text-white font-bold text-xs">💳 Betalen met iDEAL</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "order-status",
      title: "Bestelling Volgen",
      description: "Realtime updates over de status van je bestelling, van keuken tot tafel",
      content: (
        <div className="h-full bg-white text-gray-800 flex flex-col">
          {/* Header */}
          <div className="text-center p-2 bg-gradient-to-b from-green-50 to-white">
            <h3 className="text-sm font-bold text-green-600">TableTech</h3>
            <p className="text-[10px] text-gray-500">Bestelling Status • Tafel 12</p>
          </div>
          
          <div className="flex-1 px-2 pb-2">
            {/* Success Message */}
            <div className="bg-green-100 rounded-lg p-2 mb-2 text-center border border-green-200">
              <div className="text-lg mb-0.5">✅</div>
              <h4 className="font-bold text-green-800 text-xs mb-0.5">Bestelling Bevestigd!</h4>
              <p className="text-[9px] text-green-600">Je eten wordt nu bereid</p>
            </div>
            
            {/* Order Progress */}
            <div className="bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-200 mb-2">
              <h4 className="font-bold text-xs mb-2 text-center text-gray-800">Voortgang</h4>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] font-semibold text-gray-800">Bestelling Ontvangen</div>
                    <div className="text-[8px] text-gray-600">14:23 - Betaling verwerkt</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-[10px]">🍳</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] font-semibold text-gray-800">In de Keuken</div>
                    <div className="text-[8px] text-gray-600">Nu bezig - geschatte tijd: 8 min</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-[10px]">🚶</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] font-semibold text-gray-600">Onderweg naar Tafel</div>
                    <div className="text-[8px] text-gray-500">Volgt snel...</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200 mb-2">
              <h4 className="font-bold text-xs mb-1 text-blue-800">Jouw Bestelling</h4>
              <div className="space-y-0.5 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-gray-700">2x Prawn Raisukaree</span>
                  <span className="font-semibold">€24.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">2x Fresh Lemonade</span>
                  <span className="font-semibold">€7.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">1x Chicken Katsu</span>
                  <span className="font-semibold">€10.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">1x Pasta Carbonara</span>
                  <span className="font-semibold">€11.50</span>
                </div>
                <div className="border-t border-blue-300 pt-0.5 flex justify-between font-bold">
                  <span>Totaal</span>
                  <span>€53.00</span>
                </div>
              </div>
            </div>
            
            {/* Estimated time */}
            <div className="bg-yellow-50 rounded-lg p-1.5 text-center border border-yellow-200">
              <div className="text-sm mb-0.5">⏱️</div>
              <p className="text-[9px] font-semibold text-yellow-800">Geschatte levertijd: 6-8 minuten</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % appScreens.length);
    }, 8000); // 8 seconden per slide
  };

  const handleManualClick = (index: number) => {
    setCurrentScreen(index);
    setIsManualMode(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Na 8 seconden weer automatisch laten doorgaan
    setTimeout(() => {
      setIsManualMode(false);
      startAutoSlide();
    }, 8000);
  };

  useEffect(() => {
    if (!isManualMode) {
      startAutoSlide();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isManualMode, appScreens.length]);

  return (
    <section
      id="benefits-1"
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0 overflow-hidden"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/20 z-0" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">

          {/* Left side - Description */}
          <div className="space-y-4 order-2 lg:order-1 max-h-full overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Mobiele Restaurantervaring
              </h2>
              <p className="text-white/90 text-lg drop-shadow-md mb-4">
                Van QR-scan tot betaling - alles op de smartphone van je gasten
              </p>
            </motion.div>

            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    📱 {appScreens[currentScreen].title}
                  </h3>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {appScreens[currentScreen].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Mobile Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/75 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">Waarom mobiel bestellen?</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">⚡</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Geen wachttijden</p>
                      <p className="text-xs text-gray-700">Direct bestellen zonder personeel</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">📱</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Live order tracking</p>
                      <p className="text-xs text-gray-700">Volg je bestelling realtime</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">💳</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Contactloos betalen</p>
                      <p className="text-xs text-gray-700">iDEAL, Apple Pay en meer</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">🎯</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Precisie bestellen</p>
                      <p className="text-xs text-gray-700">Geen miscommunicatie meer</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right side - Interactive Phone */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl scale-110 opacity-30" />

              <motion.div
                className="relative w-72 h-[510px] bg-black rounded-3xl p-2 shadow-2xl"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full z-30" />

                <div className="w-full h-full bg-gray-900 rounded-[1.5rem] overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScreen}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                      {appScreens[currentScreen].content}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {appScreens.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleManualClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentScreen === index ? 'bg-white scale-125 shadow-lg' : 'bg-white/60'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};