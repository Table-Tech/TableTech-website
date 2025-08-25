import React, { useEffect, useState } from "react";
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
  // State voor window dimensions om responsiviteit dynamisch te maken
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);

  // Update window dimensions on resize - REALTIME TRACKING
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    // Ook orientation change detecteren voor mobiele apparaten
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Universele iPad schaal berekening - clean en groot maar netjes
  const getIPadDashboardScale = () => {
    // iPad Pro 1024x1366 specifieke behandeling - meer ruimte beschikbaar
    if (windowWidth === 1024 && windowHeight === 1366) {
      const titleHeight = 80;
      const buttonContainerHeight = 160; // Meer ruimte voor knoppen
      const frameVisibilityMargin = 60; // Extra marges voor clean look
      const safetyPadding = 30;
      
      const totalReservedSpace = titleHeight + buttonContainerHeight + frameVisibilityMargin + safetyPadding;
      const availableSpace = windowHeight - totalReservedSpace;
      const laptopTotalHeight = 776;
      const calculatedScale = availableSpace / laptopTotalHeight;
      
      // iPad Pro kan groter dashboard aan - maak het nog groter
      return Math.min(Math.max(calculatedScale, 0.6), 1.0);
    }
    
    // Surface Pro 912x1368 specifieke behandeling
    if (windowWidth === 912 && windowHeight === 1368) {
      const titleHeight = 80;
      const buttonContainerHeight = 140; // Ruimte voor knoppen
      const frameVisibilityMargin = 80; // Grote marges zodat frames goed zichtbaar zijn
      const safetyPadding = 40;
      
      const totalReservedSpace = titleHeight + buttonContainerHeight + frameVisibilityMargin + safetyPadding;
      const availableSpace = windowHeight - totalReservedSpace;
      const laptopTotalHeight = 776;
      const calculatedScale = availableSpace / laptopTotalHeight;
      
      // Surface Pro dashboard nog meer uitgezoomed
      return Math.min(Math.max(calculatedScale, 0.45), 0.7);
    }
    
    // Tablet 853x1280 specifieke behandeling
    if (windowWidth === 853 && windowHeight === 1280) {
      const titleHeight = 80;
      const buttonContainerHeight = 140; // Ruimte voor knoppen
      const frameVisibilityMargin = 75; // Goede marges voor frame zichtbaarheid
      const safetyPadding = 35;
      
      const totalReservedSpace = titleHeight + buttonContainerHeight + frameVisibilityMargin + safetyPadding;
      const availableSpace = windowHeight - totalReservedSpace;
      const laptopTotalHeight = 776;
      const calculatedScale = availableSpace / laptopTotalHeight;
      
      // Tablet 853x1280 uitgezoomed dashboard
      return Math.min(Math.max(calculatedScale, 0.45), 0.7);
    }
    
    // Universele instellingen voor andere iPads
    const titleHeight = 80; // Compactere titel
    const buttonContainerHeight = 140; // Ruimte voor knoppen container
    const frameVisibilityMargin = 40; // Marges zodat frames zichtbaar blijven
    const safetyPadding = 20; // Extra veiligheid
    
    // Bereken beschikbare ruimte voor dashboard
    const totalReservedSpace = titleHeight + buttonContainerHeight + frameVisibilityMargin + safetyPadding;
    const availableSpace = windowHeight - totalReservedSpace;
    
    // Laptop mockup totale hoogte (768px dashboard + 8px frame)
    const laptopTotalHeight = 776;
    const calculatedScale = availableSpace / laptopTotalHeight;
    
    // iPad specifieke schaal grenzen - iets uitgezoomed voor betere overview
    const minScale = 0.35; // Kleiner minimum voor meer overview
    const maxScale = 0.65; // Kleiner maximum - meer uitgezoomed
    
    return Math.min(Math.max(calculatedScale, minScale), maxScale);
  };

  // Bereken optimale dashboard schaal - RESPONSIEF OP BREEDTE EN HOOGTE
  const getOptimalDashboardScale = () => {
    if (windowWidth >= 1024) return 0.75; // Desktop
    
    // iPad, Surface Pro en tablet specifieke optimalisatie
    if (windowWidth === 768 || windowWidth === 820 || windowWidth === 853 || windowWidth === 912 || windowWidth === 1024) {
      return getIPadDashboardScale();
    }
    
    const availableHeight = window.innerHeight;
    const availableWidth = windowWidth;
    
    // Specifieke behandeling voor bekende formaten
    if (availableWidth === 375 && availableHeight === 667) {
      return 0.24; // iPhone SE
    }
    
    // Bereken schaal op basis van BEIDE dimensies
    const titleHeight = 100; // Compactere titel voor kleine schermen
    const buttonsHeight = availableHeight < 600 ? 100 : 120; // Minder ruimte op zeer kleine schermen
    const frameMargin = availableHeight < 600 ? 40 : 60; // Kleinere margin op kleine schermen
    const padding = availableHeight < 600 ? 15 : 20; // Minder padding
    
    const availableForDashboard = availableHeight - titleHeight - buttonsHeight - frameMargin - padding;
    const baseDashboardHeight = 500;
    
    // Bereken schaal op basis van hoogte
    const heightScale = availableForDashboard / baseDashboardHeight;
    
    // Bereken schaal op basis van breedte (dashboard heeft ook breedte beperkingen)
    const baseDashboardWidth = 600; // Geschatte dashboard breedte
    const widthScale = (availableWidth - 40) / baseDashboardWidth; // -40px voor padding
    
    // Gebruik de kleinste schaal om beide dimensies te respecteren
    const maxScale = Math.min(heightScale, widthScale);
    
    // Aangepaste schalen voor verschillende schermgroottes
    let minScale, maxAllowedScale;
    
    if (availableHeight < 600) {
      // Zeer kleine schermen (hoogte)
      minScale = 0.12;
      maxAllowedScale = 0.20;
    } else if (availableHeight < 700) {
      // Kleine schermen
      minScale = 0.16;
      maxAllowedScale = 0.25;
    } else {
      // Normale schermen
      minScale = availableWidth < 320 ? 0.16 : 
                availableWidth < 360 ? 0.20 :
                availableWidth < 375 ? 0.22 : 0.24;
      maxAllowedScale = availableWidth < 375 ? 0.26 : 
                       availableWidth < 414 ? 0.30 : 0.35;
    }
    
    return Math.max(minScale, Math.min(maxScale, maxAllowedScale));
  };

  // Bereken responsive knopgrootte gebaseerd op schermafmetingen
  const getButtonScale = () => {
    const availableWidth = windowWidth;
    const availableHeight = window.innerHeight;
    
    // iPad Pro 1024x1366 specifiek - grotere knoppen
    if (availableWidth === 1024 && availableHeight === 1366) {
      return 1.5; // 50% groter voor iPad Pro
    }
    
    // Bereken schaal gebaseerd op kleinste dimensie voor proportionele scaling
    const baseWidth = 375; // iPhone standaard breedte als referentie
    const baseHeight = 667; // iPhone standaard hoogte als referentie
    
    const widthScale = availableWidth / baseWidth;
    const heightScale = availableHeight / baseHeight;
    
    // Gebruik de kleinste schaal om beide dimensies te respecteren
    const scale = Math.min(widthScale, heightScale);
    
    // Beperk schaal tussen min en max waarden
    const minScale = 0.7; // Minimaal 70% van origineel
    const maxScale = 1.2; // Maximaal 120% van origineel
    
    return Math.max(minScale, Math.min(scale, maxScale));
  };

  // Bereken responsive padding en tekst grootte
  const getResponsiveButtonStyles = () => {
    const scale = getButtonScale();
    
    return {
      padding: `${8 * scale}px ${16 * scale}px`, // Responsive padding
      fontSize: `${14 * scale}px`, // Responsive tekst grootte
      borderRadius: `${6 * scale}px`, // Responsive border radius
      containerPadding: `${12 * scale}px`, // Container padding
      gap: `${8 * scale}px`, // Gap tussen knoppen
      maxWidth: `${320 * scale}px` // Responsive container breedte
    };
  };

    // Bereken dynamische positie voor knoppen - VAST CONTAINER ONDER LAPTOP MOCKUP
  const getButtonPosition = () => {
    if (windowWidth >= 1280) return -9999; // Desktop: verberg mobile knoppen volledig
    
    // Gebruik tracked window dimensions voor realtime updates
    const availableHeight = windowHeight;
    const availableWidth = windowWidth;
    const scale = getOptimalDashboardScale();
    
    // TELEFOON/TABLET DETECTIE
    const isTablet = availableWidth >= 768 && availableWidth < 1024;
    
    // EXACTE DASHBOARD DETECTIE - REALTIME TRACKING
    const titleHeight = 100;
    const topPadding = 30;
    const mobileOffset = isTablet ? -20 : -40;
    
    // Bereken complete laptop hoogte inclusief frame
    const laptopBaseHeight = 768 * scale; // Basis laptop hoogte
    const laptopBottomFrame = 8 * scale; // Gray bars onderaan (5px + 3px)
    const totalLaptopHeight = laptopBaseHeight + laptopBottomFrame;
    
    const laptopStartY = titleHeight + topPadding + mobileOffset;
    const laptopEndY = laptopStartY + totalLaptopHeight;
    
    // CONSERVATIEVE POSITIONERING - ALTIJD ONDER LAPTOP
    let safeGap = 170; // Standaard gap
    
    // Kleine telefoons - knoppen meer naar beneden
    if (availableWidth < 400 && availableHeight < 700) {
      safeGap = 220; // Meer ruimte onder dashboard voor kleine telefoons
    }
    
    // Tablet specifieke aanpassing - universele iPad behandeling
    if (isTablet) {
      // Universele iPad instellingen voor alle formaten
      if (availableWidth === 1024 && availableHeight === 1366) {
        // iPad Pro 1024x1366 - knoppen nog meer omhoog
        safeGap = -1000; // Nog hoger voor knoppen
      } else if (availableWidth === 912 && availableHeight === 1368) {
        // Surface Pro 912x1368 - knoppen netjes onder dashboard
        safeGap = 30; // Kleine, nette gap onder dashboard
      } else if (availableWidth === 853 && availableHeight === 1280) {
        // Tablet 853x1280 - knoppen netjes onder dashboard
        safeGap = 30; // Kleine, nette gap onder dashboard
      } else if (availableWidth >= 768 && availableWidth <= 1024) {
        // Voor andere iPads - consistente, kleine gap voor clean look
        safeGap = 25; // Kleine, nette witruimte onder dashboard
      } else {
        safeGap = 50; // Standaard tablet gap voor andere tablets
      }
    }
    
    const buttonContainerTop = laptopEndY + safeGap;
    
    // iPad Pro 1024x1366 - geen beperkingen voor knoppen positie
    if (availableWidth === 1024 && availableHeight === 1366) {
      return buttonContainerTop; // Geen restricties voor iPad Pro
    }
    
    // Zorg dat knoppen binnen scherm blijven (andere apparaten)
    const containerHeight = 120;
    const maxSafePosition = availableHeight - containerHeight - 20;
    
    // Voor kleine schermen: gebruik percentage als nodig
    if (buttonContainerTop > maxSafePosition) {
      // Als absolute positie te laag is, gebruik percentage
      const laptopEndPercentage = (laptopEndY / availableHeight) * 100;
      return Math.min(laptopEndPercentage + 8, 85); // Max 85% van schermhoogte
    }
    
    // Return absolute pixel positie
    return buttonContainerTop;
  };
  // Disable Lenis when demo is open to prevent conflicts with normal scrolling
  useEffect(() => {
    if (isOpen) {
      // Disable Lenis smooth scrolling during demo
      if (window.lenis) {
        window.lenis.stop();
      }
      
      return () => {
        // Re-enable Lenis when demo closes
        if (window.lenis) {
          window.lenis.start();
        }
      };
    }
  }, [isOpen]);

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
            {/* Close button - HOGER GEPLAATST */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute top-3 right-3 z-60 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-110" // top-3 right-3 i.p.v. top-6 right-6
              aria-label="Demo sluiten"
            >
              <X size={24} />
            </motion.button>

            {/* Demo title - HOGER GEPLAATST */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-3 left-1/2 transform -translate-x-1/2 text-center text-white z-10" // top-3 i.p.v. top-6
            >
              <h2 className="text-xl md:text-2xl font-bold mb-1">Dashboard Demo - TableTech</h2>
              <p className="text-white/80 text-sm max-w-md">Volledig restaurant management dashboard</p>
            </motion.div>

            {/* Main content area - GEPOSITIONEERD MET ZICHTBARE FRAMES */}
            <div 
              className="flex items-start lg:items-center justify-center w-full h-full pt-0 lg:pt-20 pb-6 gap-0 -mt-16 lg:mt-0"
              style={{
                // iPad Pro 1024x1366 specifiek - dashboard 3x hoger
                marginTop: windowWidth === 1024 && windowHeight === 1366 ? '-660px' : 
                          windowWidth < 1280 ? '-16px' : '0'
              }}
            >
              {/* Left Demo Features panel - VERBORGEN OP MOBIEL EN TABLET VOOR MEER RUIMTE */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                className="hidden xl:flex flex-col w-48 max-h-[300px] flex-shrink-0 relative z-20 -mr-32"
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

              {/* Center - Laptop mockup - OPTIMAAL GESCHAALD VOOR TELEFOON */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ 
                  scale: getOptimalDashboardScale(), // Gebruik intelligente schaal functie
                  opacity: 1 
                }}
                transition={{ delay: 0.3, type: "spring", damping: 20, stiffness: 300 }}
                className="flex-shrink-0 transform relative z-10"
                style={{
                  marginTop: windowWidth < 1024 ? '-40px' : '0' // Extra omhoog op mobiel
                }}
              >
                <ComputerMock />
              </motion.div>

              {/* Right Demo Navigation panel - VERBORGEN OP MOBIEL EN TABLET VOOR MEER RUIMTE */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                className="hidden xl:flex flex-col w-52 max-h-[300px] flex-shrink-0 relative z-20 -ml-32"
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

            {/* Mobile/Tablet bottom controls - VASTE CONTAINER ONDER DASHBOARD */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", damping: 25, stiffness: 200 }}
              className="xl:hidden fixed left-4 right-4 z-50"
              style={{ 
                // Altijd absolute pixel positionering voor precisie
                top: `${getButtonPosition()}px`,
                position: 'fixed',
                height: '120px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <div 
                className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-xl mx-auto w-full"
                style={{
                  padding: getResponsiveButtonStyles().containerPadding,
                  maxWidth: getResponsiveButtonStyles().maxWidth,
                  borderRadius: getResponsiveButtonStyles().borderRadius,
                  minHeight: '110px', // Minimum container hoogte
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start' // Inhoud aan bovenkant
                }}
              >
                <div 
                  className="flex flex-col"
                  style={{ gap: getResponsiveButtonStyles().gap }}
                >
                  <button
                    onClick={onClose}
                    className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white rounded-md font-medium transition-all duration-200 border border-white/30"
                    style={{
                      padding: getResponsiveButtonStyles().padding,
                      fontSize: getResponsiveButtonStyles().fontSize,
                      borderRadius: getResponsiveButtonStyles().borderRadius
                    }}
                  >
                    ← Terug naar homepage
                  </button>
                  <button
                    onClick={onSwitchToCustomer}
                    className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white rounded-md font-medium transition-all duration-200 shadow-lg"
                    style={{
                      padding: getResponsiveButtonStyles().padding,
                      fontSize: getResponsiveButtonStyles().fontSize,
                      borderRadius: getResponsiveButtonStyles().borderRadius
                    }}
                  >
                    Demo klant →
                  </button>
                </div>
                <div 
                  className="text-center border-t border-white/20 mt-auto"
                  style={{ 
                    marginTop: getResponsiveButtonStyles().gap,
                    paddingTop: getResponsiveButtonStyles().gap
                  }}
                >
                  <p 
                    className="text-white/70"
                    style={{ fontSize: `${parseFloat(getResponsiveButtonStyles().fontSize) * 0.85}px` }}
                  >
                    TableTech Dashboard Demo • Volledig functioneel
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoOverlay;
