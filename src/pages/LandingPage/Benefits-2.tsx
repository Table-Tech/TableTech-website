"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Heart, Star, Coffee, Snowflake, Croissant, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"

const themes = [
  {
    id: 1,
    name: "Mediterraans Seafood",
    nameEn: "Mediterranean Seafood",
    color: "from-blue-400 to-teal-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-teal-50",
    headerColor: "bg-blue-500",
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
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled-fish-u3U1XCADVetX66E1cJIh5czogYn2Je.png",
      },
      {
        name: { nl: "Garnalen Scampi", en: "Shrimp Scampi" },
        price: "€18.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shrimp-0LmDnJVOiwfP8YBrEiLnRmW4dr6I6w.png",
      },
      {
        name: { nl: "Zeevruchten Paella", en: "Seafood Paella" },
        price: "€32.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paella-HHvXuGM9E700Wa0JA98VDUELzTfB55.png",
      },
      {
        name: { nl: "Kreeftensoep", en: "Lobster Bisque" },
        price: "€16.50",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lobster-soup-FsnvmcUYFTHx5pJWa4VRslEb9Fk63R.png",
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
      },
      {
        name: { nl: "Cappuccino Deluxe", en: "Deluxe Cappuccino" },
        price: "€4.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/latte-art-4ERbYE98xd9x4m7767Q1Dw5jTQMlWh.png",
      },
      {
        name: { nl: "Cold Brew Tonic", en: "Cold Brew Tonic" },
        price: "€5.80",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cold-drink-M8CqnPx7HmM60XFEWdIciwA2F1coFu.png",
      },
      {
        name: { nl: "Croissant Amandel", en: "Almond Croissant" },
        price: "€3.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/croissants-xaPRIimoQpXVqpcbFZa35MUzmKuBJY.png",
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
      },
      {
        name: { nl: "Old Fashioned Whisky", en: "Old Fashioned Whisky" },
        price: "€12.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EssVFIky0EQZqQjulap0bxsnwEa57x.png",
      },
      {
        name: { nl: "Craft IPA", en: "Craft IPA" },
        price: "€6.80",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/craft-ipa-5gPHtMglCzFgMPXvTEaIaanUvqincN.png",
      },
      {
        name: { nl: "Bordeaux Reserve", en: "Bordeaux Reserve" },
        price: "€9.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lxQGJ3TRZei28MFCqZAdcXMo45MH8u.png",
      },
    ],
  },
  {
    id: 4,
    name: "French Patisserie",
    nameEn: "French Patisserie",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    headerColor: "bg-pink-500",
    categories: [
      { nl: "Taarten", en: "Cakes", icon: "🎂" },
      { nl: "Macarons", en: "Macarons", icon: "🍪" },
      { nl: "Eclairs", en: "Eclairs", icon: "🧁" },
      { nl: "Chocolade", en: "Chocolate", icon: "🍫" },
    ],
    items: [
      {
        name: { nl: "Opera Taart", en: "Opera Cake" },
        price: "€28.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-e7OwAnL7lQWHYFH5TBZaXzmUzpZ8H5.png",
      },
      {
        name: { nl: "Macaron Box 12st", en: "Macaron Box 12pcs" },
        price: "€24.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vTm02rW7pvacXIUeGepsZz6fMSVbuV.png",
      },
      {
        name: { nl: "Chocolade Eclair", en: "Chocolate Eclair" },
        price: "€6.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vx0IylNLbDAg2O8yg6di3Fdb39tFIY.png",
      },
      {
        name: { nl: "Mille-feuille", en: "Mille-feuille" },
        price: "€8.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EobhnUZlB82ZIAlt8ljdpfzJkdxmzy.png",
      },
    ],
  },
  {
    id: 5,
    name: "Neapolitan Pizzeria",
    nameEn: "Neapolitan Pizzeria",
    color: "from-red-500 to-green-600",
    bgColor: "bg-gradient-to-br from-red-50 to-green-50",
    headerColor: "bg-red-500",
    categories: [
      { nl: "Pizza", en: "Pizza", icon: "🍕" },
      { nl: "Antipasti", en: "Antipasti", icon: "🫒" },
      { nl: "Pasta", en: "Pasta", icon: "🍝" },
      { nl: "Desserts", en: "Desserts", icon: "🍨" },
    ],
    items: [
      {
        name: { nl: "Margherita DOC", en: "Margherita DOC" },
        price: "€14.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IOfEfsYq9DiSLkj75zmqO8Was4lpV3.png",
      },
      {
        name: { nl: "Quattro Stagioni", en: "Quattro Stagioni" },
        price: "€18.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8Z9ayJO4KQHONPspD47pogPsahwS0D.png",
      },
      {
        name: { nl: "Burrata Antipasto", en: "Burrata Antipasto" },
        price: "€12.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3wGGhgILjHrZm64V3IIuj9VymGWuIw.png",
      },
      {
        name: { nl: "Carbonara Classica", en: "Classic Carbonara" },
        price: "€16.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ohbFLFtMwCTwcHWYi07CI3llSt5sr0.png",
      },
    ],
  },
  {
    id: 6,
    name: "Asian Fusion",
    nameEn: "Asian Fusion",
    color: "from-purple-600 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    headerColor: "bg-purple-600",
    categories: [
      { nl: "Sushi", en: "Sushi", icon: "🍣" },
      { nl: "Ramen", en: "Ramen", icon: "🍜" },
      { nl: "Dim Sum", en: "Dim Sum", icon: "🥟" },
      { nl: "Wok", en: "Wok", icon: "🥢" },
    ],
    items: [
      {
        name: { nl: "Sashimi Selection", en: "Sashimi Selection" },
        price: "€32.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-chCFjf4pvO3YN2eHJxvjtx5pXpfuFc.png",
      },
      {
        name: { nl: "Tonkotsu Ramen", en: "Tonkotsu Ramen" },
        price: "€16.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NDNaEwXU9Sk9CC0hIVwIOIfJXrPhVX.png",
      },
      {
        name: { nl: "Dim Sum Platter", en: "Dim Sum Platter" },
        price: "€22.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4pQpdGTHIqZCfaiYCJlb4XwTgqn0hJ.png",
      },
      {
        name: { nl: "Pad Thai Garnalen", en: "Pad Thai Shrimp" },
        price: "€18.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-r6eeDOJHsZudLZKnNxRc5AaM6nUhsJ.png",
      },
    ],
  },
  {
    id: 7,
    name: "Plant-Based Kitchen",
    nameEn: "Plant-Based Kitchen",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    headerColor: "bg-green-500",
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
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VybXA0tdk1WGr8EAmXCxaw500ei8Ck.png",
      },
      {
        name: { nl: "Green Smoothie", en: "Green Smoothie" },
        price: "€7.90",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smoothie.jpg-kTTf8uXkwgJQzHDb3vv3jMXX18rzc0.jpeg",
      },
      {
        name: { nl: "Jackfruit Curry", en: "Jackfruit Curry" },
        price: "€18.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-o54XVCDYIZMWYhLqlr31DXdGujg7ll.png",
      },
      {
        name: { nl: "Raw Zucchini Pasta", en: "Raw Zucchini Pasta" },
        price: "€14.50",
        image: "/placeholder.svg?height=120&width=120",
      },
    ],
  },
  {
    id: 8,
    name: "Gelato Boutique",
    nameEn: "Gelato Boutique",
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
    headerColor: "bg-cyan-500",
    categories: [
      { nl: "Gelato", en: "Gelato", icon: "🍨", type: { nl: "Roomijs", en: "Cream Ice" } },
      { nl: "Sorbet", en: "Sorbet", icon: "🍧", type: { nl: "Sorbet", en: "Sorbet" } },
      { nl: "Milkshakes", en: "Milkshakes", icon: "🥤", type: { nl: "Shakes", en: "Shakes" } },
      { nl: "Sundaes", en: "Sundaes", icon: "🍦", type: { nl: "Vegan ijs", en: "Vegan Ice" } },
    ],
    items: [
      {
        name: { nl: "Pistachio Gelato", en: "Pistachio Gelato" },
        price: "€4.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V07ZTVwJbbvAjhjvxyklkQlbwwM78s.png",
      },
      {
        name: { nl: "Mango Sorbet", en: "Mango Sorbet" },
        price: "€4.00",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TlVzByJ2omrnLl8NDMOuvfpjiBlFx8.png",
      },
      {
        name: { nl: "Oreo Chocolate Milkshake", en: "Oreo Chocolate Milkshake" },
        price: "€6.50",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wok26Nvh2PZ8Fz05dxDRJHq868KWKt.png",
      },
      {
        name: { nl: "Affogato", en: "Affogato" },
        price: "€6.90",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tS3cwhcwdi38vt9cyNyEDYjZFTGIYs.png",
      },
    ],
  },
]

