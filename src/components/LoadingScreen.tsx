import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 flex items-center justify-center">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(168, 162, 158, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 162, 158, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Logo Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="relative">
            {/* Main Logo Container */}
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 via-amber-100 to-stone-100 rounded-lg flex items-center justify-center shadow-2xl border border-amber-300/20">
              <span className="text-3xl font-bold bg-gradient-to-br from-stone-800 to-amber-900 bg-clip-text text-transparent">TT</span>
            </div>
            
            {/* Subtle Corner Accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-amber-400/60 rounded-tl"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-amber-400/60 rounded-tr"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-amber-400/60 rounded-bl"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-amber-400/60 rounded-br"></div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-amber-100 mb-3 tracking-wide">TableTech</h1>
          <p className="text-stone-400 text-base font-medium">Restaurant Management Solutions</p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Simple Progress Bar */}
          <div className="w-80 h-1 bg-stone-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2.5,
                ease: "easeOut"
              }}
            />
          </div>

          {/* Loading Text */}
          <p className="text-stone-300 text-sm font-medium tracking-wide">
            Loading your experience...
          </p>
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center gap-3 text-stone-500 text-xs"
        >
          <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
          <span className="font-medium">Powered by TableTech</span>
          <div className="w-1 h-1 bg-amber-400/60 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;