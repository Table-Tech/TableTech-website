import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Users, Menu, BarChart3, Clock, CheckCircle, Euro, TrendingUp, AlertCircle, Coffee } from 'lucide-react';

export const LaptopMockup: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-lg mx-auto transform scale-100 hover:scale-105 transition-transform duration-300">
      {/* Laptop Frame */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14]">
        {/* Camera notch */}
        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1a0f0a] rounded-full z-10 border border-[#4a3425]"></div>
        
        <div className="w-full bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14] rounded-xl p-2 pt-3 pb-2">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner">
            {/* Browser Bar */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer"></div>
              </div>
              <div className="flex-1 mx-6">
                <div className="bg-white rounded-full px-5 py-1.5 text-xs text-gray-700 flex items-center shadow-sm">
                  <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">tabletech.app</span>
                  <span className="text-gray-500 ml-1">/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content - Alleen de afbeelding */}
            <div className="h-56 overflow-hidden">
              <img 
                src="/images/backgrounds/preview (17).jpg" 
                alt="Dashboard preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};