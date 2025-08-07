import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Users, Menu, BarChart3, Settings, Clock, CheckCircle, Euro, TrendingUp, AlertCircle, Coffee, Star } from 'lucide-react';

export const LaptopMockup: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-md mx-auto transform scale-100 hover:scale-105 transition-transform duration-300">
      {/* Laptop Frame */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14]">
        {/* Camera notch */}
        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1a0f0a] rounded-full z-10 border border-[#4a3425]"></div>
        
        <div className="w-full bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14] rounded-xl p-2 pt-3 pb-2">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner">
            {/* Browser Bar */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 flex items-center justify-between px-3 py-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-full px-4 py-1.5 text-xs text-gray-700 flex items-center shadow-sm">
                  <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">tabletech.app</span>
                  <span className="text-gray-500 ml-1">/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-56 overflow-hidden">
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-28 bg-white border-r border-gray-200 shadow-sm">
                  <div className="p-4 bg-gradient-to-br from-[#7b4f35] to-[#5e3b29] text-white text-center">
                    <h1 className="text-sm font-bold tracking-wide">{t('dashboard.tabletech')}</h1>
                  </div>
                  <nav className="p-2 space-y-1.5">
                    <div className="bg-gradient-to-r from-[#7b4f35] to-[#6d4530] text-white px-2 py-2 rounded-lg text-[10px] flex items-center shadow-sm">
                      <Home className="w-3 h-3 mr-1.5" />
                      <span className="font-medium">{t('dashboard.home')}</span>
                    </div>
                    <div className="text-gray-700 px-2 py-2 rounded-lg text-[10px] flex items-center hover:bg-gray-50 transition-colors">
                      <Users className="w-3 h-3 mr-1.5 text-gray-500" />
                      <span>{t('dashboard.tables')}</span>
                    </div>
                    <div className="text-gray-700 px-2 py-2 rounded-lg text-[10px] flex items-center hover:bg-gray-50 transition-colors">
                      <Menu className="w-3 h-3 mr-1.5 text-gray-500" />
                      <span>{t('dashboard.menu')}</span>
                    </div>
                    <div className="text-gray-700 px-2 py-2 rounded-lg text-[10px] flex items-center hover:bg-gray-50 transition-colors">
                      <BarChart3 className="w-3 h-3 mr-1.5 text-gray-500" />
                      <span>{t('dashboard.data')}</span>
                    </div>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-3 pr-6 pb-4 overflow-hidden">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center mb-1">
                          <Euro className="w-3 h-3 text-emerald-600" />
                        </div>
                        <p className="text-[9px] text-gray-500">{t('dashboard.revenueToday')}</p>
                        <p className="text-sm font-bold text-gray-900">€847.30</p>
                        <p className="text-[8px] text-emerald-600 flex items-center">
                          <TrendingUp className="w-2 h-2 mr-0.5" />
                          +12.5%
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center mb-1">
                          <Users className="w-3 h-3 text-amber-600" />
                        </div>
                        <p className="text-[9px] text-gray-500">{t('dashboard.activeTables')}</p>
                        <p className="text-sm font-bold text-gray-900">6/15</p>
                        <p className="text-[8px] text-amber-600">40% {t('dashboard.occupied')}</p>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-1">
                          <Coffee className="w-3 h-3 text-blue-600" />
                        </div>
                        <p className="text-[9px] text-gray-500">{t('dashboard.orders')}</p>
                        <p className="text-sm font-bold text-gray-900">127</p>
                        <p className="text-[8px] text-blue-600">{t('dashboard.today')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Orders */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-3">
                    <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-[11px] font-semibold text-gray-800">{t('dashboard.liveOrders')}</h3>
                      <div className="flex items-center text-[10px] text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>17:27</span>
                      </div>
                    </div>
                    <div className="p-3 pr-6 pb-4 space-y-2.5">
                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-gray-100 hover:to-gray-50 transition-colors mr-1">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#7b4f35] to-[#5e3b29] text-white rounded-lg text-[9px] font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                            T2
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="text-[10px] font-semibold text-gray-800 truncate">{t('dashboard.margheritaPizza')}</div>
                            <div className="text-[9px] text-gray-500">17:23 • €12.45</div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="px-2 py-1 rounded-full text-[8px] font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
                            {t('dashboard.preparing')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-gray-100 hover:to-gray-50 transition-colors mr-1">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#7b4f35] to-[#5e3b29] text-white rounded-lg text-[9px] font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                            T4
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="text-[10px] font-semibold text-gray-800">{t('dashboard.pepperoniPizza')}</div>
                            <div className="text-[9px] text-gray-500">17:15 • €11.50</div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="px-2 py-1 rounded-full text-[8px] font-medium bg-emerald-100 text-emerald-700 whitespace-nowrap">
                            {t('dashboard.ready')}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3"></div>

                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-gray-100 hover:to-gray-50 transition-colors mr-1">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#7b4f35] to-[#5e3b29] text-white rounded-lg text-[9px] font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                            T8
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="text-[10px] font-semibold text-gray-800">{t('dashboard.chickenKatsuCurry')}</div>
                            <div className="text-[9px] text-gray-500">17:25 • €10.50</div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="px-2 py-1 rounded-full text-[8px] font-medium bg-amber-100 text-amber-700 whitespace-nowrap">
                            {t('dashboard.waiting')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Content Row */}
                  <div className="grid grid-cols-2 gap-3 mt-3 mb-3 mr-2">
                    {/* Mini Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                      <h4 className="text-[9px] font-semibold text-gray-700 mb-1">{t('dashboard.revenueTrend')}</h4>
                      <div className="h-12 bg-gradient-to-t from-emerald-50 to-white rounded flex items-end justify-around px-1">
                        <div className="w-2 bg-emerald-400 rounded-t" style={{height: '40%'}}></div>
                        <div className="w-2 bg-emerald-400 rounded-t" style={{height: '60%'}}></div>
                        <div className="w-2 bg-emerald-400 rounded-t" style={{height: '45%'}}></div>
                        <div className="w-2 bg-emerald-500 rounded-t" style={{height: '80%'}}></div>
                        <div className="w-2 bg-emerald-500 rounded-t" style={{height: '65%'}}></div>
                        <div className="w-2 bg-emerald-600 rounded-t" style={{height: '90%'}}></div>
                        <div className="w-2 bg-emerald-600 rounded-t" style={{height: '85%'}}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[7px] text-gray-500">Ma</span>
                        <span className="text-[7px] text-gray-500">Zo</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                      <h4 className="text-[9px] font-semibold text-gray-700 mb-1">{t('dashboard.quickActions')}</h4>
                      <div className="space-y-1">
                        <button className="w-full bg-[#7b4f35] text-white text-[8px] py-1 px-2 rounded flex items-center justify-center hover:bg-[#6d4530]">
                          <AlertCircle className="w-2.5 h-2.5 mr-1" />
                          {t('dashboard.newOrder')}
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 text-[8px] py-1 px-2 rounded flex items-center justify-center hover:bg-gray-200">
                          <Users className="w-2.5 h-2.5 mr-1" />
                          {t('dashboard.reserveTable')}
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 text-[8px] py-1 px-2 rounded flex items-center justify-center hover:bg-gray-200">
                          <CheckCircle className="w-2.5 h-2.5 mr-1" />
                          {t('dashboard.closeDay')}
                        </button>
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