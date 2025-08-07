import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ClickSpark from "../../components/ClickSpark"

// Import theme images and background
import theme1 from "../../assets/afbeeldingen/Themes/theme1.png"
import theme2 from "../../assets/afbeeldingen/Themes/theme2.png"
import theme3 from "../../assets/afbeeldingen/Themes/theme3.png"
import theme4 from "../../assets/afbeeldingen/Themes/theme4.png"
import backgroundImage from "../../assets/afbeeldingen/achtergrond.png"

interface Theme {
  id: number
  name: string
  nameEn: string
  image: string
  description: { nl: string; en: string }
  accentColor: string
}

const themes: Theme[] = [
  {
    id: 1,
    name: "Mediterraans Seafood",
    nameEn: "Mediterranean Seafood",
    image: theme1,
    description: {
      nl: "Een verfijnde app voor zeevruchten restaurants met mediterrane flair",
      en: "A refined app for seafood restaurants with Mediterranean flair"
    },
    accentColor: "#dc2626"  // Red
  },
  {
    id: 2,
    name: "Artisan Coffee House",
    nameEn: "Artisan Coffee House",
    image: theme2,
    description: {
      nl: "Perfect voor specialty coffee shops en artisan cafés",
      en: "Perfect for specialty coffee shops and artisan cafés"
    },
    accentColor: "#16a34a"  // Green
  },
  {
    id: 3,
    name: "Premium Spirits Bar",
    nameEn: "Premium Spirits Bar",
    image: theme3,
    description: {
      nl: "Luxe app design voor premium bars en cocktail lounges",
      en: "Luxury app design for premium bars and cocktail lounges"
    },
    accentColor: "#ec4899"  // Pink
  },
  {
    id: 4,
    name: "French Patisserie",
    nameEn: "French Patisserie",
    image: theme4,
    description: {
      nl: "Traditionele Franse patisserie met artisan gebak",
      en: "Traditional French patisserie with artisan pastries"
    },
    accentColor: "#f59e0b"  // Orange
  }
];

const RestaurantThemesPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(0)
  const [language, setLanguage] = useState<"nl" | "en">("nl")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Visibility detection for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleThemeChange = (themeIndex: number) => {
    if (themeIndex === currentTheme || isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTheme(themeIndex)
      setIsTransitioning(false)
    }, 150)
  }

  const currentThemeData = themes[currentTheme]

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-20"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(44,30,26,0.95) 0%, rgba(44,30,26,0.8) 20%, rgba(44,30,26,0.6) 40%, rgba(44,30,26,0.4) 70%, rgba(44,30,26,0.2) 100%), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Background Elements with gentle candlelight pulse */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-amber-200/25 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200/15 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-6">
            {language === "nl" ? "Maatwerk App Designs" : "Custom App Designs"}
          </h2>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {language === "nl" 
              ? "Wij creëren unieke app designs op maat voor jouw restaurant. Elke stijl, elke sfeer, perfect afgestemd op jouw merk."
              : "We create unique custom app designs for your restaurant. Any style, any atmosphere, perfectly tailored to your brand."}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: 1.5, 
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94] // Gentle ease-out
            }}
            className="relative flex-shrink-0"
          >
            {/* Warm Glow Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: [0, 0.6, 0] } : {}}
              transition={{ 
                duration: 2,
                delay: 0.5,
                ease: "easeInOut"
              }}
              className="absolute inset-0 -z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-[4rem] blur-3xl"></div>
            </motion.div>
            {/* Phone Frame with subtle breathing animation */}
            <motion.div 
              animate={isVisible ? {
                scale: [1, 1.02, 1],
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl"
            >
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 rounded-t-[2.5rem] flex items-center justify-between px-6 text-white text-xs">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>

                {/* Theme Screenshot */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTheme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className="pt-6 h-full"
                  >
                    <img
                      src={currentThemeData.image}
                      alt={currentThemeData.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x600/f3f4f6/6b7280?text=${encodeURIComponent(currentThemeData.name)}`;
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Floating Theme Selector with subtle float */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { 
                opacity: 1, 
                y: [0, -5, 0] 
              } : {}}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.6 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/30 hover:border-white/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  {themes.map((theme, index) => (
                    <ClickSpark key={theme.id} sparkColor={theme.accentColor} sparkRadius={12} sparkCount={6} duration={300}>
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.8 + (index * 0.1), // Staggered appearance
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        onClick={() => handleThemeChange(index)}
                        className={`w-5 h-5 rounded-full transition-all duration-300 relative shadow-lg hover:shadow-xl ${
                          currentTheme === index 
                            ? 'scale-125 ring-2 ring-white/80 ring-offset-2 ring-offset-transparent' 
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: theme.accentColor }}
                    >
                      {currentTheme === index && (
                        <motion.div
                          layoutId="activeTheme"
                          className="absolute inset-0 rounded-full shadow-lg"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      )}
                      </motion.button>
                    </ClickSpark>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Theme Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-md"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTheme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg" style={{ color: currentThemeData.accentColor }}>
                    {language === "nl" ? currentThemeData.name : currentThemeData.nameEn}
                  </h3>
                  <p className="text-amber-100 leading-relaxed drop-shadow-md">
                    {language === "nl" ? currentThemeData.description.nl : currentThemeData.description.en}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
                  <h4 className="font-semibold mb-2 text-white drop-shadow-lg">
                    {language === "nl" ? "Design voorbeelden:" : "Design examples:"}
                  </h4>
                  <p className="text-sm text-white/90 drop-shadow-md">
                    {language === "nl" 
                      ? "Dit zijn voorbeelden van onze maatwerk designs. Elk project wordt volledig aangepast aan jouw specifieke wensen en merkidentiteit."
                      : "These are examples of our custom designs. Each project is fully tailored to your specific requirements and brand identity."}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">
            {language === "nl" 
              ? "Klaar om jouw unieke app design te creëren?" 
              : "Ready to create your unique app design?"}
          </h3>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
            {language === "nl"
              ? "Elk design wordt volledig op maat gemaakt voor jouw restaurant. Van kleuren tot layout, alles past perfect bij jouw merk."
              : "Every design is completely custom-made for your restaurant. From colors to layout, everything fits perfectly with your brand."}
          </p>
          
          <div className="flex justify-center">
            <ClickSpark sparkColor="#FFD382" sparkRadius={25} sparkCount={10} duration={600}>
              <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg">
                {language === "nl" ? "Start je project" : "Start your project"}
              </button>
            </ClickSpark>
          </div>
        </motion.div>
      </div>
      {/* Enhanced smooth transition to next section (pricing) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#2C1E1A]/60 to-[#2C1E1A] z-10"></div>
    </section>
  )
}

export default RestaurantThemesPage