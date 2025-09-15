import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const [currentTheme, setCurrentTheme] = useState(0)
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

  // Basic theme change handler (placeholder for future implementation)
  const handleThemeChange = useCallback((themeIndex: number) => {
    if (themeIndex === currentTheme || isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTheme(themeIndex)
      setIsTransitioning(false)
    }, 150)
  }, [currentTheme, isTransitioning])

  const currentThemeData = themes[currentTheme]

  // Prevent unused variable warnings by consuming them
  useEffect(() => {
    // Future theme implementation logic will go here
    console.debug('Current theme:', currentThemeData?.name, 'Handler:', handleThemeChange)
  }, [currentThemeData, handleThemeChange])

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
            <span dangerouslySetInnerHTML={{ __html: t('experienceTitles.orderingExperience') }} />
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
            {/* Modern Bezel-free Phone - Scaled down with more frame */}
            <div className="relative" style={{ width: '274px', height: '596px' }}>
              {/* Modern Phone Body - Dark and Minimal with thicker frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-[2.5rem] shadow-2xl">
                {/* Subtle edge highlight */}
                <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10"></div>
                
                {/* Screen - Reduced frame around the edges */}
                <div className="absolute inset-2 bg-black rounded-[2rem] overflow-hidden">
                  {/* Video Content - Full Screen */}
                  <video 
                    src="/videos/client-demo.mp4"
                    className="w-full h-full object-cover rounded-[2rem]"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
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