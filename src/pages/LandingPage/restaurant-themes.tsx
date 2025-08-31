import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ClickSpark from "../../components/ClickSpark"

// Images moved to public: /images/Themes/ and /images/backgrounds/

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
    image: "/images/Themes/theme1.webp",
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
    image: "/images/Themes/theme2.webp",
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
    image: "/images/Themes/theme3.webp",
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
    image: "/images/Themes/theme4.webp",
    description: {
      nl: "Traditionele Franse patisserie met artisan gebak",
      en: "Traditional French patisserie with artisan pastries"
    },
    accentColor: "#f59e0b"  // Orange
  }
];

const RestaurantThemesPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      className="relative min-h-screen py-20 restaurant-themes-section"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(44,30,26,0.95) 0%, rgba(44,30,26,0.8) 20%, rgba(44,30,26,0.6) 40%, rgba(44,30,26,0.4) 70%, rgba(44,30,26,0.2) 100%), url(/images/backgrounds/achtergrond.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }}
    >
      
      {/* Background Elements with gentle candlelight pulse */}
      <div className="absolute inset-0 overflow-hidden">
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-6">
            {language === "nl" ? (
              <>
                Jouw <span className="text-[#E86C28]">Bestel</span> Ervaring
              </>
            ) : (
              <>
                Your <span className="text-[#E86C28]">Ordering</span> Experience
              </>
            )}
          </h2>
        </motion.div>

        {/* Phone Mockup */}
        <div className="flex justify-center mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: 1.5, 
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="relative"
          >
            {/* Realistic Phone Frame - iPhone Style */}
            <div className="relative w-72 h-[540px] lg:w-64 lg:h-[480px]">
              {/* Phone Body with realistic materials */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E86C28] via-[#D2581F] to-[#B8471A] rounded-[3rem] shadow-2xl">
                {/* Metallic edge highlight */}
                <div className="absolute inset-0 rounded-[3rem] ring-1 ring-[#E86C28]/30 shadow-inner"></div>
                
                {/* Camera bump (top center) */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-br from-gray-700 to-black rounded-2xl shadow-lg">
                  <div className="absolute top-1 left-2 w-4 h-4 bg-gradient-to-br from-blue-900 to-black rounded-full ring-1 ring-gray-600"></div>
                  <div className="absolute top-1.5 right-2 w-3 h-3 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full"></div>
                </div>
                
                {/* Screen bezel */}
                <div className="absolute inset-2 bg-black rounded-[2.5rem] shadow-2xl">
                  {/* Screen */}
                  <div className="absolute inset-[2px] bg-white rounded-[2.3rem] overflow-hidden">
                    
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-black rounded-full z-30 shadow-lg">
                      {/* Front camera */}
                      <div className="absolute top-1.5 left-6 w-2 h-2 bg-gray-800 rounded-full"></div>
                      {/* Speaker */}
                      <div className="absolute top-2.5 right-6 w-4 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                    
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-black z-20 rounded-t-[2.3rem] flex items-center justify-between px-6 pt-3">
                      <div className="flex items-center space-x-1 text-white text-xs font-medium">
                        <span>9:41</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {/* Signal bars */}
                        <div className="flex space-x-0.5">
                          <div className="w-1 h-3 bg-white rounded-full"></div>
                          <div className="w-1 h-4 bg-white rounded-full"></div>
                          <div className="w-1 h-5 bg-white rounded-full"></div>
                          <div className="w-1 h-6 bg-white rounded-full"></div>
                        </div>
                        {/* WiFi */}
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                        </svg>
                        {/* Battery */}
                        <div className="relative">
                          <div className="w-6 h-3 border border-white rounded-sm bg-white">
                            <div className="w-4 h-1.5 bg-green-500 rounded-sm m-0.5"></div>
                          </div>
                          <div className="absolute -right-0.5 top-0.5 w-0.5 h-2 bg-white rounded-r"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60"></div>
                    
                    {/* Phone Content - Empty for now */}
                    <div className="absolute inset-0 pt-12 pb-4 px-1">
                      <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center rounded-[2rem]">
                        <div className="text-center text-gray-400">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                            📱
                          </div>
                          <p className="text-sm font-medium">Content komt binnenkort</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Enhanced smooth transition to next section (container-scroll) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#2C1E1A]/60 to-[#2C1E1A] z-10"></div>
    </section>
  )
}

export default RestaurantThemesPage