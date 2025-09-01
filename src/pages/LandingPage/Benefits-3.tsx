import React, { useMemo, useRef, useEffect, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHasStarted, setVideoHasStarted] = useState(false);
  const [videoHasCompleted, setVideoHasCompleted] = useState(false);
  const hasTriggeredOnce = useRef(false); // Nieuwe ref om te voorkomen dat video opnieuw start

  useEffect(() => {
    // Alleen observer maken als video nog nooit is gestart
    if (hasTriggeredOnce.current || videoHasStarted || videoHasCompleted) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Alleen starten als nog nooit geactiveerd EN nog niet gestart
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3 && !hasTriggeredOnce.current && !videoHasStarted) {
            const video = videoRef.current;
            if (video && !hasTriggeredOnce.current) {
              // Permanent markeren dat video is geactiveerd voor deze sessie
              hasTriggeredOnce.current = true;
              setVideoHasStarted(true);
              video.currentTime = 0;
              
              // Maak video persistent - blijft spelen ongeacht scroll positie
              video.setAttribute('data-persistent-play', 'true');
              
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.warn("Video auto-play failed:", error);
                });
              }
            }
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px 0px 0px'
      }
    );

    const element = document.getElementById('benefits-3');
    if (element && !hasTriggeredOnce.current) {
      observer.observe(element);
    }

    // Continue video playback zelfs als de sectie uit beeld gaat - maar alleen als video al gestart is
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoHasStarted && !videoHasCompleted) {
        const video = videoRef.current;
        if (video && video.paused && video.hasAttribute('data-persistent-play')) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Silent fail
            });
          }
        }
      }
    };

    const handlePageShow = () => {
      if (videoHasStarted && !videoHasCompleted) {
        const video = videoRef.current;
        if (video && video.paused && video.hasAttribute('data-persistent-play')) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Silent fail
            });
          }
        }
      }
    };

    // Continue video playback zelfs als de sectie uit beeld gaat
    const handleScroll = () => {
      if (videoHasStarted && !videoHasCompleted) {
        const video = videoRef.current;
        if (video && video.paused && video.hasAttribute('data-persistent-play')) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Silent fail
            });
          }
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
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handlePageShow);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('blur', handleBlur);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handlePageShow);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('blur', handleBlur);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - this effect should only run once

  const handleVideoEnded = () => {
    // Permanent markeren dat video is voltooid
    setVideoHasCompleted(true);
    
    // Remove persistent play attribute - video is done
    const video = videoRef.current;
    if (video) {
      video.removeAttribute('data-persistent-play');
    }
    
    // Direct smooth fade naar afbeelding via CSS transitions (1 seconde)
  };

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
      className="relative w-full min-h-screen flex items-center justify-center shrink-0 overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28"
    >
        {/* Main content - Mobile first approach with smaller desktop layout */}
        <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12 max-w-[1920px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10 2xl:gap-12 items-center">

          {/* Left side - Video - Hidden on mobile and tablets, only visible on desktop - Smaller sizing */}
          <div className="hidden lg:flex relative items-center justify-center order-1 lg:order-1">
            <motion.div
              className="relative lg:w-[70%] lg:max-w-[400px] xl:w-[75%] xl:max-w-[450px] 2xl:w-[80%] 2xl:max-w-[500px]"
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
              <div className="relative w-full h-full">
                {/* Video Element - Enhanced sizing for desktop */}
                <video 
                  ref={videoRef}
                  autoPlay={false}
                  muted
                  playsInline
                  controls={false}
                  webkit-playsinline="true"
                  preload="metadata"
                  poster="/images/hero-images/telefoon.webp"
                  className="absolute inset-0 w-full h-auto object-contain rounded-lg shadow-lg transition-all duration-2000 ease-in-out"
                  style={{ 
                    display: videoHasCompleted ? 'none' : 'block',
                    maxWidth: '100%',
                    height: 'auto',
                    background: 'transparent',
                    transform: videoHasCompleted ? 'scale(0.95)' : 'scale(1)',
                    filter: videoHasCompleted ? 'blur(2px)' : 'blur(0px)'
                  }}
                  onEnded={handleVideoEnded}
                  onError={() => {
                    // Silent error handling
                  }}
                >
                  <source src="/videos/output_frame_perfect_transparent.webm" type="video/webm; codecs=vp9" />
                  <source src="/videos/Export_Video_2025-08-07-ultraaamax.webm" type="video/webm; codecs=vp9" />
                  Your browser does not support the video tag.
                </video>

                {/* Static Image - Enhanced sizing for desktop */}
                <img
                  src="/images/backgrounds/ipad-foto.png"
                  alt="TableTech Dashboard Interface"
                  className="w-full h-auto object-contain rounded-lg shadow-lg transition-all duration-2000 ease-in-out"
                  style={{ 
                    display: videoHasCompleted ? 'block' : 'none',
                    maxWidth: '100%',
                    height: 'auto',
                    transform: videoHasCompleted ? 'scale(1)' : 'scale(1.05)',
                    filter: videoHasCompleted ? 'blur(0px)' : 'blur(2px)'
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right side - Description & Features - Mobile optimized, smaller desktop layout */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-6 xl:space-y-7 2xl:space-y-8 order-2 md:order-2 lg:h-full lg:justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5 leading-tight lg:leading-[1.1] drop-shadow-lg">
                {t('benefits3.title')}
              </h2>
              <p className="text-white/90 text-sm xs:text-base sm:text-lg md:text-base lg:text-base xl:text-lg 2xl:text-xl mb-3 sm:mb-4 md:mb-6 lg:mb-5 xl:mb-6 leading-relaxed lg:leading-relaxed drop-shadow-md">
                {t('benefits3.subtitle')}
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-5 xl:space-y-6 2xl:space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[120px] xl:min-h-[130px] 2xl:min-h-[140px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent pointer-events-none"></div>
                <div className="relative p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 2xl:p-8 z-10 h-full flex flex-col justify-center">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                      }}>
                    Alles-in-één dashboard voor restaurantbeheer
                  </h3>
                  <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl leading-relaxed lg:leading-relaxed"
                     style={{
                       textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                     }}>
                    Live bestellingen, analytics, keuken management en meer in één overzichtelijk systeem
                  </p>
                </div>
              </motion.div>

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
                
                <div className="relative p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8 2xl:p-10 z-10">
                  <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5"
                        style={{
                          textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                        }}>
                      {t('benefits3.moreFeaturesTitle')}
                    </h3>
                    <div className="w-12 sm:w-16 md:w-20 lg:w-20 xl:w-24 2xl:w-28 h-0.5 md:h-1 lg:h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6 2xl:gap-7">
                    <motion.div 
                      className="flex items-center space-x-3 sm:space-x-4 lg:space-x-4 xl:space-x-5 p-3 sm:p-4 md:p-5 lg:p-5 xl:p-6 2xl:p-7 rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[80px] xl:min-h-[90px] 2xl:min-h-[100px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 min-w-[44px] min-h-[44px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl font-semibold text-white group-hover:text-blue-100 transition-colors mb-1 lg:mb-2 xl:mb-2"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.mobileOptimization.title')}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg text-white/85 group-hover:text-white/95 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.mobileOptimization.description')}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 sm:space-x-4 lg:space-x-4 xl:space-x-5 p-3 sm:p-4 md:p-5 lg:p-5 xl:p-6 2xl:p-7 rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[80px] xl:min-h-[90px] 2xl:min-h-[100px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 min-w-[44px] min-h-[44px] bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-green-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl font-semibold text-white group-hover:text-green-100 transition-colors mb-1 lg:mb-2 xl:mb-2"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.dashboardAnalysis.title')}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg text-white/85 group-hover:text-white/95 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.dashboardAnalysis.description')}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 sm:space-x-4 lg:space-x-4 xl:space-x-5 p-3 sm:p-4 md:p-5 lg:p-5 xl:p-6 2xl:p-7 rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[80px] xl:min-h-[90px] 2xl:min-h-[100px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 min-w-[44px] min-h-[44px] bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-purple-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl font-semibold text-white group-hover:text-purple-100 transition-colors mb-1 lg:mb-2 xl:mb-2"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.inventoryLink.title')}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg text-white/85 group-hover:text-white/95 transition-colors leading-snug lg:leading-relaxed"
                           style={{
                             textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                           }}>
                          {t('benefits3.features.inventoryLink.description')}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 sm:space-x-4 lg:space-x-4 xl:space-x-5 p-3 sm:p-4 md:p-5 lg:p-5 xl:p-6 2xl:p-7 rounded-xl lg:rounded-2xl transition-all duration-300 hover:bg-white/10 group cursor-pointer min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[80px] xl:min-h-[90px] 2xl:min-h-[100px]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 min-w-[44px] min-h-[44px] bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg border border-orange-400/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.07 14H2.72c-.18 0-.35-.07-.47-.2A.67.67 0 012 13.33c0-.18.08-.35.25-.47L9.93 6c.12-.12.3-.2.47-.2.18 0 .35.08.47.2l7.68 6.86c.17.12.25.3.25.47 0 .18-.08.35-.25.47-.12.13-.3.2-.47.2h-1.35" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl font-semibold text-white group-hover:text-orange-100 transition-colors mb-1 lg:mb-2 xl:mb-2"
                           style={{
                             textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                           }}>
                          {t('benefits3.features.serviceNotification.title')}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg text-white/85 group-hover:text-white/95 transition-colors leading-snug lg:leading-relaxed"
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
            {/* Bottom accent line - Smaller for desktop */}
            <div className="flex flex-col items-center w-full mt-4 sm:mt-6 md:mt-8 lg:mt-8 xl:mt-10">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-3 xl:space-x-4">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};