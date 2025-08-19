import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type DashboardScreen = {
  id: string;
  title: string;
  description: string;
  content: JSX.Element;
};

export const BenefitsThree: React.FC = () => {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dashboardScreens: DashboardScreen[] = useMemo(() => [
    {
      id: "live-orders",
      title: t('benefits3.screens.liveOrders.title'),
      description: t('benefits3.screens.liveOrders.description'),
      content: (
        <div className="h-full bg-slate-900 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-white font-bold text-sm">{t('benefits3.screens.liveOrders.header')}</h2>
            </div>
            <div className="bg-green-500/30 px-2 py-0.5 rounded-full border border-green-400/50">
              <span className="text-green-300 text-[10px] font-semibold">{t('benefits3.screens.liveOrders.status')}</span>
            </div>
          </div>
          
          {/* Orders Grid */}
          <div className="grid grid-cols-2 gap-1.5 mb-1 max-h-[45%]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-600/30 border border-red-500/50 rounded-lg p-1"
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-[8px]">
                    7
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[9px]">{t('benefits3.screens.liveOrders.table')} 7</div>
                    <div className="text-gray-300 text-[8px]">3 {t('benefits3.screens.liveOrders.items')} • 14m</div>
                  </div>
                </div>
                <div className="bg-red-600 text-white px-1 py-0.5 rounded text-[8px] font-bold animate-pulse">
                  {t('benefits3.screens.liveOrders.urgent')}
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="bg-white/10 rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-[8px]">2x {t('dashboard.menuItems.pizzaMargherita')}</div>
                </div>
                <div className="bg-white/10 rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-[8px]">1x {t('dashboard.menuItems.caesarSalad')}</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-yellow-600/30 border border-yellow-500/50 rounded-lg p-1"
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-[8px]">
                    3
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[9px]">{t('benefits3.screens.liveOrders.table')} 3</div>
                    <div className="text-gray-300 text-[8px]">2 {t('benefits3.screens.liveOrders.items')} • 4m</div>
                  </div>
                </div>
                <div className="bg-yellow-600 text-black px-1 py-0.5 rounded text-[8px] font-bold">
                  {t('benefits3.screens.liveOrders.preparing')}
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="bg-white/10 rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-[8px]">1x {t('dashboard.menuItems.chickenKatsu')}</div>
                </div>
                <div className="bg-white/10 rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-[8px]">2x {t('dashboard.menuItems.lemonade')}</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-600/30 border border-green-500/50 rounded-lg p-1"
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-[8px]">
                    12
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[9px]">{t('benefits3.screens.liveOrders.table')} 12</div>
                    <div className="text-gray-300 text-[8px]">1 item • 7m</div>
                  </div>
                </div>
                <div className="bg-green-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">
                  {t('benefits3.screens.liveOrders.ready')}
                </div>
              </div>
              
              <div className="bg-white/10 rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-[8px]">1x {t('dashboard.menuItems.pastaCarbonara')}</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-600/30 border border-blue-500/50 rounded-lg p-1"
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[8px]">
                    15
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[9px]">{t('benefits3.screens.liveOrders.table')} 15</div>
                    <div className="text-gray-300 text-[8px]">4 {t('benefits3.screens.liveOrders.items')} • 1m</div>
                  </div>
                </div>
                <div className="bg-blue-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">
                  {t('benefits3.screens.liveOrders.new')}
                </div>
              </div>
              
              <div className="bg-white/10 rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-[8px]">2x {t('dashboard.menuItems.burgerDeluxe')}</div>
              </div>
            </motion.div>
          </div>
          
          {/* Live Statistics */}
          <div className="grid grid-cols-4 gap-1 mb-1">
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">47</div>
              <div className="text-gray-300 text-[8px]">{t('benefits3.screens.liveOrders.today')}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">8.2m</div>
              <div className="text-gray-300 text-[8px]">{t('benefits3.screens.liveOrders.avgTime')}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">€1,247</div>
              <div className="text-gray-300 text-[8px]">{t('benefits3.screens.liveOrders.revenue')}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">94%</div>
              <div className="text-gray-300 text-[8px]">{t('benefits3.screens.liveOrders.onTime')}</div>
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
            <h3 className="text-white font-semibold text-[9px] mb-1">{t('benefits3.screens.liveOrders.ordersPerHour')}</h3>
            <div className="flex items-end space-x-0.5 h-8">
              {[3, 5, 8, 12, 15, 18, 14, 16, 11, 7].map((height, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-green-500 to-green-400 rounded-t flex-1"
                  style={{ height: `${(height / 18) * 100}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(height / 18) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[7px] text-gray-300 mt-0.5">
              <span>9u</span><span>12u</span><span>15u</span><span>18u</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "analytics",
      title: t('benefits3.screens.analytics.title'),
      description: t('benefits3.screens.analytics.description'),
      content: (
        <div className="h-full bg-indigo-900 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-sm">{t('benefits3.screens.analytics.header')}</h2>
            <div className="bg-purple-500/30 px-2 py-0.5 rounded-full border border-purple-400/50">
              <span className="text-purple-300 text-[10px] font-semibold">{t('benefits3.screens.analytics.status')}</span>
            </div>
          </div>
          
          {/* Revenue Chart */}
          <div className="bg-white/20 rounded-lg p-2 mb-2 border border-white/30">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold text-[10px]">{t('benefits3.screens.analytics.revenueWeek')}</h3>
              <span className="text-green-400 text-[9px] font-semibold">+23% {t('benefits3.screens.analytics.vsLastWeek')}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-end space-x-0.5 h-16">
                {[1847, 1523, 2156, 1687, 2543, 2812, 2394].map((value, i) => (
                  <motion.div
                    key={i}
                    className="relative bg-gradient-to-t from-purple-500 to-pink-400 rounded-t flex-1"
                    style={{ height: `${(value / 2812) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / 2812) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                  >
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[8px] text-white font-semibold">
                      €{(value / 1000).toFixed(1)}k
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-gray-300">
                <span>Ma</span><span>Di</span><span>Wo</span><span>Do</span><span>Vr</span><span>Za</span><span>Zo</span>
              </div>
            </div>
          </div>
          
          {/* KPIs Grid */}
          <div className="grid grid-cols-3 gap-1 mb-2">
            <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
              <div className="flex items-center space-x-1 mb-0.5">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-[9px]">Dagomzet</span>
              </div>
              <div className="text-white font-bold text-sm">€2,847</div>
              <div className="text-green-400 text-[8px]">+18% ↑</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
              <div className="flex items-center space-x-1 mb-0.5">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-[9px]">Orders</span>
              </div>
              <div className="text-white font-bold text-sm">127</div>
              <div className="text-blue-400 text-[8px]">+24% ↑</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
              <div className="flex items-center space-x-1 mb-0.5">
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300 text-[9px]">Gem. order</span>
              </div>
              <div className="text-white font-bold text-sm">€22.40</div>
              <div className="text-yellow-400 text-[8px]">+5% ↑</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
              <div className="flex items-center space-x-1 mb-0.5">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300 text-[9px]">Rating</span>
              </div>
              <div className="text-white font-bold text-sm">4.9⭐</div>
              <div className="text-purple-400 text-[8px]">+0.2 ↑</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
              <div className="flex items-center space-x-1 mb-0.5">
                <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                <span className="text-gray-300 text-[9px]">Bezetting</span>
              </div>
              <div className="text-white font-bold text-sm">87%</div>
              <div className="text-pink-400 text-[8px]">+12% ↑</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
              <div className="flex items-center space-x-1 mb-0.5">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300 text-[9px]">Wachttijd</span>
              </div>
              <div className="text-white font-bold text-sm">7.8m</div>
              <div className="text-red-400 text-[8px]">-15% ↓</div>
            </div>
          </div>
          
          {/* Product Performance */}
          <div className="bg-white/20 rounded-lg p-1.5 border border-white/30 mb-2">
            <h3 className="text-white font-semibold text-[10px] mb-1">Top Producten Vandaag</h3>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-200 text-[9px]">{t('dashboard.menuItems.pizzaMargherita')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="bg-purple-600/50 h-1 rounded-full" style={{width: '60px'}}>
                    <div className="bg-purple-400 h-full rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-white text-[9px] font-semibold">47</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-200 text-[9px]">{t('dashboard.menuItems.chickenKatsu')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="bg-purple-600/50 h-1 rounded-full" style={{width: '60px'}}>
                    <div className="bg-purple-400 h-full rounded-full" style={{width: '72%'}}></div>
                  </div>
                  <span className="text-white text-[9px] font-semibold">38</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-200 text-[9px]">{t('dashboard.menuItems.caesarSalad')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="bg-purple-600/50 h-1 rounded-full" style={{width: '60px'}}>
                    <div className="bg-purple-400 h-full rounded-full" style={{width: '55%'}}></div>
                  </div>
                  <span className="text-white text-[9px] font-semibold">29</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Live Metrics */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-green-600/30 rounded-lg p-1.5 border border-green-500/50">
              <div className="text-green-300 text-[9px] mb-0.5">Live Gasten</div>
              <div className="text-white font-bold text-base">74</div>
            </div>
            <div className="bg-blue-600/30 rounded-lg p-1.5 border border-blue-500/50">
              <div className="text-blue-300 text-[9px] mb-0.5">Actieve Orders</div>
              <div className="text-white font-bold text-base">12</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "kitchen",
      title: t('benefits3.screens.kitchen.title'),
      description: t('benefits3.screens.kitchen.description'),
      content: (
        <div className="h-full bg-red-900 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-sm">Keuken Display</h2>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-300 text-[10px] font-semibold">7 orders • 3 urgent</span>
            </div>
          </div>
          
          {/* Kitchen Orders Grid */}
          <div className="grid grid-cols-2 gap-1.5 mb-1 max-h-[50%]">
            <div className="bg-white/15 rounded-lg p-1 border-l-2 border-red-500">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-white font-bold text-[9px]">Tafel 7</span>
                  <span className="bg-red-600 text-white px-1 py-0.5 rounded-full text-[7px] font-bold animate-pulse">URGENT</span>
                </div>
                <span className="bg-red-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">15m</span>
              </div>
              <div className="space-y-0.5">
                <div className="bg-white/10 rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-[8px]">2x {t('dashboard.menuItems.pizzaMargherita')}</div>
                </div>
                <div className="bg-white/10 rounded p-0.5 border border-white/20">
                  <div className="text-gray-200 font-semibold text-[8px]">1x {t('dashboard.menuItems.caesarSalad')}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 rounded-lg p-1 border-l-2 border-yellow-500">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-white font-bold text-[9px]">Tafel 12</span>
                  <span className="bg-yellow-600 text-black px-1 py-0.5 rounded-full text-[7px] font-bold">BEREIDEN</span>
                </div>
                <span className="bg-yellow-600 text-black px-1 py-0.5 rounded text-[8px] font-bold">5m</span>
              </div>
              <div className="bg-white/10 rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-[8px]">1x {t('dashboard.menuItems.chickenKatsu')}</div>
              </div>
            </div>
            
            <div className="bg-white/15 rounded-lg p-1 border-l-2 border-green-500">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-white font-bold text-[9px]">Tafel 3</span>
                  <span className="bg-green-600 text-white px-1 py-0.5 rounded-full text-[7px] font-bold">KLAAR</span>
                </div>
                <span className="bg-green-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">✓</span>
              </div>
              <div className="bg-white/10 rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-[8px]">1x {t('dashboard.menuItems.pastaCarbonara')}</div>
              </div>
            </div>
            
            <div className="bg-white/15 rounded-lg p-1 border-l-2 border-blue-500">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-white font-bold text-[9px]">Tafel 15</span>
                  <span className="bg-blue-600 text-white px-1 py-0.5 rounded-full text-[7px] font-bold">NIEUW</span>
                </div>
                <span className="bg-blue-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">1m</span>
              </div>
              <div className="bg-white/10 rounded p-0.5 border border-white/20">
                <div className="text-gray-200 font-semibold text-[8px]">2x {t('dashboard.menuItems.burgerDeluxe')}</div>
              </div>
            </div>
          </div>
          
          {/* Performance Stats */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">12</div>
              <div className="text-gray-300 text-[8px]">Wachtrij</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">8.7m</div>
              <div className="text-gray-300 text-[8px]">Gem. tijd</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">94%</div>
              <div className="text-gray-300 text-[8px]">On-time</div>
            </div>
            <div className="bg-white/20 rounded-lg p-1 text-center border border-white/30">
              <div className="text-white font-bold text-xs">147</div>
              <div className="text-gray-300 text-[8px]">Vandaag</div>
            </div>
          </div>
          
          {/* Kitchen Stations */}
          <div className="bg-white/20 rounded-lg p-1.5 border border-white/30">
            <h3 className="text-white font-semibold text-[10px] mb-1">Station Status</h3>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-green-600/20 rounded p-1 border border-green-500/30">
                <div className="text-green-300 text-[9px] font-semibold">Grill</div>
                <div className="text-white text-[8px]">3 orders</div>
              </div>
              <div className="bg-yellow-600/20 rounded p-1 border border-yellow-500/30">
                <div className="text-yellow-300 text-[9px] font-semibold">Pizza</div>
                <div className="text-white text-[8px]">5 orders</div>
              </div>
              <div className="bg-blue-600/20 rounded p-1 border border-blue-500/30">
                <div className="text-blue-300 text-[9px] font-semibold">Salades</div>
                <div className="text-white text-[8px]">2 orders</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "management",
      title: t('benefits3.screens.management.title'),
      description: t('benefits3.screens.management.description'),
      content: (
        <div className="h-full bg-gray-900 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-sm">Management Dashboard</h2>
            <div className="bg-gray-600/30 px-2 py-0.5 rounded-full border border-gray-500/50">
              <span className="text-gray-300 text-[10px] font-semibold">Admin Panel • Restaurant Manager</span>
            </div>
          </div>
          
          {/* Management Modules Grid */}
          <div className="grid grid-cols-3 gap-1 mb-1">
            <div className="bg-white/20 hover:bg-white/25 rounded-lg p-1.5 transition-colors border border-white/30 cursor-pointer">
              <div className="text-sm mb-0.5">📋</div>
              <div className="text-white font-semibold text-[9px]">Menu Beheer</div>
              <div className="text-gray-300 text-[7px]">47 items • 6 cat.</div>
              <div className="text-green-400 text-[7px] mt-0.5">3 updates vandaag</div>
            </div>
            <div className="bg-white/20 hover:bg-white/25 rounded-lg p-1.5 transition-colors border border-white/30 cursor-pointer">
              <div className="text-sm mb-0.5">👥</div>
              <div className="text-white font-semibold text-[9px]">Personeel</div>
              <div className="text-gray-300 text-[7px]">8 actief • 2 pauze</div>
              <div className="text-blue-400 text-[7px] mt-0.5">Shift tot 23:00</div>
            </div>
            <div className="bg-white/20 hover:bg-white/25 rounded-lg p-1.5 transition-colors border border-white/30 cursor-pointer">
              <div className="text-sm mb-0.5">🏪</div>
              <div className="text-white font-semibold text-[9px]">Tafelbeheer</div>
              <div className="text-gray-300 text-[7px]">24 tafels • 18 bezet</div>
              <div className="text-yellow-400 text-[7px] mt-0.5">75% bezetting</div>
            </div>
            <div className="bg-white/20 hover:bg-white/25 rounded-lg p-1.5 transition-colors border border-white/30 cursor-pointer">
              <div className="text-sm mb-0.5">⚙️</div>
              <div className="text-white font-semibold text-[9px]">Instellingen</div>
              <div className="text-gray-300 text-[7px]">Systeem config</div>
              <div className="text-gray-400 text-[7px] mt-0.5">v2.4.1</div>
            </div>
            <div className="bg-white/20 hover:bg-white/25 rounded-lg p-1.5 transition-colors border border-white/30 cursor-pointer">
              <div className="text-sm mb-0.5">💰</div>
              <div className="text-white font-semibold text-[9px]">Financiën</div>
              <div className="text-gray-300 text-[7px]">€12.4k deze week</div>
              <div className="text-green-400 text-[7px] mt-0.5">+18% vs vorige</div>
            </div>
            <div className="bg-white/20 hover:bg-white/25 rounded-lg p-1.5 transition-colors border border-white/30 cursor-pointer">
              <div className="text-sm mb-0.5">📊</div>
              <div className="text-white font-semibold text-[9px]">Rapporten</div>
              <div className="text-gray-300 text-[7px]">Export • Analytics</div>
              <div className="text-purple-400 text-[7px] mt-0.5">Nieuw rapport</div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white/20 rounded-lg p-1.5 border border-white/30 mb-1">
            <h3 className="text-white font-semibold text-[9px] mb-1">Snelle Acties</h3>
            <div className="grid grid-cols-4 gap-0.5">
              <button className="bg-green-600/30 hover:bg-green-600/40 rounded p-1 border border-green-500/40 transition-colors">
                <div className="text-green-300 text-[8px] font-medium">+ Menu</div>
              </button>
              <button className="bg-blue-600/30 hover:bg-blue-600/40 rounded p-1 border border-blue-500/40 transition-colors">
                <div className="text-blue-300 text-[8px] font-medium">QR Codes</div>
              </button>
              <button className="bg-purple-600/30 hover:bg-purple-600/40 rounded p-1 border border-purple-500/40 transition-colors">
                <div className="text-purple-300 text-[8px] font-medium">Promoties</div>
              </button>
              <button className="bg-orange-600/30 hover:bg-orange-600/40 rounded p-1 border border-orange-500/40 transition-colors">
                <div className="text-orange-300 text-[8px] font-medium">Reserv.</div>
              </button>
            </div>
          </div>
          
          {/* System Status */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-white/20 rounded-lg p-1 border border-white/30">
              <h3 className="text-white font-semibold text-[9px] mb-1">Systeem Status</h3>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-[7px]">QR System</span>
                  <span className="text-green-300 text-[7px] font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-[7px]">Payment</span>
                  <span className="text-green-300 text-[7px] font-medium">Actief</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-[7px]">Kitchen</span>
                  <span className="text-green-300 text-[7px] font-medium">Connected</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 rounded-lg p-1 border border-white/30">
              <h3 className="text-white font-semibold text-[9px] mb-1">Recent Activity</h3>
              <div className="space-y-0.5 text-[7px]">
                <div>
                  <div className="text-gray-300">Menu update: Pizza prijzen</div>
                  <div className="text-gray-500">2 min geleden</div>
                </div>
                <div>
                  <div className="text-gray-300">Nieuwe reservering: 19:30</div>
                  <div className="text-gray-500">15 min geleden</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ], [t]);

  return (
    <section
      id="benefits-3"
      className="relative w-full h-screen flex items-center justify-center shrink-0 overflow-hidden"
    >
        {/* Main content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full pt-20 lg:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">

          {/* Left side - Video */}
          <div className="relative flex items-center justify-start order-1 lg:order-1">
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transform: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `perspective(1000px) rotateX(-5deg) rotateY(15deg) rotateZ(-3deg)` : 'none',
                transformStyle: 'preserve-3d'
              }}
            >
              <video 
                autoPlay
                muted
                playsInline
                controls={false}
                className="w-full h-full object-contain rounded-lg shadow-lg"
                style={{ 
                  width: '700px', 
                  height: '560px',
                  maxWidth: '100%',
                  minWidth: '400px',
                  minHeight: '320px',
                  background: 'transparent'
                }}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
                onError={(e) => console.error('Video error:', e)}
                onEnded={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.currentTime = video.duration - 0.1;
                  video.pause();
                }}
              >
                <source src="/videos/Export_Video_2025-08-07-ultraaamax.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>

          {/* Right side - Description & Features */}
          <div className="space-y-4 order-2 lg:order-2 max-h-full overflow-hidden lg:-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                {t('benefits3.title')}
              </h2>
              <p className="text-white/90 text-lg drop-shadow-md mb-4">
                {t('benefits3.subtitle')}
              </p>
            </motion.div>

            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl shadow-xl h-32"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent pointer-events-none"></div>
                <div className="relative p-6 z-10 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-3"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                      }}>
                    Alles-in-één dashboard voor restaurantbeheer
                  </h3>
                  <p className="text-white/95 text-base leading-relaxed"
                     style={{
                       textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                     }}>
                    Live bestellingen, analytics, keuken management en meer in één overzichtelijk systeem
                  </p>
                </div>
              </motion.div>

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
                
                <div className="relative p-6 z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-white mb-2"
                        style={{
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}>
                      {t('benefits3.moreFeaturesTitle')}
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.div 
                      className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.mobileOptimization.title')}
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.mobileOptimization.description')}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg border border-green-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-green-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.dashboardAnalysis.title')}
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.dashboardAnalysis.description')}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-purple-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-purple-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.inventoryLink.title')}
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.inventoryLink.description')}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg border border-orange-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.07 14H2.72c-.18 0-.35-.07-.47-.2A.67.67 0 012 13.33c0-.18.08-.35.25-.47L9.93 6c.12-.12.3-.2.47-.2.18 0 .35.08.47.2l7.68 6.86c.17.12.25.3.25.47 0 .18-.08.35-.25.47-.12.13-.3.2-.47.2h-1.35" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-orange-100 transition-colors"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.serviceNotification.title')}
                        </p>
                        <p className="text-xs text-white/85 group-hover:text-white/95 transition-colors"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.serviceNotification.description')}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
              </div>
            </motion.div>
            {/* Bottom accent line - moved outside card for correct alignment */}
            <div className="flex flex-col items-center w-full mt-4">
              {/* Removed border line between sections */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};