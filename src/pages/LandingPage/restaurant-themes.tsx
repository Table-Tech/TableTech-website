import React, { useState, useEffect, useRef } from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Snowflake, 
  Croissant, 
  Utensils, 
  Play, 
  Pause, 
  Globe,
  Star,
  Clock,
  Grid,
  Smartphone
} from "lucide-react"

// Enhanced UI Components with all new features
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-sm",
    lg: "h-12 px-8 py-3",
    icon: "h-10 w-10"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Type definitions
interface ThemeCategory {
  nl: string
  en: string
  icon: string
}

interface ThemeItem {
  name: { nl: string; en: string }
  price: string
  image: string
  rating?: number
  popular?: boolean
  calories?: number
  prepTime?: number
}

interface Theme {
  id: number
  name: string
  nameEn: string
  color: string
  bgColor: string
  bgImage?: string
  headerColor: string
  categories: ThemeCategory[]
  items: ThemeItem[]
  description: { nl: string; en: string }
  rating: number
  downloads: number
  version: string
}

const themes: Theme[] = [
  {
    id: 1,
    name: "Mediterraans Seafood",
    nameEn: "Mediterranean Seafood",
    color: "from-blue-400 to-teal-500",
    bgColor: "bg-cover bg-center",
    bgImage: "src/assets/afbeeldingen/beach.png",
    headerColor: "bg-blue-500",
    description: {
      nl: "Een verfijnde app voor zeevruchten restaurants met mediterrane flair",
      en: "A refined app for seafood restaurants with Mediterranean flair"
    },
    rating: 4.8,
    downloads: 1247,
    version: "2.3.1",
    categories: [
      { nl: "Vis", en: "Fish", icon: "🐟" },
      { nl: "Zeevruchten", en: "Shellfish", icon: "🦐" },
      { nl: "Salades", en: "Salads", icon: "🥗" },
      { nl: "Soepen", en: "Soups", icon: "🍲" },
    ],
    items: [
      {
        name: { nl: "Gegrilde Zeebaars", en: "Grilled Sea Bass" },
        price: "€24.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled-fish-u3U1XCADVetX66E1cJIh5czogYn2Je.png",
        rating: 4.9,
        popular: true,
        calories: 285,
        prepTime: 20
      },
      {
        name: { nl: "Garnalen Scampi", en: "Shrimp Scampi" },
        price: "€18.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shrimp-0LmDnJVOiwfP8YBrEiLnRmW4dr6I6w.png",
        rating: 4.7,
        calories: 320,
        prepTime: 15
      },
      {
        name: { nl: "Zeevruchten Paella", en: "Seafood Paella" },
        price: "€32.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paella-HHvXuGM9E700Wa0JA98VDUELzTfB55.png",
        rating: 4.8,
        popular: true,
        calories: 450,
        prepTime: 35
      },
      {
        name: { nl: "Kreeftensoep", en: "Lobster Soup" },
        price: "€28.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lobster-soup-FsnvmcUYFTHx5pJWa4VRslEb9Fk63R.png",
        rating: 4.9,
        popular: true,
        calories: 320,
        prepTime: 25
      },
    ],
  },
  {
    id: 2,
    name: "Artisan Coffee House",
    nameEn: "Artisan Coffee House",
    color: "from-amber-600 to-orange-700",
    bgColor: "bg-cover bg-center",
    bgImage: "src/assets/afbeeldingen/koffie.png",
    headerColor: "bg-amber-600",
    description: {
      nl: "Perfect voor specialty coffee shops en artisan cafés",
      en: "Perfect for specialty coffee shops and artisan cafés"
    },
    rating: 4.9,
    downloads: 2156,
    version: "3.1.0",
    categories: [
      { nl: "Koffie", en: "Coffee", icon: "coffee" },
      { nl: "Dranken", en: "Drinks", icon: "snowflake" },
      { nl: "Gebak", en: "Pastries", icon: "croissant" },
      { nl: "Ontbijt", en: "Breakfast", icon: "utensils" },
    ],
    items: [
      {
        name: { nl: "Espresso Doppio", en: "Double Espresso" },
        price: "€3.20",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-pour-ymlWAw9FjlnZHlOrPTHNGcoGwAJvR0.png",
        rating: 4.8,
        popular: true,
        calories: 10,
        prepTime: 3
      },
      {
        name: { nl: "Cappuccino Deluxe", en: "Deluxe Cappuccino" },
        price: "€4.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/latte-art-4ERbYE98xd9x4m7767Q1Dw5jTQMlWh.png",
        rating: 4.9,
        popular: true,
        calories: 150,
        prepTime: 5
      },
      {
        name: { nl: "Croissant Amandel", en: "Almond Croissant" },
        price: "€3.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/croissants-xaPRIimoQpXVqpcbFZa35MUzmKuBJY.png",
        rating: 4.6,
        calories: 380,
        prepTime: 8
      },
    ],
  },
  {
    id: 3,
    name: "Premium Spirits Bar",
    nameEn: "Premium Spirits Bar",
    color: "from-gray-800 to-yellow-600",
    bgColor: "bg-gradient-to-br from-gray-900 to-yellow-900",
    headerColor: "bg-gray-800",
    description: {
      nl: "Luxe app design voor premium bars en cocktail lounges",
      en: "Luxury app design for premium bars and cocktail lounges"
    },
    rating: 4.7,
    downloads: 891,
    version: "1.8.5",
    categories: [
      { nl: "Whisky", en: "Whiskey", icon: "🍯" },
      { nl: "Cocktails", en: "Cocktails", icon: "🍸" },
      { nl: "Bier", en: "Beer", icon: "🍺" },
      { nl: "Wijn", en: "Wine", icon: "🍷" },
    ],
    items: [
      {
        name: { nl: "Macallan 18", en: "Macallan 18" },
        price: "€18.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/macallan-ctNr7eJ3nbNAit2nRa8YOoHcHenaH3.png",
        rating: 4.9,
        popular: true
      },
      {
        name: { nl: "Old Fashioned Whisky", en: "Old Fashioned Whisky" },
        price: "€12.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EssVFIky0EQZqQjulap0bxsnwEa57x.png",
        rating: 4.8
      },
      {
        name: { nl: "Craft IPA", en: "Craft IPA" },
        price: "€6.80",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/craft-ipa-5gPHtMglCzFgMPXvTEaIaanUvqincN.png",
        rating: 4.6
      },
      {
        name: { nl: "Premium Bourbon", en: "Premium Bourbon" },
        price: "€22.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lxQGJ3TRZei28MFCqZAdcXMo45MH8u.png",
        rating: 4.8,
        popular: true
      },
    ],
  },
  {
    id: 4,
    name: "Asian Fusion",
    nameEn: "Asian Fusion",
    color: "from-green-400 to-blue-500",
    bgColor: "bg-cover bg-center",
    bgImage: "src/assets/afbeeldingen/green-leaves.jpg",
    headerColor: "bg-green-500",
    description: {
      nl: "Moderne Aziatische keuken met een eigentijdse twist",
      en: "Modern Asian cuisine with a contemporary twist"
    },
    rating: 4.6,
    downloads: 1523,
    version: "2.1.3",
    categories: [
      { nl: "Sushi", en: "Sushi", icon: "🍣" },
      { nl: "Ramen", en: "Ramen", icon: "🍜" },
      { nl: "Dim Sum", en: "Dim Sum", icon: "🥟" },
      { nl: "Wok", en: "Wok", icon: "🥢" },
    ],
    items: [
      {
        name: { nl: "Sashimi Selectie", en: "Sashimi Selection" },
        price: "€32.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled-fish-u3U1XCADVetX66E1cJIh5czogYn2Je.png",
        rating: 4.8,
        popular: true,
        calories: 280,
        prepTime: 15
      },
      {
        name: { nl: "Tonkotsu Ramen", en: "Tonkotsu Ramen" },
        price: "€16.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shrimp-0LmDnJVOiwfP8YBrEiLnRmW4dr6I6w.png",
        rating: 4.7,
        calories: 520,
        prepTime: 20
      },
      {
        name: { nl: "Dim Sum Platter", en: "Dim Sum Platter" },
        price: "€22.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paella-HHvXuGM9E700Wa0JA98VDUELzTfB55.png",
        rating: 4.6,
        calories: 410,
        prepTime: 25
      },
    ],
  },
  {
    id: 5,
    name: "Plant-Based Kitchen",
    nameEn: "Plant-Based Kitchen",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-cover bg-center",
    bgImage: "src/assets/afbeeldingen/Geen-tree.png",
    headerColor: "bg-green-600",
    description: {
      nl: "100% plantaardig restaurant met focus op duurzaamheid",
      en: "100% plant-based restaurant with focus on sustainability"
    },
    rating: 4.5,
    downloads: 967,
    version: "1.6.2",
    categories: [
      { nl: "Bowls", en: "Bowls", icon: "🥗" },
      { nl: "Smoothies", en: "Smoothies", icon: "🥤" },
      { nl: "Vegan", en: "Vegan", icon: "🌱" },
      { nl: "Raw", en: "Raw", icon: "🥒" },
    ],
    items: [
      {
        name: { nl: "Buddha Bowl", en: "Buddha Bowl" },
        price: "€16.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled-fish-u3U1XCADVetX66E1cJIh5czogYn2Je.png",
        rating: 4.6,
        calories: 340,
        prepTime: 12
      },
      {
        name: { nl: "Green Smoothie", en: "Green Smoothie" },
        price: "€7.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cold-drink-M8CqnPx7HmM60XFEWdIciwA2F1coFu.png",
        rating: 4.4,
        calories: 180,
        prepTime: 5
      },
      {
        name: { nl: "Raw Zucchini Pasta", en: "Raw Zucchini Pasta" },
        price: "€14.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paella-HHvXuGM9E700Wa0JA98VDUELzTfB55.png",
        rating: 4.3,
        calories: 220,
        prepTime: 10
      },
    ],
  },
  {
    id: 6,
    name: "French Patisserie",
    nameEn: "French Patisserie",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    headerColor: "bg-pink-500",
    description: {
      nl: "Traditionele Franse patisserie met artisan gebak",
      en: "Traditional French patisserie with artisan pastries"
    },
    rating: 4.8,
    downloads: 1834,
    version: "2.4.1",
    categories: [
      { nl: "Taarten", en: "Cakes", icon: "🎂" },
      { nl: "Macarons", en: "Macarons", icon: "🧁" },
      { nl: "Eclairs", en: "Eclairs", icon: "🥐" },
      { nl: "Chocolade", en: "Chocolate", icon: "🍫" },
    ],
    items: [
      {
        name: { nl: "Opera Taart", en: "Opera Cake" },
        price: "€28.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/croissants-xaPRIimoQpXVqpcbFZa35MUzmKuBJY.png",
        rating: 4.9,
        popular: true,
        calories: 450,
        prepTime: 30
      },
      {
        name: { nl: "Macaron Box 12st", en: "Macaron Box 12pcs" },
        price: "€24.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/latte-art-4ERbYE98xd9x4m7767Q1Dw5jTQMlWh.png",
        rating: 4.7,
        calories: 85,
        prepTime: 15
      },
      {
        name: { nl: "Chocolate Eclair", en: "Chocolate Eclair" },
        price: "€6.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-pour-ymlWAw9FjlnZHlOrPTHNGcoGwAJvR0.png",
        rating: 4.6,
        calories: 320,
        prepTime: 20
      },
      {
        name: { nl: "Mille-feuille", en: "Mille-feuille" },
        price: "€8.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/croissants-xaPRIimoQpXVqpcbFZa35MUzmKuBJY.png",
        rating: 4.5,
        calories: 380,
        prepTime: 25
      },
    ],
  },
  {
    id: 7,
    name: "Neapolitan Pizzeria",
    nameEn: "Neapolitan Pizzeria",
    color: "from-red-500 to-green-600",
    bgColor: "bg-gradient-to-br from-red-50 to-green-50",
    headerColor: "bg-gradient-to-r from-red-500 to-green-500",
    description: {
      nl: "Authentieke Napolitaanse pizza met traditionele recepten",
      en: "Authentic Neapolitan pizza with traditional recipes"
    },
    rating: 4.9,
    downloads: 2234,
    version: "3.2.1",
    categories: [
      { nl: "Pizza", en: "Pizza", icon: "🍕" },
      { nl: "Antipasti", en: "Antipasti", icon: "🫒" },
      { nl: "Pasta", en: "Pasta", icon: "🍝" },
      { nl: "Desserts", en: "Desserts", icon: "🍰" },
    ],
    items: [
      {
        name: { nl: "Margherita DOC", en: "Margherita DOC" },
        price: "€14.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paella-HHvXuGM9E700Wa0JA98VDUELzTfB55.png",
        rating: 4.9,
        popular: true,
        calories: 320,
        prepTime: 12
      },
      {
        name: { nl: "Quattro Stagioni", en: "Quattro Stagioni" },
        price: "€18.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled-fish-u3U1XCADVetX66E1cJIh5czogYn2Je.png",
        rating: 4.8,
        calories: 420,
        prepTime: 15
      },
      {
        name: { nl: "Burrata Antipasto", en: "Burrata Antipasto" },
        price: "€12.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shrimp-0LmDnJVOiwfP8YBrEiLnRmW4dr6I6w.png",
        rating: 4.7,
        calories: 280,
        prepTime: 8
      },
      {
        name: { nl: "Carbonara Classica", en: "Carbonara Classica" },
        price: "€16.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-pour-ymlWAw9FjlnZHlOrPTHNGcoGwAJvR0.png",
        rating: 4.8,
        calories: 450,
        prepTime: 18
      },
    ],
  },
  {
    id: 8,
    name: "Gelato Boutique",
    nameEn: "Gelato Boutique",
    color: "from-cyan-400 to-purple-600",
    bgColor: "bg-cover bg-center",
    bgImage: "src/assets/afbeeldingen/frozen-bubble.png",
    headerColor: "bg-gradient-to-r from-cyan-500 to-purple-600",
    description: {
      nl: "Artisan Italiaans gelato met premium ingrediënten",
      en: "Artisan Italian gelato with premium ingredients"
    },
    rating: 4.7,
    downloads: 1456,
    version: "1.9.4",
    categories: [
      { nl: "Gelato", en: "Gelato", icon: "🍨" },
      { nl: "Sorbet", en: "Sorbet", icon: "🍧" },
      { nl: "Milkshakes", en: "Milkshakes", icon: "🥤" },
      { nl: "Sundaes", en: "Sundaes", icon: "🍦" },
    ],
    items: [
      {
        name: { nl: "Pistachio Gelato", en: "Pistachio Gelato" },
        price: "€4.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cold-drink-M8CqnPx7HmM60XFEWdIciwA2F1coFu.png",
        rating: 4.8,
        popular: true,
        calories: 180,
        prepTime: 2
      },
      {
        name: { nl: "Mango Sorbet", en: "Mango Sorbet" },
        price: "€4.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/latte-art-4ERbYE98xd9x4m7767Q1Dw5jTQMlWh.png",
        rating: 4.6,
        calories: 120,
        prepTime: 2
      },
      {
        name: { nl: "Oreo Chocolate Milkshake", en: "Oreo Chocolate Milkshake" },
        price: "€6.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-pour-ymlWAw9FjlnZHlOrPTHNGcoGwAJvR0.png",
        rating: 4.7,
        calories: 350,
        prepTime: 5
      },
      {
        name: { nl: "Affogato", en: "Affogato" },
        price: "€6.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/macallan-ctNr7eJ3nbNAit2nRa8YOoHcHenaH3.png",
        rating: 4.9,
        calories: 220,
        prepTime: 3
      },
    ],
  }
]

const RestaurantThemesPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [language, setLanguage] = useState<"nl" | "en">("nl")
  const [autoPlay, setAutoPlay] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel')
  
  const autoPlayRef = useRef(autoPlay)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(false)

  // Update ref when state changes
  useEffect(() => {
    autoPlayRef.current = autoPlay
  }, [autoPlay])

  // Auto-play timer setup
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
    } else {
      const setupTimer = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        if (autoPlayRef.current && viewMode === 'carousel') {
          timerRef.current = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % 3) // 3 slides total
            setupTimer()
          }, 4000)
        }
      }

      setupTimer()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [autoPlay, viewMode])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3) // 3 slides total
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3) // 3 slides total
    setAutoPlay(false)
  }

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay)
  }

  const toggleLanguage = () => {
    setLanguage(language === "nl" ? "en" : "nl")
  }

  const getVisibleThemes = () => {
    if (viewMode === 'grid') return themes
    
    // Slide 0: 3 telefoons (0,1,2), Slide 1: 2 telefoons (3,4), Slide 2: 3 telefoons (5,6,7)
    if (currentSlide === 0) {
      return themes.slice(0, 3) // First 3 themes
    } else if (currentSlide === 1) {
      return themes.slice(3, 5) // Next 2 themes
    } else {
      return themes.slice(5, 8) // Last 3 themes
    }
  }

  const renderIcon = (iconType: string, className = "w-3 h-3") => {
    switch (iconType) {
      case "coffee":
        return <Coffee className={className} />
      case "snowflake":
        return <Snowflake className={className} />
      case "croissant":
        return <Croissant className={className} />
      case "utensils":
        return <Utensils className={className} />
      default:
        return <span className="text-xs">{iconType}</span>
    }
  }

  const MobileApp = ({ theme, language }: { 
    theme: Theme; 
    language: "nl" | "en"; 
  }) => {
    // Special layout for Mediterranean Seafood
    if (theme.id === 1) {
      return (
        <div className="relative mx-3">
          <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div 
              className="h-full bg-cover bg-center flex flex-col"
              style={{ 
                backgroundImage: `url(${theme.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* App Header with blue gradient */}
              <div className="bg-gradient-to-r from-blue-400 to-teal-500 text-white p-3 text-center relative">
                <h2 className="text-base font-bold leading-tight text-white drop-shadow-md">
                  {language === "nl" ? theme.name : theme.nameEn}
                </h2>
                <p className="text-xs mt-1 text-white/90">Fresh from the sea</p>
              </div>
              
              {/* Categories - all in a row with WHITE background */}
              <div className="p-3">
                <div className="flex gap-1.5 mb-3">
                  {theme.categories.map((category: ThemeCategory, index: number) => (
                    <div key={index} className="bg-white/90 rounded-lg p-2 text-center shadow-sm flex-1">
                      <span className="text-base">{renderIcon(category.icon, "w-4 h-4") || category.icon}</span>
                      <div className="text-xs mt-1 font-medium leading-tight text-gray-800">{category[language]}</div>
                    </div>
                  ))}
                </div>
                
                {/* Featured Items - Grid layout for 4 items */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {theme.items.slice(0, 4).map((item: ThemeItem, index: number) => (
                    <div key={index} className="bg-white/95 rounded-lg p-2 shadow-lg">
                      <div 
                        className="w-full h-14 bg-gray-200 rounded-md mb-2 bg-cover bg-center shadow-sm"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="text-center">
                        <div className="text-xs font-bold leading-tight mb-1 flex items-center justify-center gap-1">
                          <span className="truncate">{item.name[language]}</span>
                          {item.popular && <span className="text-xs bg-yellow-100 px-1 py-0.5 rounded-full">★</span>}
                        </div>
                        <div className="text-sm font-bold text-green-600">{item.price}</div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          {item.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{item.rating}</span>
                            </div>
                          )}
                          {item.prepTime && (
                            <div className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5 text-gray-400" />
                              <span className="text-xs">{item.prepTime}m</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Now Button - Full width bar at bottom */}
              <div className="mt-auto">
                <div className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 shadow-lg">
                  <span className="text-base font-bold">Order Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Special layout for Artisan Coffee House
    if (theme.id === 2) {
      return (
        <div className="relative mx-3">
          <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div 
              className="h-full bg-cover bg-center flex flex-col"
              style={{ 
                backgroundImage: `url(${theme.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* App Header with coffee gradient */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-3 text-center relative">
                <h2 className="text-base font-bold leading-tight text-white drop-shadow-md">
                  {language === "nl" ? theme.name : theme.nameEn}
                </h2>
                <p className="text-xs mt-1 text-white/90">Premium coffee experience</p>
              </div>
              
              {/* Categories - in CIRCLES */}
              <div className="p-3">
                <div className="flex gap-2 mb-3 justify-center">
                  {theme.categories.map((category: ThemeCategory, index: number) => (
                    <div key={index} className="bg-white/90 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-lg">{renderIcon(category.icon, "w-5 h-5") || category.icon}</span>
                      <div className="text-xs font-medium leading-tight text-gray-800 mt-1">{category[language]}</div>
                    </div>
                  ))}
                </div>
                
                {/* Featured Items - Grid layout */}
                <div className="space-y-2 mb-3">
                  {theme.items.slice(0, 3).map((item: ThemeItem, index: number) => (
                    <div key={index} className="bg-white/95 rounded-lg p-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center shadow-sm"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                        <div className="flex-1">
                          <div className="text-sm font-bold leading-tight mb-1 flex items-center gap-2">
                            <span className="truncate">{item.name[language]}</span>
                            {item.popular && <span className="text-xs bg-yellow-100 px-1 py-0.5 rounded-full">★</span>}
                          </div>
                          <div className="text-lg font-bold text-green-600">{item.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Now Button - Full width bar at bottom */}
              <div className="mt-auto">
                <div className="bg-amber-600 hover:bg-amber-700 text-white text-center py-3 shadow-lg">
                  <span className="text-base font-bold">Order Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Special layout for Premium Spirits Bar
    if (theme.id === 3) {
      return (
        <div className="relative mx-3">
          <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* App Header with yellow-orange gradient */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white p-3 text-center relative">
                <h2 className="text-base font-bold leading-tight text-white drop-shadow-md">
                  {language === "nl" ? theme.name : theme.nameEn}
                </h2>
                <p className="text-xs mt-1 text-white/90">Premium Selection</p>
              </div>
              
              {/* Categories - all in a row with YELLOW-ORANGE background */}
              <div className="p-3">
                <div className="flex gap-1.5 mb-3">
                  {theme.categories.map((category: ThemeCategory, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-yellow-500 to-orange-400 text-white rounded-lg p-2 text-center shadow-sm flex-1">
                      <span className="text-base">{renderIcon(category.icon, "w-4 h-4") || category.icon}</span>
                      <div className="text-xs mt-1 font-medium leading-tight">{category[language]}</div>
                    </div>
                  ))}
                </div>
                
                {/* Featured Items - Horizontal layout like in photo */}
                <div className="space-y-2 mb-2">
                  {theme.items.slice(0, 4).map((item: ThemeItem, index: number) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-2.5 shadow-lg border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-bold leading-tight mb-1 text-white">
                            {item.name[language]}
                            {item.popular && <span className="text-xs bg-yellow-100 text-gray-800 px-1 py-0.5 rounded-full ml-2">★</span>}
                          </div>
                          <div className="text-base font-bold text-yellow-500">{item.price}</div>
                        </div>
                        <div 
                          className="w-11 h-11 bg-gray-700 rounded-lg flex-shrink-0 bg-cover bg-center shadow-sm ml-2"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Premium Order Button - Full width bar at bottom */}
              <div className="mt-auto">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white text-center py-3 shadow-lg">
                  <span className="text-base font-bold">Premium Order</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Special layout for Plant-Based Kitchen
    if (theme.id === 5) {
      return (
        <div className="relative mx-3">
          <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="h-full bg-gradient-to-b from-green-100 to-green-200 flex flex-col">
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* Restaurant Image Container with title overlay */}
              <div className="relative">
                <div 
                  className="w-full h-48 bg-cover bg-center"
                  style={{ 
                    backgroundImage: "url(src/assets/afbeeldingen/greenkitchen.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                ></div>
                {/* Title overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {language === "nl" ? theme.name : theme.nameEn}
                  </h2>
                </div>
              </div>
              
              {/* Categories - 4 Very Small White Rounded Squares */}
              <div className="px-4 py-1">
                <div className="flex justify-between">
                  {theme.categories.map((category: ThemeCategory, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center shadow-lg mb-1">
                        <span className="text-base">{renderIcon(category.icon, "w-4 h-4") || category.icon}</span>
                      </div>
                      <div className="text-green-800 text-xs font-medium">{category[language]}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Menu Items - Very Compact Cards */}
              <div className="px-4 space-y-1.5 mb-2 flex-1">
                {theme.items.slice(0, 3).map((item: ThemeItem, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-2.5 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 bg-gray-200 rounded-full bg-cover bg-center shadow-sm flex-shrink-0"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-800 leading-tight">
                          {item.name[language]}
                        </div>
                        <div className="text-sm font-bold text-green-600">{item.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Bestel Nu Button */}
              <div className="px-4 pb-4">
                <div className="bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-2xl shadow-lg">
                  <span className="text-xl font-bold">
                    {language === "nl" ? "Bestel Nu" : "Order Now"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Special layout for Asian Fusion
    if (theme.id === 4) {
      return (
        <div className="relative mx-3">
          <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div 
              className="h-full flex flex-col"
              style={{
                background: `linear-gradient(135deg, #FFD6A1 0%, #FF9E8C 50%, #FF7070 100%)`
              }}
            >
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* Restaurant Image Container - No overlay text */}
              <div className="p-2.5">
                <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
                  <div 
                    className="w-full h-36 bg-cover bg-center"
                    style={{ 
                      backgroundImage: "url(src/assets/afbeeldingen/restaurant.png)",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Categories - 4 Much smaller transparent circles with large icons */}
              <div className="px-3 mb-2">
                <div className="flex justify-between">
                  {theme.categories.map((category: ThemeCategory, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg mb-1 border border-white/30">
                        <span className="text-white text-2xl drop-shadow-lg">{renderIcon(category.icon, "w-6 h-6") || category.icon}</span>
                      </div>
                      <div className="text-white text-sm font-medium drop-shadow-sm">{category[language]}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Menu Items - NO ratings, only time */}
              <div className="px-3 space-y-1.5 mb-2 flex-1">
                {theme.items.slice(0, 3).map((item: ThemeItem, index: number) => (
                  <div key={index} className="bg-white/95 rounded-xl p-2 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-9 h-9 bg-gray-200 rounded-full bg-cover bg-center shadow-sm flex-shrink-0"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 leading-tight">
                            {item.name[language]}
                          </div>
                          <div className="text-base font-bold text-gray-800">{item.price}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{item.prepTime}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Now Button - Better visible */}
              <div className="px-3 pb-3">
                <div className="bg-orange-700 hover:bg-orange-800 text-white text-center py-3.5 rounded-xl shadow-lg">
                  <span className="text-lg font-bold">Order Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Special layout for French Patisserie
    if (theme.id === 6) {
      return (
        <div className="relative mx-3">
          <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div 
              className="h-full flex flex-col"
              style={{
                background: "linear-gradient(to bottom, #D42F7D, #F27DAA, #FFE6F0)"
              }}
            >
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              
              {/* App Header */}
              <div className="text-white p-4 text-center">
                <h2 className="text-xl font-bold leading-tight">
                  {language === "nl" ? theme.name : theme.nameEn}
                </h2>
              </div>
              
              {/* Categories - 2x2 Grid with rounded rectangles */}
              <div className="px-4 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  {theme.categories.map((category: ThemeCategory, index: number) => (
                    <div key={index} className="bg-white/90 rounded-2xl p-4 text-center shadow-sm">
                      <div className="text-2xl mb-2">{renderIcon(category.icon, "w-6 h-6") || category.icon}</div>
                      <div className="text-gray-800 text-sm font-semibold">{category[language]}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Menu Items - Horizontal cards like in the image */}
              <div className="px-4 space-y-3 mb-4 flex-1">
                {theme.items.slice(0, 3).map((item: ThemeItem, index: number) => (
                  <div key={index} className="bg-white/95 rounded-2xl p-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 bg-gray-200 rounded-full bg-cover bg-center shadow-sm flex-shrink-0"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800 leading-tight mb-1">
                          {item.name[language]}
                        </div>
                        <div className="text-lg font-bold text-green-600">{item.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Bestel Nu Button */}
              <div className="px-4 pb-4">
                <div className="bg-pink-600 hover:bg-pink-700 text-white text-center py-3 rounded-2xl shadow-lg">
                  <span className="text-lg font-bold">
                    {language === "nl" ? "Bestel Nu" : "Order Now"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Default layout for other themes
    return (
      <div className="relative mx-3">
        <div className="w-72 h-[560px] rounded-2xl shadow-2xl overflow-hidden border-3 border-gray-800 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl">
          <div 
            className={`h-full ${theme.bgColor} flex flex-col`}
            style={theme.bgImage ? { 
              backgroundImage: `url(${theme.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            } : {}}
          >
            {/* Phone Status Bar */}
            <div className="bg-black text-white text-sm px-3 py-1.5 flex justify-between items-center">
              <span className="text-sm font-medium">9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
            
            {/* App Header */}
            <div className={`${theme.headerColor} text-white p-2.5 text-center relative`}>
              <h2 className="text-base font-bold leading-tight">{language === "nl" ? theme.name : theme.nameEn}</h2>
            </div>
            
            {/* Categories */}
            <div className="p-3 flex-1 flex flex-col h-full">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {theme.categories.map((category: ThemeCategory, index: number) => (
                  <div key={index} className="bg-white/80 rounded-lg p-1.5 text-center shadow-sm">
                    <span className="text-base">{renderIcon(category.icon, "w-4 h-4") || category.icon}</span>
                    <div className="text-xs mt-1 font-medium leading-tight">{category[language]}</div>
                  </div>
                ))}
              </div>
              
              {/* Featured Items */}
              <div className="space-y-2 flex-1 overflow-hidden mb-2">
                {theme.items.slice(0, 3).map((item: ThemeItem, index: number) => (
                  <div key={index} className="bg-white/95 rounded-lg p-2 flex items-center gap-2 shadow-sm">
                    <div 
                      className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium flex items-center gap-1 leading-tight">
                        <span className="truncate">{item.name[language]}</span>
                        {item.popular && <span className="text-xs bg-yellow-100 px-1 py-0.5 rounded flex-shrink-0">★</span>}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-between mt-1">
                        <span className="font-semibold text-green-600">{item.price}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {item.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{item.rating}</span>
                            </div>
                          )}
                          {item.prepTime && (
                            <div className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">{item.prepTime}m</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Button - Fixed positioning */}
              <div className="mt-auto mb-1">
                <div className={`${theme.headerColor} text-white text-center py-2 rounded-lg shadow-md mx-1`}>
                  <span className="text-sm font-semibold">
                    {language === "nl" ? "Bestel Nu" : "Order Now"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-8 relative"
      style={{
        backgroundImage: "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4tHeJgli7dPFhLHhB0XT85YWyCoiD8.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg text-white">
            {language === "nl" ? "Restaurant App Thema's" : "Restaurant App Themes"}
          </h1>
          <p className="text-xl mb-6 drop-shadow text-white/90">
            {language === "nl"
              ? "Professionele mobiele app ontwerpen voor restaurants en food services"
              : "Professional mobile app designs for restaurants and food services"}
          </p>
          
          {/* Simple Control Panel */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white/100"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === "nl" ? "English" : "Nederlands"}
            </Button>
            
            {viewMode === 'carousel' && (
              <Button
                onClick={toggleAutoPlay}
                variant="outline"
                className="bg-white/90 backdrop-blur-sm hover:bg-white/100"
              >
                {autoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {autoPlay ? 
                  (language === "nl" ? "Pauzeer" : "Pause") : 
                  (language === "nl" ? "Afspelen" : "Play")
                }
              </Button>
            )}
            
            <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1">
              <Button
                variant={viewMode === 'carousel' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('carousel')}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Carousel
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>
        </div>

        {/* Theme Display */}
        <div className="relative">
          {viewMode === 'carousel' ? (
            // Carousel View
            <div className="flex justify-center items-center min-h-[660px] px-12">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="lg"
                className="absolute left-6 z-10 bg-white/90 backdrop-blur-sm hover:bg-white/100 hover:scale-105 transition-all duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex justify-center items-center overflow-hidden gap-6">
                {getVisibleThemes().map((theme) => (
                  <MobileApp 
                    key={theme.id} 
                    theme={theme} 
                    language={language}
                  />
                ))}
              </div>

              <Button
                onClick={nextSlide}
                variant="outline"
                size="lg"
                className="absolute right-6 z-10 bg-white/90 backdrop-blur-sm hover:bg-white/100 hover:scale-105 transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          ) : (
            // Grid View
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {themes.map((theme) => (
                  <MobileApp 
                    key={theme.id} 
                    theme={theme} 
                    language={language}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Slide Indicators for Carousel */}
          {viewMode === 'carousel' && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    setAutoPlay(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/90">
          <p className="mb-2 drop-shadow">
            {language === "nl"
              ? "Ontdek onze professionele restaurant app thema's • Moderne designs • Gebruiksvriendelijk"
              : "Discover our professional restaurant app themes • Modern designs • User-friendly"}
          </p>
          <p className="text-sm drop-shadow">
            {language === "nl"
              ? "Alle thema's zijn volledig aanpasbaar en responsive voor alle apparaten"
              : "All themes are fully customizable and responsive for all devices"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RestaurantThemesPage