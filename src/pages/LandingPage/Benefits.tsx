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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const benefitMessages = [
    {
      title: "Geen wachttijden",
      description: "Gasten hoeven niet te wachten op personeel om hun bestelling op te nemen. Ze kunnen direct bestellen via hun smartphone."
    },
    {
      title: "Live order tracking", 
      description: "Gasten kunnen realtime zien hoe hun bestelling vordert - van keuken tot tafel. Geen onzekerheid meer over wanneer het eten komt."
    },
    {
      title: "Contactloos betalen",
      description: "Veilig en gemakkelijk betalen met iDEAL, Apple Pay, creditcard of andere digitale betaalmethoden. Geen contant geld nodig."
    },
    {
      title: "Precisie bestellen",
      description: "Door digitaal bestellen verdwijnen misverstanden. Gasten kunnen precies aangeven wat ze willen, inclusief speciale wensen."
    }
  ];

  const handleBenefitClick = (benefitIndex: number) => {
    setSelectedBenefit(benefitIndex);
    // Reset to automatic cycling after 10 seconds
    setTimeout(() => {
      setSelectedBenefit(null);
    }, 10000);
  };

  const getCurrentMessage = () => {
    if (selectedBenefit !== null) {
      return benefitMessages[selectedBenefit];
    }
    return appScreens[currentScreen];
  };

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (selectedBenefit === null) {
        setCurrentScreen((prev) => (prev + 1) % appScreens.length);
      }
    }, 8000); // 8 seconden per slide
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
  }, [isManualMode, appScreens.length, startAutoSlide]);

  return (
    <section
      id="benefits-1"
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Main content - Beter gecentreerd */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8 min-h-0 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-center w-full">

          {/* Left side - Video - Verborgen op mobiel om oververhitting te voorkomen */}
          <div className="relative hidden lg:flex items-end justify-start order-1 lg:order-1 -ml-40 mt-16">
            <div className="relative drop-shadow-2xl">
              <video 
                autoPlay={true}
                muted
                playsInline
                controls={false}
                webkit-playsinline="true"
                preload="metadata"
                poster="/images/hero-images/telefoon.webp"
                loop={false}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
                style={{ 
                  width: '1400px', 
                  height: '1120px',
                  maxWidth: '100%',
                  minWidth: '800px',
                  minHeight: '640px',
                  background: 'transparent',
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.8)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6))'
                }}
                onCanPlay={(e) => {
                  // Desktop: speel af maar slechts één keer
                  const video = e.target as HTMLVideoElement;
                  if (!video.hasAttribute('data-played-once')) {
                    video.setAttribute('data-played-once', 'true');
                    video.play().catch(() => {
                      // Silent fail - geen console spam
                    });
                  } else {
                    // Video heeft al één keer afgespeeld, stop het
                    video.pause();
                  }
                }}
                onError={() => {
                  // Silent error handling - geen console spam
                }}
                onEnded={(e) => {
                  // Na afloop: blijf gepauzeerd op laatste frame
                  const video = e.target as HTMLVideoElement;
                  video.currentTime = video.duration;
                  video.pause();
                }}
              >
                <source src="/videos/Export_Video_2025-08-15-hq.webm" type="video/webm; codecs=vp9" />
                <source src="/videos/telefoon.webm" type="video/webm; codecs=vp8" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-4 order-2 lg:order-2 flex flex-col min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white mb-3"
                  style={{
                    textShadow: '0 4px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)'
                  }}>
                Mobiele Restaurantervaring
              </h2>
              <p className="text-white/95 text-base sm:text-lg lg:text-xl mb-4 leading-relaxed"
                 style={{
                   textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                 }}>
                Van QR-scan tot betaling - alles op de smartphone van je gasten
              </p>
            </motion.div>

            <div className="space-y-3 flex-1 overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBenefit !== null ? `benefit-${selectedBenefit}` : `screen-${currentScreen}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden rounded-2xl shadow-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent pointer-events-none"></div>
                  <div className="relative p-4 sm:p-6 z-10">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3"
                        style={{
                          textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}>
                      {getCurrentMessage().title}
                    </h3>
                    <p className="text-white/95 text-sm sm:text-base lg:text-lg leading-relaxed"
                       style={{
                         textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                       }}>
                      {getCurrentMessage().description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Mobile Benefits with premium glassmorphism */}
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
                
                {/* Background removed for cleaner look */}
                
                <div className="relative p-4 sm:p-6 lg:p-8 z-10">
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2"
                        style={{
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}>
                      Waarom mobiel bestellen?
                    </h3>
                    <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                    <motion.div 
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(0)}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Geen wachttijden
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          Direct bestellen zonder personeel
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(1)}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg border border-green-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-green-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Live order tracking
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          Volg je bestelling realtime
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(2)}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-purple-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Contactloos betalen
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          iDEAL, Apple Pay en meer
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleBenefitClick(3)}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg border border-orange-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-orange-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          Precisie bestellen
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
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

