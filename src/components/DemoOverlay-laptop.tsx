import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from 'lucide-react';

interface DemoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCustomer: () => void;
}

export const DemoOverlay: React.FC<DemoOverlayProps> = ({
  isOpen,
  onClose,
  onSwitchToCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'tables' | 'menu' | 'stats' | 'manage'>('home');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Block/unblock body scroll when overlay opens/closes
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: 'Home' },
    { id: 'tables' as const, label: 'Tafels', icon: 'Tables' },
    { id: 'menu' as const, label: 'Menu', icon: 'Menu' },
    { id: 'stats' as const, label: 'Statistics', icon: 'Stats' },
    { id: 'manage' as const, label: 'Beheer', icon: 'Settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-3">
            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Totale omzet</p>
                    <p className="text-lg font-bold text-green-600">€847.30</p>
                    <p className="text-xs text-green-600">+12.5% ↗</p>
                  </div>
                  <span className="text-lg">💰</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Actieve tafels</p>
                    <p className="text-lg font-bold text-orange-600">6</p>
                    <p className="text-xs text-orange-600">van 15 tafels</p>
                  </div>
                  <span className="text-lg">👥</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Live bestellingen</p>
                    <p className="text-lg font-bold text-blue-600">4</p>
                    <p className="text-xs text-blue-600">actief nu</p>
                  </div>
                  <span className="text-lg">⏰</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Vandaag verkocht</p>
                    <p className="text-lg font-bold text-purple-600">127</p>
                    <p className="text-xs text-purple-600">items</p>
                  </div>
                  <span className="text-lg">📈</span>
                </div>
              </div>
            </div>

            {/* Live Orders */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold">🔄 Live Bestellingen</h3>
                <div className="text-xs text-gray-500">
                  {currentTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">T2</div>
                      <div className="text-xs text-gray-600">Margherita Pizza, Cola</div>
                      <div className="text-xs text-gray-400">17:23</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Wordt bereid
                      </span>
                      <div className="text-xs text-gray-500">5 min</div>
                      <div className="text-xs font-semibold text-green-600">€12.45</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">T4</div>
                      <div className="text-xs text-gray-600">Pepperoni Pizza, Prawn Curry</div>
                      <div className="text-xs text-gray-400">17:15</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Klaar voor serveren
                      </span>
                      <div className="text-xs text-gray-500">12 min</div>
                      <div className="text-xs font-semibold text-green-600">€23.50</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Overview */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 border-b">
                <h3 className="text-sm font-semibold">Tafel Overzicht</h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: 1, status: 'available', icon: '✅' },
                    { id: 2, status: 'occupied', icon: '👥', guests: 4, total: 68 },
                    { id: 3, status: 'reserved', icon: '⏰', time: '18:30' },
                    { id: 4, status: 'occupied', icon: '👥', guests: 3, total: 94 },
                    { id: 5, status: 'available', icon: '✅' },
                    { id: 6, status: 'ordering', icon: '📱' },
                  ].map((table) => (
                    <motion.div
                      key={table.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-2 rounded border-2 cursor-pointer transition-all ${
                        table.status === 'available' ? 'bg-green-100 text-green-800 border-green-200' :
                        table.status === 'occupied' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        table.status === 'reserved' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      } hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">T{table.id}</span>
                        <span className="text-xs">{table.icon}</span>
                      </div>
                      {table.guests && (
                        <div className="text-xs space-y-0.5">
                          <div>{table.guests} gasten</div>
                          {table.total && <div className="text-green-600 font-semibold">€{table.total}</div>}
                        </div>
                      )}
                      {table.time && <div className="text-xs">Geres. {table.time}</div>}
                      {table.status === 'ordering' && <div className="text-xs">Bestelt...</div>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'tables':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Tafel Management</h2>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 hover:bg-green-700">
                <span>+</span>
                <span>Nieuwe Tafel</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-3">
                  <h3 className="text-sm font-semibold mb-2">Tafel {i + 1}</h3>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      Status: {i % 3 === 0 ? '✅ Beschikbaar' : i % 3 === 1 ? '👥 Bezet' : '📅 Gereserveerd'}
                    </div>
                    {i % 3 === 1 && (
                      <div className="text-xs">
                        <div>👥 4 gasten</div>
                        <div>⏰ 45 min</div>
                        <div className="text-green-600 font-semibold">💰 €68.50</div>
                      </div>
                    )}
                    <div className="flex space-x-1">
                      <button className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs">Details</button>
                      <button className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs">Actie</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">🍽️ Menu Management</h2>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 hover:bg-green-700">
                <span>➕</span>
                <span>Nieuw Gerecht</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { category: '🍕 Pizza', items: [{ name: 'Margherita', price: 9.95, sold: 23 }, { name: 'Pepperoni', price: 11.50, sold: 18 }] },
                  { category: '🍛 Curry', items: [{ name: 'Chicken Katsu', price: 10.50, sold: 15 }, { name: 'Prawn Raisukaree', price: 12.00, sold: 31 }] },
                ].map((category) => (
                  <div key={category.category}>
                    <h3 className="text-sm font-semibold mb-2">{category.category}</h3>
                    <div className="space-y-2">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="border rounded p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-xs font-semibold">{item.name}</h4>
                              <p className="text-xs text-gray-600">€{item.price}</p>
                              <p className="text-xs text-gray-500">{item.sold} verkocht</p>
                            </div>
                            <div className="flex space-x-1">
                              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">✏️</button>
                              <button className="p-1 text-red-600 hover:bg-red-100 rounded">🗑️</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">📊 Statistieken</h2>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">📥 Export</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
                <div className="text-lg">💰</div>
                <div className="text-xl font-bold text-green-600">€31,847</div>
                <div className="text-xs text-green-600">+12.5% vs vorige maand</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
                <div className="text-lg">📋</div>
                <div className="text-xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-blue-600">Totale bestellingen</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
                <div className="text-lg">⭐</div>
                <div className="text-xl font-bold text-purple-600">4.6/5</div>
                <div className="text-xs text-purple-600">Gem. waardering</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-3">
              <h3 className="text-sm font-semibold mb-2">🏆 Best verkocht</h3>
              <div className="space-y-2">
                {[
                  { name: 'Prawn Raisukaree', sold: 31, revenue: 372 },
                  { name: 'Margherita Pizza', sold: 23, revenue: 229 },
                  { name: 'Pepperoni Pizza', sold: 18, revenue: 207 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-400">#{idx + 1}</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-green-600 font-semibold">€{item.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'manage':
        return (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">⚙️ Restaurant Beheer</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: '🍽️ Menu Beheer', actions: ['Nieuw gerecht', 'Categorieën', 'Prijzen'] },
                { title: '👥 Personeel', actions: ['Nieuwe werknemer', 'Rollen', 'Planning'] },
                { title: '⚙️ Instellingen', actions: ['Thema', 'Notificaties', 'Openingstijden'] },
                { title: '💳 Betalingen', actions: ['Betaalmethoden', 'Prijzen & BTW', 'Facturen'] },
              ].map((section) => (
                <div key={section.title} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-3 border-b">
                    <h3 className="text-sm font-semibold">{section.title}</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {section.actions.map((action) => (
                      <button key={action} className="w-full bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Tab niet gevonden</div>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.5 
            }}
            className="flex items-center justify-center w-full max-w-[98vw] h-full px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-60 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Demo sluiten"
            >
              <X size={24} />
            </motion.button>

            {/* Demo title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center text-white z-10"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-1">
                Dashboard Demo - TableTech
              </h2>
              <p className="text-white/80 text-sm max-w-md">
                Volledig restaurant management dashboard
              </p>
            </motion.div>

            {/* Main content area */}
            <div className="flex items-center justify-center w-full h-full pt-20 pb-6 gap-0">
              
              {/* Left Demo Features panel */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4, 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="flex flex-col w-48 max-h-[300px] flex-shrink-0 relative z-20 -mr-32"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-white h-full border border-white/20 shadow-2xl">
                  <h3 className="text-sm font-bold mb-3 text-white">
                    Demo Features:
                  </h3>
                  
                  <ul className="space-y-2 text-white">
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-xs">Klik menu tabs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-xs">Selecteer tafels</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-xs">Test functionaliteit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-xs">Live statistieken</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-xs">Dashboard elementen</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Center - Laptop mockup */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 0.75, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="flex-shrink-0 transform relative z-10"
              >
                {/* Complete laptop component */}
                <div className="relative w-[1200px] h-[750px] rounded-t-2xl overflow-hidden shadow-2xl border-4 border-black bg-white flex flex-col font-sans">
                  {/* Laptop Screen */}
                  <div className="w-full h-full bg-black rounded-t-2xl p-2">
                    {/* Screen Bezel */}
                    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="bg-white border-b flex items-center justify-between px-3 py-1.5">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-100 rounded px-3 py-1 text-xs text-gray-600 flex items-center">
                            🔒 uwbedrijf.app/dashboard
                          </div>
                        </div>
                        <div className="w-8 text-xs text-gray-400">
                          {currentTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Dashboard Content */}
                      <div className="flex h-full bg-gray-50">
                        {/* Sidebar */}
                        <div className="w-44 bg-white border-r flex flex-col">
                          <div className="p-3 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <h1 className="text-sm font-bold">TableTech</h1>
                            <p className="text-xs opacity-90">Management Dashboard</p>
                          </div>
                          
                          <nav className="flex-1 p-2">
                            <div className="space-y-1">
                              {tabs.map((tab) => (
                                <motion.button
                                  key={tab.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setActiveTab(tab.id)}
                                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-left transition-all text-xs ${
                                    activeTab === tab.id
                                      ? 'bg-blue-600 text-white shadow-md'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  <span className="font-medium">{tab.label}</span>
                                </motion.button>
                              ))}
                            </div>
                          </nav>

                          <div className="p-3 border-t bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-semibold text-white">JD</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium">Jan Doe</p>
                                <p className="text-xs text-gray-500">👨‍💼 Manager</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 overflow-hidden">
                          <div className="h-full overflow-y-auto p-3">
                            <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {renderTabContent()}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Laptop Base - Much wider on sides */}
                  <div className="w-[1600px] h-5 bg-gray-400 rounded-b-2xl -mt-1 shadow-lg mx-auto"></div>
                  <div className="w-[1700px] h-3 bg-gray-500 rounded-full -mt-1 shadow-xl mx-auto"></div>
                </div>
              </motion.div>

              {/* Right Demo Navigation panel */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4, 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                className="flex flex-col w-52 max-h-[300px] flex-shrink-0 relative z-20 -ml-32"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-white h-full border border-white/20 shadow-2xl flex flex-col">
                  <h3 className="text-sm font-bold mb-3 text-white">
                    Demo navigatie
                  </h3>
                  
                  <div className="flex flex-col gap-2 flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-2 rounded-md font-medium transition-all duration-200 border border-white/30 text-xs"
                    >
                      ← Terug naar homepage
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onSwitchToCustomer}
                      className="bg-[#c49a7a] hover:bg-[#a67c52] text-white px-3 py-2 rounded-md font-medium transition-all duration-200 shadow-lg text-xs"
                    >
                      Demo klant →
                    </motion.button>

                    <div className="mt-2 text-center">
                      <p className="text-white/80 text-xs">TableTech Demo</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile bottom controls */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:hidden absolute bottom-6 left-6 right-6"
            >
              <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-white border border-white/20">
                <div className="flex flex-col gap-2 mb-2">
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-2 rounded-md font-medium transition-all duration-200 border border-white/30 text-xs"
                  >
                    ← Terug naar homepage
                  </button>
                  
                  <button
                    onClick={onSwitchToCustomer}
                    className="bg-[#c49a7a] hover:bg-[#a67c52] text-white px-3 py-2 rounded-md font-medium transition-all duration-200 shadow-lg text-xs"
                  >
                    Demo klant →
                  </button>
                </div>
                <div className="text-xs text-white/80 text-center">
                  TableTech Dashboard Demo • Volledig functioneel
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};