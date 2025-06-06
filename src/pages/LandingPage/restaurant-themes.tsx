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

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const variants = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-900",
    outline: "border border-gray-300 bg-white",
    destructive: "bg-red-600 text-white"
  }
  
  return (
    <div 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
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
    ],
  },
  {
    id: 2,
    name: "Artisan Coffee House",
    nameEn: "Artisan Coffee House",
    color: "from-amber-600 to-orange-700",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
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
      { nl: "Whisky", en: "Whiskey", icon: "🥃" },
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
    ],
  },
  {
    id: 4,
    name: "Asian Fusion",
    nameEn: "Asian Fusion",
    color: "from-green-400 to-blue-500",
    bgColor: "bg-gradient-to-br from-green-50 to-blue-50",
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
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
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
    bgColor: "bg-gradient-to-br from-cyan-100 to-purple-100",
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

  const renderIcon = (iconType: string, className = "w-5 h-5") => {
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
        return <span className="text-lg">{iconType}</span>
    }
  }

  const MobileApp = ({ theme, language }: { 
    theme: Theme; 
    language: "nl" | "en"; 
  }) => {
    return (
      <div className="relative">
        <div className="w-80 h-[600px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 relative transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:border-yellow-400">
          <div 
            className={`h-full ${theme.bgColor} flex flex-col`}
            style={theme.bgImage ? { 
              backgroundImage: `url(${theme.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            } : {}}
          >
            {/* Phone Status Bar */}
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
            
            {/* App Header */}
            <div className={`${theme.headerColor} text-white p-4 text-center relative`}>
              <h2 className="text-lg font-bold">{language === "nl" ? theme.name : theme.nameEn}</h2>
            </div>
            
            {/* Categories */}
            <div className="p-4 flex-1">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {theme.categories.map((category: ThemeCategory, index: number) => (
                  <div key={index} className="bg-white/80 rounded-lg p-2 text-center shadow-md hover:shadow-lg hover:bg-white/90 transition-all duration-200">
                    <span className="text-sm">{renderIcon(category.icon) || category.icon}</span>
                    <div className="text-xs mt-1 font-medium">{category[language]}</div>
                  </div>
                ))}
              </div>
              
              {/* Featured Items */}
              <div className="space-y-2">
                {theme.items.slice(0, 3).map((item: ThemeItem, index: number) => (
                  <div key={index} className="bg-white/90 rounded-lg p-2 flex items-center gap-2 shadow-md hover:shadow-lg hover:bg-white transition-all duration-200">
                    <div 
                      className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center gap-1">
                        {item.name[language]}
                        {item.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-between">
                        <span className="font-medium text-green-600">{item.price}</span>
                        <div className="flex items-center gap-2">
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{item.rating}</span>
                            </div>
                          )}
                          {item.prepTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">{item.prepTime}min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="flex justify-center items-center min-h-[650px] px-8">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="lg"
                className="absolute left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white/100 hover:scale-105 transition-all duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex justify-center items-center overflow-hidden gap-8">
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
                className="absolute right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white/100 hover:scale-105 transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          ) : (
            // Grid View
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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