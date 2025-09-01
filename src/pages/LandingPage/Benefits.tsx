import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const idealLogo = "/images/payment-logos/ideal1.webp";
const applePayLogo = "/images/payment-logos/apple-pay.webp";

type AppScreen = {
  id: string;
  title: string;
  description: string;
  content: JSX.Element;
};

export const BenefitsOne: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<number | null>(null);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [videoHasStarted, setVideoHasStarted] = useState(false);
  const [videoHasCompleted, setVideoHasCompleted] = useState(false);
  const [showPhoneImage, setShowPhoneImage] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredOnce = useRef(false); // Nieuwe ref om te voorkomen dat video opnieuw start

  const appScreens: AppScreen[] = [
    {
      id: "menu",
      title: "Digitaal Menu Bekijken",
      description: "Gasten scannen de QR code en bekijken direct het volledige menu op hun telefoon",
      content: (
        <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 text-gray-800 overflow-hidden">
          {/* Header */}
          <div className="text-center p-3 bg-gradient-to-b from-red-50/50 to-white/30 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-gray-800">TableTech</h3>
            <p className="text-[10px] text-gray-500">Tafel 12 • Restaurant Menu</p>
            <div className="flex justify-center mt-2">
              <span className="bg-red-100 px-3 py-1 rounded-full text-[10px] font-semibold text-red-600 border border-red-200 shadow-sm">Populair</span>
            </div>
          </div>
          
          {/* Categories - Moved to top */}
          <div className="flex justify-start gap-1.5 px-2 pt-2 pb-1 overflow-x-auto">
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

          {/* Menu Items Grid - 4 items */}
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-100/50">
              <img
                src="/menu/menu1.jpg"
                alt="Prawn Raisukaree"
                className="w-full h-16 object-cover rounded-lg mb-2"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Prawn Raisukaree</h4>
              <p className="text-[9px] text-gray-600">Verse garnalen, rijst</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-800">€12.00</span>
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-100/50">
              <img
                src="/menu/menu3.jpg"
                alt="Chicken Katsu"
                className="w-full h-16 object-cover rounded-lg mb-2"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Chicken Katsu</h4>
              <p className="text-[9px] text-gray-600">Krokante kip, curry</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-800">€10.50</span>
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-100/50">
              <img
                src="/menu/menu5.jpg"
                alt="Fresh Lemonade"
                className="w-full h-16 object-cover rounded-lg mb-2"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Fresh Lemonade</h4>
              <p className="text-[9px] text-gray-600">Verse citroen, munt</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-800">€3.50</span>
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-100/50">
              <img
                src="/menu/menu2.webp"
                alt="Pasta Carbonara"
                className="w-full h-16 object-cover rounded-lg mb-2"
              />
              <h4 className="text-[10px] font-bold text-gray-800 leading-tight">Pasta Carbonara</h4>
              <p className="text-[9px] text-gray-600">Romige pasta</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-800">€11.50</span>
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
              </div>
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
        <div className="h-full bg-gradient-to-br from-emerald-50 to-green-50 text-gray-800 overflow-hidden">
          {/* Header */}
          <div className="text-center p-3 bg-gradient-to-b from-green-50/50 to-white/30 backdrop-blur-sm border-b border-green-100">
            <h3 className="text-sm font-bold text-gray-800">TableTech</h3>
            <p className="text-[10px] text-gray-500">Jouw Bestelling • Tafel 12</p>
            <div className="bg-green-100 rounded-lg px-3 py-0.5 mt-1 inline-block border border-green-200">
              <p className="text-[10px] text-green-700 font-semibold">4 items toegevoegd</p>
            </div>
          </div>
          
          {/* Cart Items */}
          <div className="relative flex-1 overflow-hidden">
            <div className="p-3 space-y-1.5 h-full overflow-y-auto scrollbar-hide">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-2 border border-green-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/menu/menu1.jpg"
                      alt="Prawn Raisukaree"
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-800">2x Prawn Raisukaree</h4>
                      <p className="text-[8px] text-gray-600">Extra garnalen</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600">€24.00</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-2 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/menu/menu5.jpg"
                      alt="Fresh Lemonade"
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-800">2x Fresh Lemonade</h4>
                      <p className="text-[8px] text-gray-600">Extra ijs</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">€7.00</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-2 border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/menu/menu3.jpg"
                      alt="Chicken Katsu"
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-800">1x Chicken Katsu</h4>
                      <p className="text-[8px] text-gray-600">Medium spicy</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600">€10.50</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-2 border border-purple-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/menu/menu2.webp"
                      alt="Pasta Carbonara"
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-800">1x Pasta Carbonara</h4>
                      <p className="text-[8px] text-gray-600">Extra kaas</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-600">€11.50</span>
                </div>
              </div>
            </div>
            
            {/* Subtle fade indicator at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-emerald-50 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Special request */}
          <div className="px-3">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-2.5 border border-gray-200 shadow-sm">
              <p className="text-[10px] text-gray-600">
                <span className="font-semibold">Opmerking:</span> Graag alles tegelijk serveren
              </p>
            </div>
          </div>
          
          {/* Total & Order Button */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-3">
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-3 mb-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Subtotaal:</span>
                <span className="text-xs text-gray-800">€53.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-800">Totaal:</span>
                <span className="text-sm font-bold text-gray-800">€53.00</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl py-3 text-center shadow-lg">
              <p className="text-white font-bold text-sm">Bestelling Plaatsen</p>
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
        <div className="h-full bg-gradient-to-br from-purple-50 to-indigo-50 text-gray-800 flex flex-col">
          {/* Header */}
          <div className="text-center p-3 bg-gradient-to-b from-purple-50/50 to-white/30 backdrop-blur-sm">
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
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-2 text-center">
                  <div className="w-8 h-6 bg-white rounded mx-auto mb-1 flex items-center justify-center border border-gray-200">
                    <img 
                      src={idealLogo} 
                      alt="iDEAL" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[9px] font-semibold text-blue-700">iDEAL</p>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 text-center">
                  <div className="w-8 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded mx-auto mb-1 flex items-center justify-center relative">
                    <div className="text-white font-bold text-xs">€</div>
                  </div>
                  <p className="text-[9px] font-semibold text-gray-600">Contant</p>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 text-center">
                  <div className="w-8 h-6 bg-black rounded mx-auto mb-1 flex items-center justify-center">
                    <img 
                      src={applePayLogo}
                      alt="Apple Pay" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[9px] font-semibold text-gray-600">Apple Pay</p>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 text-center">
                  <div className="w-8 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded mx-auto mb-1 flex items-center justify-center relative">
                    <div className="absolute left-0 w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
                    <div className="absolute right-0 w-3 h-3 bg-orange-400 rounded-full opacity-80"></div>
                    <div className="relative z-10 w-1 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-[9px] font-semibold text-gray-600">Creditcard</p>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center mt-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <p className="text-[9px] font-semibold text-orange-700">Betaal later bij kassa</p>
              </div>
            </div>
          </div>
          
          {/* Payment Button */}
          <div className="p-2 bg-white border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg py-2 text-center shadow-lg flex items-center justify-center space-x-2">
              <div className="w-6 h-4 bg-white rounded flex items-center justify-center">
                <img 
                  src={idealLogo}
                  alt="iDEAL" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-white font-bold text-xs">Betalen met iDEAL</p>
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
        <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 text-gray-800 flex flex-col">
          {/* Header */}
          <div className="text-center p-3 bg-gradient-to-b from-green-50/50 to-white/30 backdrop-blur-sm border-b border-green-100">
            <h3 className="text-sm font-bold text-green-600">TableTech</h3>
            <p className="text-[10px] text-gray-500">Bestelling Status • Tafel 12</p>
          </div>
          
          <div className="flex-1 px-3 py-2 space-y-3">
            {/* Success Message */}
            <div className="bg-green-100 rounded-xl p-3 text-center border border-green-200 shadow-sm">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h4 className="font-bold text-green-800 text-xs mb-1">Bestelling Bevestigd!</h4>
              <p className="text-[10px] text-green-600">Je eten wordt nu bereid</p>
            </div>
            
            {/* Order Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
              <h4 className="font-bold text-xs mb-3 text-center text-gray-800">Voortgang</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-gray-800">Bestelling Ontvangen</div>
                    <div className="text-[9px] text-gray-600">14:23 - Betaling verwerkt</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-gray-800">In de Keuken</div>
                    <div className="text-[9px] text-gray-600">Nu bezig - geschatte tijd: 8 min</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-gray-600">Onderweg naar Tafel</div>
                    <div className="text-[9px] text-gray-500">Volgt snel...</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary - Simplified */}
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-xs text-blue-800">Bestellingsoverzicht</h4>
                <span className="text-xs font-bold text-blue-600">€53.00</span>
              </div>
              <div className="space-y-1 text-[10px]">
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
              </div>
            </div>
            
            {/* Status Summary */}
            <div className="bg-green-50 rounded-xl p-3 border border-green-200 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-green-800">Betaling voltooid - Bestelling bevestigd</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Map benefit clicks to existing appScreens
  const benefitToScreenMap = [0, 3, 2, 1]; // Maps benefit index to appScreen index

  const handleBenefitClick = (benefitIndex: number) => {
    // Map benefit click to corresponding appScreen
    const screenIndex = benefitToScreenMap[benefitIndex];
    setCurrentScreen(screenIndex);
    setSelectedBenefit(benefitIndex);
    
    // Reset to automatic cycling after 10 seconds
    setTimeout(() => {
      setSelectedBenefit(null);
    }, 10000);
  };

  const getCurrentMessage = () => {
    return appScreens[currentScreen];
  };

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Only start auto-slide if no benefit is selected
    if (selectedBenefit === null) {
      intervalRef.current = setInterval(() => {
        setCurrentScreen((prev) => (prev + 1) % appScreens.length);
      }, 8000); // 8 seconden per slide
    }
  }, [appScreens.length, selectedBenefit]);


  useEffect(() => {
    if (!isManualMode) {
      startAutoSlide();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isManualMode, selectedBenefit, startAutoSlide]);

  // Robuuste scroll observer - eenmalige trigger, video blijft afspelen ook bij wegschrollen
  useEffect(() => {
    // Stop observer als video al is gestart, voltooid, of al eens geactiveerd
    if (hasTriggeredOnce.current || videoHasStarted || videoHasCompleted) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Alleen actie ondernemen als video nog nooit is geactiveerd EN nog niet is gestart
          if (entry.isIntersecting && !hasTriggeredOnce.current && !videoHasStarted && !videoHasCompleted) {
            const rect = entry.boundingClientRect;
            const sectionHeight = rect.height;
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibilityRatio = visibleHeight / sectionHeight;
            
            // Start video afspelen als meer dan 30% van de sectie zichtbaar is
            if (visibilityRatio >= 0.3) {
              // Permanent markeren dat video is geactiveerd voor deze sessie
              hasTriggeredOnce.current = true;
              setShouldPlayVideo(true);
              setVideoHasStarted(true);
              
              // Onmiddellijk observer stoppen om dubbele triggers te voorkomen
              observer.disconnect();
              observerRef.current = null;
              
              // Video starten - zal doorspelen ook bij wegschrollen
              setTimeout(() => {
                if (videoRef.current && !videoRef.current.hasAttribute('data-played-once')) {
                  videoRef.current.setAttribute('data-played-once', 'true');
                  // Zet video op persistent mode - blijft spelen ongeacht scroll positie
                  videoRef.current.setAttribute('data-persistent-play', 'true');
                  videoRef.current.play().catch(() => {
                    // Silent fail
                  });
                }
              }, 100);
            }
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px'
      }
    );

    observerRef.current = observer;

    if (sectionRef.current && !hasTriggeredOnce.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - this effect should only run once

  // Prevent video pause bij visibility changes - video moet doorspelen
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current && videoHasStarted && !videoHasCompleted) {
        // Forceer video om door te spelen ook als tab/window niet zichtbaar is
        if (videoRef.current.paused && videoRef.current.hasAttribute('data-persistent-play')) {
          videoRef.current.play().catch(() => {
            // Silent fail
          });
        }
      }
    };

    // Continue video playback zelfs als de sectie uit beeld gaat
    const handleScroll = () => {
      if (videoRef.current && videoHasStarted && !videoHasCompleted) {
        // Forceer video om door te spelen ook bij scrollen
        if (videoRef.current.paused && videoRef.current.hasAttribute('data-persistent-play')) {
          videoRef.current.play().catch(() => {
            // Silent fail
          });
        }
      }
    };

    // Extra handler voor wanneer de gebruiker wegklikt of weg scrollt
    const handleBlur = () => {
      if (videoHasStarted && !videoHasCompleted) {
        const video = videoRef.current;
        // Video moet blijven spelen ook als window focus verliest
        if (video && video.hasAttribute('data-persistent-play')) {
          setTimeout(() => {
            if (video.paused) {
              video.play().catch(() => {
                // Silent fail
              });
            }
          }, 100);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('blur', handleBlur);
    };
  }, [videoHasStarted, videoHasCompleted]);

  return (
    <section
      ref={sectionRef}
      id="benefits-1"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Main content - Mobile first approach with smaller desktop sizing */}
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12 max-w-[1920px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10 2xl:gap-12 items-center w-full">

          {/* Left side - Video - Hidden on mobile, only visible on desktop - Smaller sizing */}
          <div className="hidden lg:flex relative items-center justify-center order-1 lg:order-1">
            <div className="relative drop-shadow-2xl lg:w-[70%] lg:max-w-[400px] xl:w-[75%] xl:max-w-[450px] 2xl:w-[80%] 2xl:max-w-[500px]">
              {/* Video element */}
              <video 
                ref={videoRef}
                autoPlay={false}
                muted
                playsInline
                controls={false}
                webkit-playsinline="true"
                preload="metadata"
                poster="/images/backgrounds/Render_Mockup_4000_4000_2025-08-26.png"
                loop={false}
                className="w-full h-auto object-contain rounded-lg shadow-2xl transition-all duration-2000 ease-in-out"
                style={{ 
                  display: videoHasCompleted ? 'none' : 'block',
                  maxWidth: '100%',
                  height: 'auto',
                  background: 'transparent',
                  filter: videoHasCompleted 
                    ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3)) blur(2px)' 
                    : 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.8)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6)) blur(0px)',
                  transform: videoHasCompleted ? 'scale(0.95)' : 'scale(1)',
                  opacity: videoHasCompleted ? 0 : 1
                }}
                onCanPlay={(e) => {
                  // Alleen afspelen als video al gestart is via scroll trigger
                  const video = e.target as HTMLVideoElement;
                  if (shouldPlayVideo && videoHasStarted && !videoHasCompleted && !video.hasAttribute('data-played-once')) {
                    video.setAttribute('data-played-once', 'true');
                    video.setAttribute('data-persistent-play', 'true');
                    video.play().catch(() => {
                      // Silent fail - geen console spam
                    });
                  }
                }}
                onPause={(e) => {
                  // Prevent pause - forceer video om door te spelen als het nog bezig is
                  const video = e.target as HTMLVideoElement;
                  if (videoHasStarted && !videoHasCompleted && video.hasAttribute('data-keep-playing')) {
                    setTimeout(() => {
                      if (!video.ended && video.paused) {
                        video.play().catch(() => {
                          // Silent fail
                        });
                      }
                    }, 10);
                  }
                }}
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement;
                  const phoneImage = video.parentElement?.querySelector('.phone-overlay') as HTMLElement;
                  
                  // Alleen fade logic als video actief bezig is en nog niet voltooid
                  if (video.duration > 0 && !videoHasCompleted && videoHasStarted) {
                    const timeRemaining = video.duration - video.currentTime;
                    
                    if (timeRemaining <= 1 && phoneImage) {
                      // Bereken opacity voor snelle overgang in laatste seconde
                      const fadeProgress = 1 - (timeRemaining / 1); // 0 to 1 in laatste seconde
                      const imageOpacity = Math.min(fadeProgress, 1);
                      const videoOpacity = Math.max(1 - fadeProgress, 0);
                      
                      // Snelle crossfade tussen video en afbeelding
                      video.style.opacity = videoOpacity.toString();
                      phoneImage.style.opacity = imageOpacity.toString();
                      phoneImage.style.visibility = 'visible';
                    }
                  }
                }}
                onError={() => {
                  // Silent error handling - geen console spam
                }}
                onEnded={(e) => {
                  // Na afloop: permanent state instellen - video is klaar
                  const video = e.target as HTMLVideoElement;
                  const phoneImage = video.parentElement?.querySelector('.phone-overlay') as HTMLElement;
                  
                  // Markeer video als definitief voltooid
                  setVideoHasCompleted(true);
                  setShowPhoneImage(true);
                  
                  // Remove persistent-play attribute - video is klaar
                  video.removeAttribute('data-persistent-play');
                  video.removeAttribute('data-keep-playing');
                  
                  // Visuele state permanent instellen met smooth transition
                  video.style.transition = 'opacity 1s ease-out, visibility 1s ease-out';
                  video.style.opacity = '0';
                  video.style.visibility = 'hidden';
                  
                  if (phoneImage) {
                    phoneImage.style.transition = 'opacity 1s ease-out, visibility 1s ease-out';
                    phoneImage.style.opacity = '1';
                    phoneImage.style.visibility = 'visible';
                  }
                  
                  // Stop observer definitief
                  if (observerRef.current) {
                    observerRef.current.disconnect();
                    observerRef.current = null;
                  }
                }}
              >
                <source src="/videos/benefit.tsx-Iphone.webm" type="video/webm; codecs=vp9" />
                Your browser does not support the video tag.
              </video>
              
              {/* Telefoon afbeelding overlay - robuuste state handling */}
              <img
                src="/images/backgrounds/telefoon-3.png"
                alt="TableTech App Mockup"
                className="phone-overlay absolute inset-0 w-full h-auto object-contain rounded-lg shadow-2xl transition-all duration-2000 ease-in-out"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  filter: videoHasCompleted 
                    ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.8)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6)) blur(0px)' 
                    : 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3)) blur(1px)',
                  opacity: (showPhoneImage || videoHasCompleted) ? '1' : '0',
                  visibility: (showPhoneImage || videoHasCompleted) ? 'visible' : 'hidden',
                  transform: videoHasCompleted ? 'scale(1)' : 'scale(0.95)',
                  zIndex: '10'
                }}
              />
            </div>
          </div>

          {/* Right side - Content - Mobile optimized, smaller desktop sizing */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-6 xl:space-y-7 2xl:space-y-8 order-2 md:order-2 flex flex-col lg:h-full lg:justify-center">
            {/* Desktop: Title section with smaller sizing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:order-2"
            >
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5 leading-tight lg:leading-[1.1]"
                  style={{
                    textShadow: '0 4px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)'
                  }}>
                Mobiele Restaurantervaring
              </h2>
              <p className="text-white/95 text-sm xs:text-base sm:text-lg md:text-base lg:text-base xl:text-lg 2xl:text-xl mb-3 sm:mb-4 md:mb-6 lg:mb-5 xl:mb-6 leading-relaxed lg:leading-relaxed"
                 style={{
                   textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                 }}>
                Van QR-scan tot betaling - alles op de smartphone van je gasten
              </p>
            </motion.div>

            {/* Content sections - Mobile first, smaller desktop spacing */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-5 xl:space-y-6 2xl:space-y-7 flex-1 overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent pointer-events-none"></div>
                  <div className="relative p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 2xl:p-8 z-10">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5"
                        style={{
                          textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}>
                      {getCurrentMessage().title}
                    </h3>
                    <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl leading-relaxed lg:leading-relaxed"
                       style={{
                         textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                       }}>
                      {getCurrentMessage().description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Mobile Benefits with premium glassmorphism - Better desktop layout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/3 to-transparent pointer-events-none"></div>
                
                <div className="relative p-4 sm:p-5 md:p-6 lg:p-8 xl:p-12 2xl:p-16 z-10">
                  <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-10 xl:mb-12">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8"
                        style={{
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}>
                      Waarom mobiel bestellen?
                    </h3>
                    <div className="w-12 sm:w-16 md:w-20 lg:w-32 xl:w-40 2xl:w-48 h-0.5 md:h-1 lg:h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-8 xl:gap-10 2xl:gap-12">
                    <motion.div 
                      className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 xl:space-x-8 p-3 sm:p-4 md:p-5 lg:p-8 xl:p-10 2xl:p-12 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer border border-white/10 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(0)}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 min-w-[44px] min-h-[44px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white group-hover:text-blue-100 transition-colors mb-1 lg:mb-3 xl:mb-4"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Geen wachttijden
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/80 group-hover:text-white/90 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          Direct bestellen zonder personeel
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 xl:space-x-8 p-3 sm:p-4 md:p-5 lg:p-8 xl:p-10 2xl:p-12 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer border border-white/10 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(1)}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 min-w-[44px] min-h-[44px] bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-green-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white group-hover:text-green-100 transition-colors mb-1 lg:mb-3 xl:mb-4"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Live order tracking
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/80 group-hover:text-white/90 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          Volg je bestelling realtime
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 xl:space-x-8 p-3 sm:p-4 md:p-5 lg:p-8 xl:p-10 2xl:p-12 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer border border-white/10 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(2)}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 min-w-[44px] min-h-[44px] bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-purple-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white group-hover:text-purple-100 transition-colors mb-1 lg:mb-3 xl:mb-4"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Contactloos betalen
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/80 group-hover:text-white/90 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          iDEAL, Apple Pay en meer
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 xl:space-x-8 p-3 sm:p-4 md:p-5 lg:p-8 xl:p-10 2xl:p-12 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer border border-white/10 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(3)}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 min-w-[44px] min-h-[44px] bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-orange-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white group-hover:text-orange-100 transition-colors mb-1 lg:mb-3 xl:mb-4"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Precisie bestellen
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/80 group-hover:text-white/90 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          Geen miscommunicatie meer
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

