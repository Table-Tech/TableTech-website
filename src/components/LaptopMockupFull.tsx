import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Users, Menu, BarChart3, Clock, Euro, TrendingUp, Coffee } from 'lucide-react';

interface LaptopMockupFullProps {
  className?: string;
}

export const LaptopMockupFull: React.FC<LaptopMockupFullProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`relative w-full max-w-2xl mx-auto transform transition-transform duration-300 ${className}`}>
      {/* Laptop Frame */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14]">
        {/* Camera notch */}
        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1a0f0a] rounded-full z-10 border border-[#4a3425]"></div>
        
        <div className="w-full bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14] rounded-xl p-3 pt-4 pb-3">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner">
            {/* Browser Bar */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer"></div>
              </div>
              <div className="flex-1 mx-6">
                <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-700 flex items-center shadow-sm">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">tabletech.app</span>
                  <span className="text-gray-500 ml-1">/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-96 overflow-hidden">
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-40 bg-white border-r border-gray-200 shadow-sm">
                  <div className="p-4 bg-gradient-to-br from-[#7b4f35] to-[#5e3b29] text-white text-center">
                    <h1 className="text-base font-bold tracking-wide">{t('dashboard.tabletech')}</h1>
                  </div>
                  <nav className="p-3 space-y-2">
                    <div className="bg-gradient-to-r from-[#7b4f35] to-[#6d4530] text-white px-3 py-2 rounded-lg text-sm flex items-center shadow-sm">
                      <Home className="w-4 h-4 mr-2" />
                      <span className="font-medium">{t('dashboard.home')}</span>
                    </div>
                    <div className="text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{t('dashboard.tables')}</span>
                    </div>
                    <div className="text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                      <Menu className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{t('dashboard.menu')}</span>
                    </div>
                    <div className="text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                      <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{t('dashboard.data')}</span>
                    </div>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{t('dashboard.overview')}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>17:27</span>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center mb-2">
                          <Euro className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.revenueToday')}</p>
                        <p className="text-lg font-bold text-gray-900">€2,847</p>
                        <p className="text-xs text-emerald-600 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          +18%
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center mb-2">
                          <Users className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.activeTables')}</p>
                        <p className="text-lg font-bold text-gray-900">18/24</p>
                        <p className="text-xs text-amber-600">75% {t('dashboard.occupied')}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-2">
                          <Coffee className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.orders')}</p>
                        <p className="text-lg font-bold text-gray-900">127</p>
                        <p className="text-xs text-blue-600">{t('dashboard.today')}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mb-2">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className="text-lg font-bold text-gray-900">4.9⭐</p>
                        <p className="text-xs text-purple-600">+0.2</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Orders and Analytics */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Live Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-800">{t('dashboard.liveOrders')}</h3>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="p-4 space-y-3 max-h-40 overflow-y-auto">
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center justify-center">
                              T7
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">2x {t('dashboard.margheritaPizza')}</div>
                              <div className="text-xs text-gray-500">15m • €24.90</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 animate-pulse">
                            URGENT
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-white rounded-lg border border-yellow-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-600 text-white rounded-lg text-xs font-bold flex items-center justify-center">
                              T3
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{t('dashboard.chickenKatsuCurry')}</div>
                              <div className="text-xs text-gray-500">5m • €16.50</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            {t('dashboard.preparing')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center">
                              T12
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">Pasta Carbonara</div>
                              <div className="text-xs text-gray-500">Ready • €14.50</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {t('dashboard.ready')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Revenue This Week</h3>
                        <p className="text-xs text-green-600">+23% vs last week</p>
                      </div>
                      <div className="p-4">
                        <div className="h-32 bg-gradient-to-t from-blue-50 to-white rounded flex items-end justify-around px-2">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                            <span className="text-xs text-gray-500">Ma</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-400 rounded-t" style={{height: '45%'}}></div>
                            <span className="text-xs text-gray-500">Di</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-500 rounded-t" style={{height: '75%'}}></div>
                            <span className="text-xs text-gray-500">Wo</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-500 rounded-t" style={{height: '55%'}}></div>
                            <span className="text-xs text-gray-500">Do</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-600 rounded-t" style={{height: '90%'}}></div>
                            <span className="text-xs text-gray-500">Vr</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-600 rounded-t" style={{height: '100%'}}></div>
                            <span className="text-xs text-gray-500">Za</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-4 bg-blue-700 rounded-t" style={{height: '85%'}}></div>
                            <span className="text-xs text-gray-500">Zo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopMockupFull;
