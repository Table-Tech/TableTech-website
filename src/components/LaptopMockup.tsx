import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Users, Menu, BarChart3, Clock, CheckCircle, Euro, TrendingUp, AlertCircle, Coffee } from 'lucide-react';

export const LaptopMockup: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full mx-auto transform hover:scale-105 transition-transform duration-300"
         style={{ 
           maxWidth: 'min(90vw, 400px)',
           aspectRatio: '16/10'
         }}>
      {/* Laptop Frame */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14]">
        {/* Camera notch */}
        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 bg-[#1a0f0a] rounded-full z-10 border border-[#4a3425]"
             style={{
               width: 'clamp(4px, 0.5vw, 8px)',
               height: 'clamp(4px, 0.5vw, 8px)'
             }}></div>
        
        <div className="w-full h-full bg-gradient-to-b from-[#3b2a1d] to-[#2f1d14] rounded-xl"
             style={{ padding: 'clamp(4px, 0.8vw, 8px) clamp(4px, 0.8vw, 8px) clamp(4px, 0.8vw, 8px)' }}>
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-inner flex flex-col">
            {/* Browser Bar */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0"
                 style={{ 
                   padding: 'clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px)',
                   height: 'clamp(16px, 2.5vw, 24px)'
                 }}>
              <div className="flex items-center"
                   style={{ gap: 'clamp(2px, 0.3vw, 4px)' }}>
                <div className="bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                     style={{
                       width: 'clamp(4px, 0.6vw, 8px)',
                       height: 'clamp(4px, 0.6vw, 8px)'
                     }}></div>
                <div className="bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"
                     style={{
                       width: 'clamp(4px, 0.6vw, 8px)',
                       height: 'clamp(4px, 0.6vw, 8px)'
                     }}></div>
                <div className="bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer"
                     style={{
                       width: 'clamp(4px, 0.6vw, 8px)',
                       height: 'clamp(4px, 0.6vw, 8px)'
                     }}></div>
              </div>
              <div className="flex-1"
                   style={{ margin: '0 clamp(4px, 1vw, 12px)' }}>
                <div className="bg-white rounded-full text-gray-700 flex items-center shadow-sm"
                     style={{ 
                       padding: 'clamp(1px, 0.3vw, 3px) clamp(4px, 1vw, 10px)',
                       fontSize: 'clamp(6px, 1vw, 9px)'
                     }}>
                  <svg className="text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20"
                       style={{ 
                         width: 'clamp(4px, 0.6vw, 8px)',
                         height: 'clamp(4px, 0.6vw, 8px)'
                       }}>
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">tabletech.app</span>
                  <span className="text-gray-500 ml-1">/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content - Responsive afbeelding */}
            <div className="flex-1 overflow-hidden flex items-center justify-center">
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