import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ComputerMock from "./ComputerMock";

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
  // Block/unblock body scroll when overlay opens/closes
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
            transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.5 }}
            className="flex items-center justify-center w-full max-w-[98vw] h-full px-4 py-8"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
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
              <h2 className="text-xl md:text-2xl font-bold mb-1">Dashboard Demo - TableTech</h2>
              <p className="text-white/80 text-sm max-w-md">Volledig restaurant management dashboard</p>
            </motion.div>

            {/* Main content area */}
            <div className="flex items-center justify-center w-full h-full pt-20 pb-6 gap-0">
              {/* Left Demo Features panel */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                className="flex flex-col w-48 max-h-[300px] flex-shrink-0 relative z-20 -mr-32"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-white h-full border border-white/20 shadow-2xl">
                  <h3 className="text-sm font-bold mb-3 text-white">Demo Features:</h3>
                  <ul className="space-y-2 text-white">
                    <li className="flex items-start"><span className="text-white mr-2">•</span><span className="text-xs">Klik menu tabs</span></li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span><span className="text-xs">Selecteer tafels</span></li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span><span className="text-xs">Test functionaliteit</span></li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span><span className="text-xs">Live statistieken</span></li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span><span className="text-xs">Dashboard elementen</span></li>
                  </ul>
                </div>
              </motion.div>

              {/* Center - Laptop mockup */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 0.75, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 20, stiffness: 300 }}
                className="flex-shrink-0 transform relative z-10"
              >
                <ComputerMock />
              </motion.div>

              {/* Right Demo Navigation panel */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                className="flex flex-col w-52 max-h-[300px] flex-shrink-0 relative z-20 -ml-32"
              >
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-white h-full border border-white/20 shadow-2xl flex flex-col">
                  <h3 className="text-sm font-bold mb-3 text-white">Demo navigatie</h3>
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
                      className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-3 py-2 rounded-md font-medium transition-all duration-200 shadow-lg text-xs"
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
                    className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-3 py-2 rounded-md font-medium transition-all duration-200 shadow-lg text-xs"
                  >
                    Demo klant →
                  </button>
                </div>
                <div className="text-xs text-white/80 text-center">TableTech Dashboard Demo • Volledig functioneel</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoOverlay;