export default function MobileThemeSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [language, setLanguage] = useState<"nl" | "en">("nl")
  const [autoPlay, setAutoPlay] = useState(true)
  const autoPlayRef = useRef(autoPlay)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(false)

  // Update ref when state changes
  useEffect(() => {
    autoPlayRef.current = autoPlay
  }, [autoPlay])

  // Setup timer with cleanup - aangepast om conflicten te voorkomen
  useEffect(() => {
    // Voorkom dubbele initialisatie
    if (!isMounted.current) {
      isMounted.current = true
    } else {
      const setupTimer = () => {
        // Zorg ervoor dat we eerst de bestaande timer opruimen
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        // Alleen een nieuwe timer starten als autoPlay actief is
        if (autoPlayRef.current) {
          timerRef.current = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(themes.length / 3))
            // Recursief de timer opnieuw instellen
            setupTimer()
          }, 4000)
        }
      }

      setupTimer()
    }

    // Cleanup functie
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [autoPlay])

  // Zorg ervoor dat we de timer opruimen bij unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(themes.length / 3))
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(themes.length / 3)) % Math.ceil(themes.length / 3))
    setAutoPlay(false)
  }

  // Aangepaste volgorde van thema's voor de dia's
  const getVisibleThemes = () => {
    // Nieuwe volgorde: 1e dia 3 telefoons (1,2,3), 2e dia 2 telefoons (6,7), 3e dia 3 telefoons (4,5,8)
    const orderedThemes = [
      themes[0], // Mediterraans Seafood
      themes[1], // Artisan Coffee House
      themes[2], // Premium Spirits Bar
      themes[5], // Asian Fusion
      themes[6], // Plant-Based Kitchen
      themes[3], // French Patisserie
      themes[4], // Neapolitan Pizzeria
      themes[7], // Gelato Boutique
    ]

    const slidesConfig = [
      [0, 1, 2], // 1e dia: 3 telefoons
      [3, 4], // 2e dia: 2 telefoons
      [5, 6, 7], // 3e dia: 3 telefoons
    ]

    const currentSlideIndices = slidesConfig[currentSlide] || slidesConfig[0]
    return currentSlideIndices.map((index) => orderedThemes[index])
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

  const MobileApp = ({ theme, language }: { theme: any; language: "nl" | "en" }) => {
    // Mediterraans Seafood - Fix "Schaaldieren" text positioning
    if (theme.id === 1) {
      return (
        <div className="w-80 h-[600px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-125 contrast-125 saturate-150"
            style={{
              backgroundImage:
                "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beach-sunset.jpg-TOINx0neQmEl0RDMHvQmp3TZgLqnge.jpeg)",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/40 via-teal-50/30 to-blue-200/40"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/80 to-teal-600/80 text-white p-3 backdrop-blur-sm">
              <h2 className="text-lg font-bold drop-shadow-lg text-center">
                {language === "nl" ? theme.name : theme.nameEn}
              </h2>
              <p className="text-blue-100 text-xs drop-shadow text-center">Fresh from the sea</p>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {theme.categories.map((category: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-center border border-white/50 hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <span className={`text-xs font-medium text-gray-800 ${index === 1 ? "text-left pl-1" : ""}`}>
                      {category[language]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-3 pb-3 flex-1">
              <div className="grid grid-cols-2 gap-2">
                {theme.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/50 hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-16 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}></div>
                    <div className="p-2">
                      <h4 className="font-semibold text-xs mb-1 text-gray-800 leading-tight">{item.name[language]}</h4>
                      <p className="text-blue-600 font-bold text-sm">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600/85 text-white p-2 text-center backdrop-blur-sm hover:bg-opacity-90 transition-all duration-200">
              <span className="font-semibold drop-shadow text-sm">Order Now</span>
            </div>
          </div>
        </div>
      )
    }

    // Artisan Coffee House - Compacte layout
    if (theme.id === 2) {
      return (
        <div className="w-80 h-[600px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-120 contrast-120 saturate-140"
            style={{
              backgroundImage:
                "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-atmosphere-MkpirFmX0CYlbwWXwpbQGTJOAduHjs.png)",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100/50 via-orange-50/40 to-amber-200/50"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-700/80 to-orange-600/80 text-white p-3 text-center backdrop-blur-sm">
              <h2 className="text-lg font-bold mb-2 drop-shadow-lg">{language === "nl" ? theme.name : theme.nameEn}</h2>
              <div className="grid grid-cols-4 gap-2">
                {theme.categories.map((category: any, index: number) => (
                  <div key={index} className="text-center hover:scale-110 hover:shadow-lg transition-all duration-200">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg mx-auto mb-1">
                      {renderIcon(category.icon, "w-5 h-5 text-amber-700")}
                    </div>
                    <span className="text-xs text-amber-100 font-medium">{category[language]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 flex-1">
              <div className="space-y-2">
                {theme.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-amber-200/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-amber-300/50 hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 bg-cover bg-center rounded-full flex-shrink-0 shadow-md"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.name[language]}</h4>
                      <p className="text-amber-800 font-bold text-sm">{item.price}</p>
                    </div>
                    <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-90 transition-all duration-200">
                      <span className="text-white text-xs">+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Premium Spirits Bar - Larger items and bottom order section
    if (theme.id === 3) {
      return (
        <div className="w-80 h-[600px] bg-gradient-to-b from-gray-900 via-gray-800 to-yellow-900 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 flex flex-col">
          <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-3 text-center">
            <h2 className="text-lg font-bold">{language === "nl" ? theme.name : theme.nameEn}</h2>
            <p className="text-yellow-100 text-xs">Premium Selection</p>
          </div>

          <div className="bg-gray-800 p-3">
            <div className="grid grid-cols-4 gap-2">
              {theme.categories.map((category: any, index: number) => (
                <div key={index} className="text-center hover:scale-110 hover:shadow-lg transition-all duration-200">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mb-1 mx-auto">
                    <span className="text-white text-sm">{category.icon}</span>
                  </div>
                  <span className="text-yellow-400 text-xs font-medium">{category[language]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-3">
            <div className="space-y-3">
              {theme.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-yellow-600/30 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-base mb-2 leading-tight">{item.name[language]}</h4>
                      <p className="text-yellow-400 font-bold text-lg">{item.price}</p>
                    </div>
                    <div
                      className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0 ml-3 shadow-md"
                      style={{
                        backgroundImage:
                          item.image !== "/placeholder.svg?height=120&width=120" ? `url(${item.image})` : "none",
                        backgroundColor:
                          item.image === "/placeholder.svg?height=120&width=120"
                            ? "rgba(180, 83, 9, 0.8)"
                            : "transparent",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-600 text-gray-900 p-3 text-center mt-auto hover:bg-opacity-90 transition-all duration-200">
            <span className="font-bold text-base">Premium Order</span>
          </div>
        </div>
      )
    }

    // French Patisserie - Compacte layout met betere icon positionering
    if (theme.id === 4) {
      return (
        <div className="w-80 h-[600px] bg-gradient-to-b from-rose-100 via-pink-50 to-rose-200 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0">
          <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
            <h2 className="text-lg font-bold mb-1 relative z-10">{language === "nl" ? theme.name : theme.nameEn}</h2>
            <p className="text-pink-100 relative z-10 text-xs">Artisan Français</p>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {theme.categories.map((category: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg hover:scale-110 hover:shadow-lg transition-all duration-200"
                >
                  <span className="text-lg block mb-1">{category.icon}</span>
                  <span className="text-xs font-medium text-gray-800">{category[language]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 pb-3 flex-1">
            <div className="space-y-2">
              {theme.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-pink-200 hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 bg-cover bg-center rounded-full flex-shrink-0 shadow-md"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{item.name[language]}</h4>
                      <p className="text-pink-600 font-bold text-sm">{item.price}</p>
                    </div>
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Neapolitan Pizzeria - Compacte layout
    if (theme.id === 5) {
      return (
        <div className="w-80 h-[600px] bg-gradient-to-b from-orange-100 via-yellow-50 to-red-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0">
          <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          <div className="relative p-3 text-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-125 contrast-115 saturate-140"
              style={{
                backgroundImage:
                  "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizzeria-street.jpg-Qd3HMd8ocQOl68UFtIIiCSnwynswyw.jpeg)",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/60 via-white/75 to-green-600/60 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-lg font-bold text-gray-800 drop-shadow-lg">
                {language === "nl" ? theme.name : theme.nameEn}
              </h2>
              <p className="text-red-700 font-semibold drop-shadow text-xs">Autentica Napoletana</p>
            </div>
          </div>

          <div className="bg-red-100/60 backdrop-blur-sm p-3">
            <div className="grid grid-cols-4 gap-2">
              {theme.categories.map((category: any, index: number) => (
                <div key={index} className="text-center hover:scale-110 hover:shadow-lg transition-all duration-200">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center mb-1 shadow-md mx-auto">
                    <span className="text-sm">{category.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-red-800">{category[language]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 flex-1">
            <div className="grid grid-cols-2 gap-2">
              {theme.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border-2 border-red-200 hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-16 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.image})` }}>
                    <div className="absolute bottom-1 left-1 bg-red-600 text-white px-1 py-0.5 rounded-full text-xs font-bold shadow-md">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="font-bold text-gray-800 text-xs leading-tight">{item.name[language]}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <button className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs shadow-md hover:bg-opacity-90 hover:scale-105 transition-all duration-200">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Asian Fusion - Add real food images to the small squares
    if (theme.id === 6) {
      return (
        <div className="w-80 h-[600px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-130 contrast-120 saturate-160"
            style={{
              backgroundImage:
                "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-leaves.jpg-GeiYGufANWANVfh2K5TSOPoBW3667I.jpeg)",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/25 via-purple-50/20 to-slate-200/25"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>

            <div className="bg-white/85 backdrop-blur-sm p-3 border-b border-purple-100 shadow-lg">
              <h2 className="text-lg font-light text-gray-800 mb-2 text-center">
                {language === "nl" ? theme.name : theme.nameEn}
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {theme.categories.map((category: any, index: number) => (
                  <div key={index} className="text-center hover:scale-110 hover:shadow-lg transition-all duration-200">
                    <span className="text-lg block mb-1">{category.icon}</span>
                    <span className="text-xs text-gray-600 font-medium">{category[language]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 flex-1">
              <h3 className="text-sm font-semibold mb-3 text-gray-800 text-center">Today's Special</h3>
              <div className="space-y-3">
                {theme.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-purple-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-3 h-12 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-base leading-tight mb-1">
                        {item.name[language]}
                      </h4>
                      <p className="text-purple-600 font-bold text-lg">{item.price}</p>
                    </div>
                    <div
                      className="w-14 h-14 bg-cover bg-center rounded-lg shadow-md flex-shrink-0"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Plant-Based Kitchen - Add background images to item containers
    if (theme.id === 7) {
      return (
        <div className="w-80 h-[600px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Re6qawnfZrr8Du1nt3pvGuMm5rDr2L.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.9,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-green-700/30 via-green-600/20 to-green-800/30"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/90 to-emerald-700/90 text-white p-3 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-8 translate-y-8"></div>
              <h2 className="text-lg font-bold mb-1 relative z-10 text-center drop-shadow-lg">
                {language === "nl" ? theme.name : theme.nameEn}
              </h2>
              <p className="text-green-100 relative z-10 text-center drop-shadow text-xs">100% Plant Based</p>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {theme.categories.map((category: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg border border-green-200 hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    <span className="text-lg block mb-1">{category.icon}</span>
                    <span className="text-xs font-medium text-green-800">{category[language]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-3 pb-3 flex-1">
              <div className="space-y-2">
                {theme.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-200 relative overflow-hidden hover:scale-105 hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundImage:
                        item.image !== "/placeholder.svg?height=120&width=120" ? `url(${item.image})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundBlendMode: "overlay",
                    }}
                  >
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{item.name[language]}</h4>
                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-bold text-sm">{item.price}</p>
                        <button className="bg-green-500 text-white px-2 py-1 rounded-full text-xs hover:bg-opacity-90 hover:scale-105 transition-all duration-200">
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Gelato Boutique - Make categories smaller and distinguish from products
    if (theme.id === 8) {
      return (
        <div className="w-80 h-[600px] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 mx-4 flex-shrink-0 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-125 contrast-120 saturate-150"
            style={{
              backgroundImage:
                "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frozen-bubble-F1A3VpZfEPp63lqasWj0QBgSv0i9we.png)",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100/40 via-blue-50/30 to-cyan-200/40"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-400/85 via-blue-500/85 to-purple-500/85 text-white p-3 text-center relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-1 left-2 w-6 h-6 bg-white/20 rounded-full"></div>
              <div className="absolute top-4 right-4 w-4 h-4 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-2 left-4 w-3 h-3 bg-white/20 rounded-full"></div>
              <h2 className="text-lg font-bold mb-1 relative z-10 drop-shadow-lg">
                {language === "nl" ? theme.name : theme.nameEn}
              </h2>
              <p className="text-cyan-100 relative z-10 drop-shadow text-xs">Artisan Italian Gelato</p>
            </div>

            {/* Smaller Categories Section */}
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-700 mb-2 text-center">Categories</h3>
              <div className="grid grid-cols-4 gap-1 mb-3">
                {theme.categories.map((category: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg p-1 text-center shadow-md backdrop-blur-sm border border-white/30 hover:scale-110 hover:shadow-lg transition-all duration-200 ${
                      index === 0
                        ? "bg-cyan-200/80"
                        : index === 1
                          ? "bg-blue-200/80"
                          : index === 2
                            ? "bg-purple-200/80"
                            : "bg-pink-200/80"
                    }`}
                  >
                    <span className="text-sm block">{category.icon}</span>
                    <span className="text-xs font-bold text-gray-800 block leading-tight">{category[language]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Section */}
            <div className="px-3 pb-3 flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Our Gelato</h3>
              <div className="grid grid-cols-2 gap-2">
                {theme.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-xl p-3 text-center shadow-lg backdrop-blur-sm border border-white/30 hover:scale-105 hover:shadow-xl transition-all duration-300 ${
                      index % 4 === 0
                        ? "bg-cyan-200/90"
                        : index % 4 === 1
                          ? "bg-blue-200/90"
                          : index % 4 === 2
                            ? "bg-purple-200/90"
                            : "bg-pink-200/90"
                    }`}
                  >
                    <div
                      className="w-12 h-12 mx-auto mb-2 rounded-full shadow-md bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <h4 className="font-bold text-gray-800 text-xs mb-1 leading-tight">{item.name[language]}</h4>
                    <p
                      className={`font-bold text-sm ${
                        index % 4 === 0
                          ? "text-cyan-600"
                          : index % 4 === 1
                            ? "text-blue-600"
                            : index % 4 === 2
                              ? "text-purple-600"
                              : "text-pink-600"
                      }`}
                    >
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Fallback voor andere thema's
    return <div className="w-80 h-[600px] bg-gray-200 rounded-3xl mx-4 flex-shrink-0"></div>
  }

  return (
    <div
      className="min-h-screen py-8 relative"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4tHeJgli7dPFhLHhB0XT85YWyCoiD8.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {language === "nl" ? "Restaurant App Thema's" : "Restaurant App Themes"}
          </h1>
          <p className="text-xl text-white/90 mb-6 drop-shadow">
            {language === "nl"
              ? "Professionele mobiele app ontwerpen voor restaurants en food services"
              : "Professional mobile app designs for restaurants and food services"}
          </p>
        </div>

        {/* Mobile Apps Slideshow */}
        <div className="relative">
          <div className="flex justify-center items-center min-h-[650px] px-8">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="lg"
              className="absolute left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-opacity-90 hover:scale-105 transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex justify-center items-center overflow-hidden">
              {getVisibleThemes().map((theme) => (
                <MobileApp key={theme.id} theme={theme} language={language} />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant="outline"
              size="lg"
              className="absolute right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-opacity-90 hover:scale-105 transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  setAutoPlay(false)
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/90">
          <p className="mb-2 drop-shadow">
            {language === "nl"
              ? "Alle thema's zijn volledig aanpasbaar en klaar voor implementatie"
              : "All themes are fully customizable and ready for implementation"}
          </p>
          <p className="text-sm drop-shadow">
            {language === "nl"
              ? "Prijzen zijn indicatief en worden weergegeven in Euro (€)"
              : "Prices are indicative and displayed in Euro (€)"}
          </p>
        </div>
      </div>
    </div>
  )
}
