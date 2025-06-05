import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import plantenBg from "../../assets/afbeeldingen/optie4.png";

type AppScreen = {
  id: string;
  title: string;
  description: string;
  content: JSX.Element;
};

type DashboardScreen = {
  id: string;
  title: string;
  description: string;
  content: JSX.Element;
};

export default function BenefitsOne() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [currentDashboard, setCurrentDashboard] = useState(0);

  const appScreens: AppScreen[] = [
    {
      id: "menu",
      title: "Digitaal Menu Bekijken",
      description: "Gasten scannen de QR code en bekijken direct het volledige menu op hun telefoon",
      content: (
        <div className="p-1 h-full bg-white text-gray-800 rounded-2xl overflow-hidden text-xs">
          {/* Header - smaller */}
          <div className="text-center mb-1">
            <h3 className="text-xs font-bold text-gray-800 mb-0.5">TableTech</h3>
            <p className="text-xs text-gray-500 mb-0.5">Tafel 12 • Restaurant Menu</p>
            <div className="flex justify-center">
              <span className="bg-red-100 px-1.5 py-0.5 rounded-full text-xs font-semibold text-red-600 border border-red-200">Populair</span>
            </div>
          </div>
          
          {/* Menu Items Grid - 4 items, smaller */}
          <div className="grid grid-cols-2 gap-0.5 mb-1">
            <div className="bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
              <img
                src="/menu/menu1.jpg"
                alt="Prawn Raisukaree"
                className="w-full h-8 object-contain rounded mb-0.5"
              />
              <h4 className="text-xs font-bold mb-0.5 text-gray-800">Prawn Raisukaree</h4>
              <p className="text-xs text-gray-600 mb-0.5">Verse garnalen, rijst</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">€12.00</span>
                <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
              <img
                src="/menu/menu3.jpg"
                alt="Chicken Katsu Curry"
                className="w-full h-8 object-contain rounded mb-0.5"
              />
              <h4 className="text-xs font-bold mb-0.5 text-gray-800">Chicken Katsu Curry</h4>
              <p className="text-xs text-gray-600 mb-0.5">Krokante kip, curry</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">€10.50</span>
                <div className="w-3 h-3 bg-amber-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
              <img
                src="/menu/menu2.jpg"
                alt="Firecracker Prawn"
                className="w-full h-8 object-contain rounded mb-0.5"
              />
              <h4 className="text-xs font-bold mb-0.5 text-gray-800">Firecracker Prawn</h4>
              <p className="text-xs text-gray-600 mb-0.5">Pittige garnalen</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">€11.00</span>
                <div className="w-3 h-3 bg-orange-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
              <img
                src="/menu/menu5.jpg"
                alt="Fresh Lemonade"
                className="w-full h-8 object-contain rounded mb-0.5"
              />
              <h4 className="text-xs font-bold mb-0.5 text-gray-800">Fresh Lemonade</h4>
              <p className="text-xs text-gray-600 mb-0.5">Verse citroen, munt</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">€3.50</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories - smaller */}
          <div className="flex justify-center space-x-0.5">
            <div className="bg-red-100 px-1 py-0.5 rounded-full border border-red-200">
              <span className="text-xs font-semibold text-red-600">Populair</span>
            </div>
            <div className="bg-gray-100 px-1 py-0.5 rounded-full border border-gray-200">
              <span className="text-xs text-gray-600">Pizza</span>
            </div>
            <div className="bg-gray-100 px-1 py-0.5 rounded-full border border-gray-200">
              <span className="text-xs text-gray-600">Curry</span>
            </div>
            <div className="bg-gray-100 px-1 py-0.5 rounded-full border border-gray-200">
              <span className="text-xs text-gray-600">Drinks</span>
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
        <div className="p-1 h-full bg-white text-gray-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-1">
            <h3 className="text-xs font-bold text-gray-800 mb-0.5">TableTech</h3>
            <p className="text-xs text-gray-500 mb-0.5">Jouw Bestelling</p>
            <div className="bg-green-100 rounded p-0.5">
              <p className="text-xs text-green-700 font-semibold">2 items toegevoegd</p>
            </div>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-1 mb-1">
            <div className="bg-green-50 rounded p-1 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <img
                    src="/menu/menu1.jpg"
                    alt="Prawn Raisukaree"
                    className="w-5 h-5 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-xs font-bold">2x Prawn Raisukaree</h4>
                    <p className="text-xs text-gray-600">Extra garnalen</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600">€24.00</span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded p-1 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <img
                    src="/menu/menu5.jpg"
                    alt="Fresh Lemonade"
                    className="w-5 h-5 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-xs font-bold">2x Fresh Lemonade</h4>
                    <p className="text-xs text-gray-600">Extra ijs</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600">€7.00</span>
              </div>
            </div>
          </div>
          
          {/* Total & Order Button */}
          <div className="space-y-1">
            <div className="bg-gray-100 rounded p-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Totaal:</span>
                <span className="text-sm font-bold text-gray-800">€31.00</span>
              </div>
            </div>
            <div className="bg-green-500 rounded p-1.5 text-center">
              <p className="text-white font-bold text-xs">Bestelling Plaatsen</p>
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
        <div className="p-2 h-full bg-white text-gray-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-2">
            <h3 className="text-base font-bold text-red-600 mb-1">TableTech.</h3>
            <p className="text-xs text-gray-500 mb-1">Betaling • Tafel 12</p>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-2 shadow-sm mb-2 border">
            <h4 className="font-bold text-sm mb-1.5 text-center">Bestellingsoverzicht</h4>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span>2x Pizza Margherita</span>
                <span className="font-semibold">€25.00</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span>2x Fresh Lemonade</span>
                <span className="font-semibold">€7.00</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span>Subtotaal</span>
                <span className="font-semibold">€32.00</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200 text-gray-600">
                <span>Fooi (15%)</span>
                <span>€4.80</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span>Totaal</span>
                <span className="text-purple-600">€36.80</span>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-purple-500 rounded-lg p-2 text-center text-white">
            <p className="font-bold text-sm">Betalen met iDEAL</p>
          </div>
        </div>
      )
    },
    {
      id: "feedback",
      title: "Feedback Geven",
      description: "Gasten kunnen direct hun ervaring delen voor continue verbetering",
      content: (
        <div className="p-1 h-full bg-white text-gray-800 rounded-2xl overflow-hidden text-xs">
          {/* Header - much smaller */}
          <div className="text-center mb-1">
            <h3 className="text-xs font-bold text-red-600 mb-0.5">TableTech.</h3>
            <p className="text-xs text-gray-500 mb-0.5">Feedback • Tafel 12</p>
          </div>
          
          {/* Success Message - much smaller */}
          <div className="bg-green-100 rounded-lg p-1 mb-1 text-center border border-green-200">
            <div className="text-sm mb-0.5">✅</div>
            <h4 className="font-bold text-green-800 text-xs mb-0.5">Betaling Gelukt!</h4>
            <p className="text-xs text-green-600">Bestelling naar keuken</p>
          </div>
          
          {/* Rating - much smaller */}
          <div className="bg-gray-50 rounded-lg p-1 shadow-sm mb-1 border">
            <h4 className="font-bold text-xs mb-0.5 text-center">Hoe was je ervaring?</h4>
            <div className="flex justify-center space-x-0.5 mb-1">
              {[1,2,3,4,5].map(star => (
                <span key={star} className="text-sm text-yellow-500">⭐</span>
              ))}
            </div>
            <div className="bg-white rounded-lg p-1 border">
              <p className="text-xs text-gray-700 leading-relaxed">
                "Geweldige service! Het bestellen ging super makkelijk en het eten was heerlijk. Aanrader! 👍"
              </p>
            </div>
          </div>
          
          {/* Submit Button - much smaller */}
          <div className="bg-orange-500 rounded-lg p-1 text-center text-white">
            <p className="font-bold text-xs">Feedback Versturen</p>
          </div>
        </div>
      )
    }
  ];

  const dashboardScreens: DashboardScreen[] = [
    {
      id: "live-orders",
      title: "Live Bestelling Management",
      description: "Realtime overzicht van alle inkomende bestellingen met status tracking",
      content: (
        <div className="h-full bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-sm p-1 rounded-xl overflow-hidden">
          {/* Header - much smaller */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-0.5">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-white font-bold text-xs">Live Bestellingen</h2>
            </div>
            <div className="bg-green-500/30 backdrop-blur-sm px-1 py-0.5 rounded-full border border-green-400/30">
              <span className="text-green-300 text-xs font-semibold">3 actief</span>
            </div>
          </div>
          
          {/* Orders - much smaller */}
          <div className="space-y-0.5 mb-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-yellow-600/20 to-orange-700/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-0.5"
            >
              <div className="flex items-start justify-between mb-0.5">
                <div className="flex items-center space-x-0.5">
                  <div className="w-2.5 h-2.5 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    7
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs">Tafel 7</div>
                    <div className="text-gray-300 text-xs">2 items • 4m</div>
                  </div>
                </div>
                <div className="bg-yellow-600 text-black px-0.5 py-0.5 rounded text-xs font-bold">
                  BEREIDEN
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="bg-white/10 backdrop-blur-sm rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-xs">2x Pizza Margherita</div>
                  <div className="text-gray-400 text-xs">Extra basilicum</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-xs">1x Caesar Salade</div>
                  <div className="text-gray-400 text-xs">Geen croutons</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-green-600/20 to-green-700/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-0.5"
            >
              <div className="flex items-start justify-between mb-0.5">
                <div className="flex items-center space-x-0.5">
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs">Tafel 3</div>
                    <div className="text-gray-300 text-xs">1 item • 7m</div>
                  </div>
                </div>
                <div className="bg-green-600 text-white px-0.5 py-0.5 rounded text-xs font-bold">
                  KLAAR
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-xs">1x Chicken Katsu Curry</div>
                <div className="text-gray-400 text-xs">Medium spicy</div>
              </div>
            </motion.div>
          </div>
          
          {/* Stats - much smaller */}
          <div className="grid grid-cols-3 gap-0.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 text-center border border-white/20">
              <div className="text-white font-bold text-xs">24</div>
              <div className="text-gray-300 text-xs">Vandaag</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 text-center border border-white/20">
              <div className="text-white font-bold text-xs">8m</div>
              <div className="text-gray-300 text-xs">Gem. tijd</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 text-center border border-white/20">
              <div className="text-white font-bold text-xs">€547</div>
              <div className="text-gray-300 text-xs">Omzet</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "analytics",
      title: "Business Intelligence Dashboard",
      description: "Geavanceerde analytics met realtime inzichten in verkoop, trends en KPI's",
      content: (
        <div className="h-full bg-gradient-to-br from-indigo-800/80 via-purple-700/80 to-indigo-800/80 backdrop-blur-sm p-1.5 rounded-xl overflow-hidden">
          {/* Header - smaller */}
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-white font-bold text-xs">Business Analytics</h2>
            <div className="bg-purple-500/30 backdrop-blur-sm px-1 py-0.5 rounded-full border border-purple-400/30">
              <span className="text-purple-300 text-xs font-semibold">Real-time</span>
            </div>
          </div>
          
          {/* Revenue Chart - smaller */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 mb-1.5 border border-white/20">
            <h3 className="text-white font-semibold mb-0.5 text-xs">Omzet Deze Week</h3>
            <div className="space-y-0.5">
              <div className="flex items-end space-x-0.5 h-6">
                {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                  <motion.div
                    key={i}
                    className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-t flex-1"
                    style={{ height: `${height}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.2, duration: 1 }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Ma</span><span>Di</span><span>Wo</span><span>Do</span><span>Vr</span><span>Za</span><span>Zo</span>
              </div>
            </div>
          </div>
          
          {/* KPIs - smaller */}
          <div className="grid grid-cols-2 gap-0.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <div className="flex items-center space-x-0.5 mb-0.5">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-xs">Dagomzet</span>
              </div>
              <div className="text-white font-bold text-xs">€1,847</div>
              <div className="text-green-400 text-xs">+18% vs gisteren</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <div className="flex items-center space-x-0.5 mb-0.5">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-xs">Bestellingen</span>
              </div>
              <div className="text-white font-bold text-xs">73</div>
              <div className="text-blue-400 text-xs">+12% vs gisteren</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <div className="flex items-center space-x-0.5 mb-0.5">
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300 text-xs">Gem. bestelling</span>
              </div>
              <div className="text-white font-bold text-xs">€25.30</div>
              <div className="text-yellow-400 text-xs">+5% vs gisteren</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <div className="flex items-center space-x-0.5 mb-0.5">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300 text-xs">Rating</span>
              </div>
              <div className="text-white font-bold text-xs">4.9⭐</div>
              <div className="text-purple-400 text-xs">+0.2 vs week</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "kitchen",
      title: "Kitchen Display System",
      description: "Professioneel keuken display voor efficiënte order management en timing",
      content: (
        <div className="h-full bg-gradient-to-br from-red-800/80 via-orange-700/80 to-red-800/80 backdrop-blur-sm p-1.5 rounded-xl overflow-hidden">
          {/* Header - smaller */}
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-white font-bold text-xs">Keuken Display</h2>
            <div className="flex items-center space-x-0.5">
              <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-300 text-xs font-semibold">3 orders</span>
            </div>
          </div>
          
          {/* Kitchen Orders - smaller */}
          <div className="space-y-1 mb-1.5">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-1 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-0.5">
                  <span className="text-white font-bold text-xs">Tafel 7</span>
                  <span className="bg-red-600 text-white px-0.5 py-0.5 rounded-full text-xs font-bold">URGENT</span>
                </div>
                <span className="bg-red-600 text-white px-1 py-0.5 rounded-lg text-xs font-bold">12m</span>
              </div>
              <div className="space-y-0.5">
                <div className="bg-white/10 backdrop-blur-sm rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-xs">2x Pizza Margherita</div>
                  <div className="text-gray-400 text-xs">Extra basilicum, dunne bodem</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-xs">1x Caesar Salade</div>
                  <div className="text-gray-400 text-xs">Geen croutons, extra parmezaan</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-1 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-0.5">
                  <span className="text-white font-bold text-xs">Tafel 12</span>
                  <span className="bg-yellow-600 text-black px-0.5 py-0.5 rounded-full text-xs font-bold">BEREIDEN</span>
                </div>
                <span className="bg-yellow-600 text-black px-1 py-0.5 rounded-lg text-xs font-bold">5m</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-xs">1x Chicken Katsu Curry</div>
                <div className="text-gray-400 text-xs">Medium spicy, extra rijst</div>
              </div>
            </div>
          </div>
          
          {/* Performance - smaller */}
          <div className="grid grid-cols-3 gap-0.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 text-center border border-white/20">
              <div className="text-white font-bold text-xs">7</div>
              <div className="text-gray-300 text-xs">Wachtrij</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 text-center border border-white/20">
              <div className="text-white font-bold text-xs">9.5m</div>
              <div className="text-gray-300 text-xs">Gem. tijd</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 text-center border border-white/20">
              <div className="text-white font-bold text-xs">96%</div>
              <div className="text-gray-300 text-xs">On-time</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "management",
      title: "Restaurant Management Hub",
      description: "Centraal beheercentrum voor menu's, personeel, instellingen en systeem monitoring",
      content: (
        <div className="h-full bg-gradient-to-br from-gray-800/80 via-slate-700/80 to-gray-800/80 backdrop-blur-sm p-1 rounded-xl overflow-hidden">
          {/* Header - much smaller */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-bold text-xs">Management Dashboard</h2>
            <div className="bg-gray-600/30 backdrop-blur-sm px-1 py-0.5 rounded-full border border-gray-500/30">
              <span className="text-gray-300 text-xs font-semibold">Admin Panel</span>
            </div>
          </div>
          
          {/* Management Modules - much smaller */}
          <div className="grid grid-cols-2 gap-0.5 mb-1">
            <div className="bg-white/10 backdrop-blur-sm hover:bg-white/15 rounded-lg p-0.5 transition-colors border border-white/20">
              <div className="text-xs mb-0.5">📋</div>
              <div className="text-white font-semibold text-xs mb-0.5">Menu Beheer</div>
              <div className="text-gray-300 text-xs">47 items • 6 categorieën</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm hover:bg-white/15 rounded-lg p-0.5 transition-colors border border-white/20">
              <div className="text-xs mb-0.5">👥</div>
              <div className="text-white font-semibold text-xs mb-0.5">Personeel</div>
              <div className="text-gray-300 text-xs">8 actieve gebruikers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm hover:bg-white/15 rounded-lg p-0.5 transition-colors border border-white/20">
              <div className="text-xs mb-0.5">🏪</div>
              <div className="text-white font-semibold text-xs mb-0.5">Tafelbeheer</div>
              <div className="text-gray-300 text-xs">24 tafels • 18 bezet</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm hover:bg-white/15 rounded-lg p-0.5 transition-colors border border-white/20">
              <div className="text-xs mb-0.5">⚙️</div>
              <div className="text-white font-semibold text-xs mb-0.5">Instellingen</div>
              <div className="text-gray-300 text-xs">Systeem configuratie</div>
            </div>
          </div>
          
          {/* System Status - much smaller */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5 border border-white/20">
            <h3 className="text-white font-semibold mb-0.5 text-xs">Systeem Status</h3>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">QR Code System</span>
                <div className="flex items-center space-x-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-xs font-semibold">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">Payment Gateway</span>
                <div className="flex items-center space-x-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-xs font-semibold">Actief</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">Kitchen Display</span>
                <div className="flex items-center space-x-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-xs font-semibold">Verbonden</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">Analytics Engine</span>
                <div className="flex items-center space-x-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-xs font-semibold">Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % appScreens.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [appScreens.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % dashboardScreens.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [dashboardScreens.length]);

  return (
    <section
      id="benefits-1"
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat snap-start shrink-0 overflow-hidden"
      style={{ backgroundImage: `url(${plantenBg})` }}
    >
      {/* Donkere overlay */}
      <div className="absolute inset-0 bg-[#3b2a1d]/20 z-0" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left side - Description */}
          <div className="space-y-6 order-1 lg:order-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                TableTech Ecosysteem
              </h2>
              <p className="text-white/90 text-lg drop-shadow-md mb-6">
                Van QR-code scan tot keuken management - een complete restaurantoplossing
              </p>
            </motion.div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-5"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    📱 {appScreens[currentScreen].title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {appScreens[currentScreen].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDashboard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-5"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    💻 {dashboardScreens[currentDashboard].title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {dashboardScreens[currentDashboard].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right side - Screens */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 order-2 lg:order-none">
            {/* Tablet Dashboard */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl blur-3xl scale-110 opacity-30" />

                <motion.div
                  className="relative w-96 h-72 bg-black rounded-2xl p-1 shadow-2xl"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDashboard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                      >
                        {dashboardScreens[currentDashboard].content}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {dashboardScreens.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentDashboard(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentDashboard === index ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Phone */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl scale-110 opacity-20" />

                <motion.div
                  className="relative w-64 h-80 bg-black rounded-3xl p-2 shadow-2xl"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full z-30" />

                  <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScreen}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 p-1"
                      >
                        {appScreens[currentScreen].content}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {appScreens.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentScreen(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentScreen === index ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
