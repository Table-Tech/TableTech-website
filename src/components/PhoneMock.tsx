import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { Flame, Coffee, Globe } from "lucide-react";

interface PhoneMockupProps {
  theme?: string;
}

type CategoryId = "popular" | "curry" | "ramen" | "pizza" | "drinks" | "handi" | "kebab" | "rice" | "bbq" | "karahi" | "tandoori" | "cakes" | "coffee-specialties" | "cold-drinks" | "hot-drinks" | "pastries";

interface MenuItem {
  id: number;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  category: CategoryId;
  description?: string;
  descriptionEn?: string;
}

interface CartItem extends MenuItem {
  toppings?: string[];
  toppingsPrice?: number;
}

interface CategoryItem {
  name: string;
  nameEn?: string;
  icon: string;
  id: CategoryId;
}

// TableTech menu (original)
const tableTechMenu: Record<CategoryId, MenuItem[]> = {
  popular: [
    {
      id: 1,
      name: "Prawn Raisukaree",
      price: 12.0,
      image: "/menu/menu1.jpg",
      category: "popular",
    },
    {
      id: 2,
      name: "Firecracker Prawn",
      price: 11.0,
      image: "/menu/menu2.jpg",
      category: "popular",
    },
  ],
  curry: [
    {
      id: 3,
      name: "Chicken Katsu Curry",
      price: 10.5,
      image: "/menu/menu3.jpg",
      category: "curry",
    },
    {
      id: 4,
      name: "Vegetable Curry",
      price: 9.0,
      image: "/menu/menu4.jpg",
      category: "curry",
    },
  ],
  ramen: [
    {
      id: 5,
      name: "Tofu Firecracker Ramen",
      price: 9.75,
      image: "/menu/menu5.jpg",
      category: "ramen",
    },
    {
      id: 6,
      name: "Chilli Steak Ramen",
      price: 8.95,
      image: "/menu/menu4.jpg",
      category: "ramen",
    },
  ],
  pizza: [
    {
      id: 7,
      name: "Margherita Pizza",
      price: 8.5,
      image: "/menu/menu1.jpg",
      category: "pizza",
    },
    {
      id: 8,
      name: "Pepperoni Pizza",
      price: 9.5,
      image: "/menu/menu2.jpg",
      category: "pizza",
    },
  ],
  drinks: [
    {
      id: 9,
      name: "Fresh Lemonade",
      price: 3.5,
      image: "/menu/menu5.jpg",
      category: "drinks",
    },
    {
      id: 10,
      name: "Iced Green Tea",
      price: 2.95,
      image: "/menu/menu3.jpg",
      category: "drinks",
    },
  ],
  handi: [],
  kebab: [],
  rice: [],
  bbq: [],
  karahi: [],
  tandoori: [],
  cakes: [],
  "coffee-specialties": [],
  "cold-drinks": [],
  "hot-drinks": [],
  pastries: [],
};

// Spice Palace menu
const spicePalaceMenu: Record<CategoryId, MenuItem[]> = {
  popular: [
    {
      id: 101,
      name: "Kip Handi Special",
      nameEn: "Chicken Handi Special",
      price: 16.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi1.png",
      category: "popular",
      description: "Traditioneel bereid in klei pot",
      descriptionEn: "Traditionally cooked in clay pot",
    },
    {
      id: 102,
      name: "Lams Handi",
      nameEn: "Lamb Handi",
      price: 18.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi2.png",
      category: "popular",
      description: "Mals lamsvlees in kruidige saus",
      descriptionEn: "Tender lamb in spiced sauce",
    },
  ],
  handi: [
    {
      id: 103,
      name: "Kip Handi Special",
      nameEn: "Chicken Handi Special",
      price: 16.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi1.png",
      category: "handi",
      description: "Traditioneel bereid in klei pot",
      descriptionEn: "Traditionally cooked in clay pot",
    },
    {
      id: 104,
      name: "Lams Handi",
      nameEn: "Lamb Handi",
      price: 18.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi2.png",
      category: "handi",
      description: "Mals lamsvlees in kruidige saus",
      descriptionEn: "Tender lamb in spiced sauce",
    },
    {
      id: 105,
      name: "Vegetarische Handi",
      nameEn: "Vegetarian Handi",
      price: 14.0,
      image: "/src/assets/afbeeldingen/spice-palace/handi3.png",
      category: "handi",
      description: "Verse groenten in klei pot",
      descriptionEn: "Fresh vegetables in clay pot",
    },
  ],
  kebab: [
    {
      id: 106,
      name: "Gemengde Kebab",
      nameEn: "Mixed Kebab",
      price: 15.0,
      image: "/src/assets/afbeeldingen/spice-palace/kebab.png",
      category: "kebab",
      description: "Gegrild vlees met kruiden",
      descriptionEn: "Grilled meat with spices",
    },
    {
      id: 107,
      name: "Broodje Kebab",
      nameEn: "Kebab Sandwich",
      price: 8.5,
      image: "/src/assets/afbeeldingen/spice-palace/kebab-sandwich.png",
      category: "kebab",
      description: "Verse kebab in warm broodje",
      descriptionEn: "Fresh kebab in warm bread",
    },
  ],
  rice: [
    {
      id: 108,
      name: "Gebakken Rijst",
      nameEn: "Fried Rice",
      price: 12.5,
      image: "/src/assets/afbeeldingen/spice-palace/fried-rice.png",
      category: "rice",
      description: "Gebakken rijst met groenten",
      descriptionEn: "Fried rice with vegetables",
    },
    {
      id: 109,
      name: "Biryani Rijst",
      nameEn: "Biryani Rice",
      price: 14.0,
      image: "/src/assets/afbeeldingen/spice-palace/rice-dish.png",
      category: "rice",
      description: "Aromatische basmati rijst met kruiden",
      descriptionEn: "Aromatic basmati rice with spices",
    },
  ],
  bbq: [
    {
      id: 110,
      name: "BBQ Spareribs",
      nameEn: "BBQ Spareribs",
      price: 19.5,
      image: "/src/assets/afbeeldingen/spice-palace/bbq-ribs.png",
      category: "bbq",
      description: "Gegrilde spareribs met BBQ saus",
      descriptionEn: "Grilled spareribs with BBQ sauce",
    },
    {
      id: 111,
      name: "BBQ Mixed Grill",
      nameEn: "BBQ Mixed Grill",
      price: 22.0,
      image: "/src/assets/afbeeldingen/spice-palace/bbq-mixed.png",
      category: "bbq",
      description: "Gemengde grill met vlees en groenten",
      descriptionEn: "Mixed grill with meat and vegetables",
    },
  ],
  karahi: [
    {
      id: 112,
      name: "Kip Karahi",
      nameEn: "Chicken Karahi",
      price: 17.0,
      image: "/src/assets/afbeeldingen/spice-palace/karahi-dish.png",
      category: "karahi",
      description: "Pittige kip in tomaten saus",
      descriptionEn: "Spicy chicken in tomato sauce",
    },
    {
      id: 113,
      name: "Curry Schotel",
      nameEn: "Curry Plate",
      price: 18.0,
      image: "/src/assets/afbeeldingen/spice-palace/curry-plate.png",
      category: "karahi",
      description: "Rijke curry met verse kruiden",
      descriptionEn: "Rich curry with fresh spices",
    },
  ],
  tandoori: [
    {
      id: 114,
      name: "Garlic Naan",
      nameEn: "Garlic Naan",
      price: 4.5,
      image: "/src/assets/afbeeldingen/spice-palace/garlic-naan.png",
      category: "tandoori",
      description: "Vers naan brood met knoflook",
      descriptionEn: "Fresh naan bread with garlic",
    },
    {
      id: 115,
      name: "Ramen Donker",
      nameEn: "Dark Ramen",
      price: 12.0,
      image: "/src/assets/afbeeldingen/spice-palace/ramen-dark.png",
      category: "tandoori",
      description: "Rijke ramen in donkere bouillon",
      descriptionEn: "Rich ramen in dark broth",
    },
  ],
  curry: [],
  ramen: [],
  pizza: [],
  drinks: [],
  cakes: [],
  "coffee-specialties": [],
  "cold-drinks": [],
  "hot-drinks": [],
  pastries: [],
};

// Sweet Delights menu
const sweetDelightsMenu: Record<CategoryId, MenuItem[]> = {
  popular: [
    {
      id: 201,
      name: "Chocolade Taart",
      nameEn: "Chocolate Cake",
      price: 7.5,
      image: "/src/assets/afbeeldingen/sweet-delights/chocolate-cake.jpg",
      category: "popular",
    },
    {
      id: 202,
      name: "Cheesecake",
      nameEn: "Cheesecake",
      price: 8.0,
      image: "/src/assets/afbeeldingen/sweet-delights/cheesecake.jpg",
      category: "popular",
    },
  ],
  cakes: [
    {
      id: 203,
      name: "Chocolade Taart",
      nameEn: "Chocolate Cake",
      price: 7.5,
      image: "/src/assets/afbeeldingen/sweet-delights/chocolate-cake.jpg",
      category: "cakes",
    },
    {
      id: 204,
      name: "Cheesecake",
      nameEn: "Cheesecake",
      price: 8.0,
      image: "/src/assets/afbeeldingen/sweet-delights/cheesecake.jpg",
      category: "cakes",
    },
    {
      id: 205,
      name: "Carrot Cake",
      nameEn: "Carrot Cake",
      price: 6.5,
      image: "/src/assets/afbeeldingen/sweet-delights/carrot-cake.jpg",
      category: "cakes",
    },
  ],
  "coffee-specialties": [
    {
      id: 206,
      name: "Cappuccino",
      nameEn: "Cappuccino",
      price: 3.5,
      image: "/src/assets/afbeeldingen/sweet-delights/cappuccino.jpg",
      category: "coffee-specialties",
    },
    {
      id: 207,
      name: "Espresso",
      nameEn: "Espresso",
      price: 2.5,
      image: "/src/assets/afbeeldingen/sweet-delights/espresso.jpg",
      category: "coffee-specialties",
    },
    {
      id: 208,
      name: "Latte",
      nameEn: "Latte",
      price: 4.0,
      image: "/src/assets/afbeeldingen/sweet-delights/latte.jpg",
      category: "coffee-specialties",
    },
  ],
  "cold-drinks": [
    {
      id: 209,
      name: "IJskoffie",
      nameEn: "Iced Coffee",
      price: 4.5,
      image: "/src/assets/afbeeldingen/sweet-delights/iced-coffee.jpg",
      category: "cold-drinks",
    },
    {
      id: 210,
      name: "Frappé",
      nameEn: "Frappé",
      price: 5.0,
      image: "/src/assets/afbeeldingen/sweet-delights/frappe.jpg",
      category: "cold-drinks",
    },
  ],
  "hot-drinks": [
    {
      id: 211,
      name: "Warme Chocolademelk",
      nameEn: "Hot Chocolate",
      price: 3.5,
      image: "/src/assets/afbeeldingen/sweet-delights/hot-chocolate.jpg",
      category: "hot-drinks",
    },
    {
      id: 212,
      name: "Chai Latte",
      nameEn: "Chai Latte",
      price: 4.0,
      image: "/src/assets/afbeeldingen/sweet-delights/chai-latte.jpg",
      category: "hot-drinks",
    },
  ],
  curry: [],
  ramen: [],
  pizza: [],
  drinks: [],
  handi: [],
  kebab: [],
  rice: [],
  bbq: [],
  karahi: [],
  tandoori: [],
  pastries: [],
};

// Coffee Corner menu
const coffeeCornerMenu: Record<CategoryId, MenuItem[]> = {
  popular: [
    {
      id: 301,
      name: "Espresso",
      nameEn: "Espresso",
      price: 2.5,
      image: "/src/assets/afbeeldingen/coffee-corner/espresso.jpg",
      category: "popular",
      description: "Australische Bonen",
      descriptionEn: "Australian Beans",
    },
    {
      id: 302,
      name: "Cappuccino",
      nameEn: "Cappuccino",
      price: 3.5,
      image: "/src/assets/afbeeldingen/coffee-corner/cappuccino.jpg",
      category: "popular",
      description: "Met melkschuim",
      descriptionEn: "With milk foam",
    },
  ],
  "coffee-specialties": [
    {
      id: 303,
      name: "Espresso",
      nameEn: "Espresso",
      price: 2.5,
      image: "/src/assets/afbeeldingen/coffee-corner/espresso.jpg",
      category: "coffee-specialties",
      description: "Australische Bonen",
      descriptionEn: "Australian Beans",
    },
    {
      id: 304,
      name: "Cappuccino",
      nameEn: "Cappuccino",
      price: 3.5,
      image: "/src/assets/afbeeldingen/coffee-corner/cappuccino.jpg",
      category: "coffee-specialties",
      description: "Met melkschuim",
      descriptionEn: "With milk foam",
    },
    {
      id: 305,
      name: "Americano",
      nameEn: "Americano",
      price: 3.0,
      image: "/src/assets/afbeeldingen/coffee-corner/americano.jpg",
      category: "coffee-specialties",
      description: "Zwarte koffie",
      descriptionEn: "Black coffee",
    },
  ],
  "cold-drinks": [
    {
      id: 306,
      name: "IJskoffie",
      nameEn: "Iced Coffee",
      price: 4.0,
      image: "/src/assets/afbeeldingen/coffee-corner/iced-coffee.jpg",
      category: "cold-drinks",
    },
    {
      id: 307,
      name: "Frappé",
      nameEn: "Frappé",
      price: 4.5,
      image: "/src/assets/afbeeldingen/coffee-corner/frappe.jpg",
      category: "cold-drinks",
    },
  ],
  "hot-drinks": [
    {
      id: 308,
      name: "Warme Chocolademelk",
      nameEn: "Hot Chocolate",
      price: 3.5,
      image: "/src/assets/afbeeldingen/coffee-corner/hot-chocolate.jpg",
      category: "hot-drinks",
    },
    {
      id: 309,
      name: "Chai Latte",
      nameEn: "Chai Latte",
      price: 4.0,
      image: "/src/assets/afbeeldingen/coffee-corner/chai-latte.jpg",
      category: "hot-drinks",
    },
  ],
  pastries: [
    {
      id: 310,
      name: "Croissant",
      nameEn: "Croissant",
      price: 2.5,
      image: "/src/assets/afbeeldingen/coffee-corner/croissant.jpg",
      category: "pastries",
    },
    {
      id: 311,
      name: "Muffin",
      nameEn: "Muffin",
      price: 3.0,
      image: "/src/assets/afbeeldingen/coffee-corner/muffin.jpg",
      category: "pastries",
    },
  ],
  curry: [],
  ramen: [],
  pizza: [],
  drinks: [],
  handi: [],
  kebab: [],
  rice: [],
  bbq: [],
  karahi: [],
  tandoori: [],
  cakes: [],
};

const getMenuForTheme = (theme: string) => {
  switch (theme) {
    case "spicepalace":
      return spicePalaceMenu;
    case "sweetdelights":
      return sweetDelightsMenu;
    case "coffeecorner":
      return coffeeCornerMenu;
    default:
      return tableTechMenu;
  }
};

const getCategoriesForTheme = (theme: string): CategoryItem[] => {
  switch (theme) {
    case "spicepalace":
      return [
        { name: "Handi", nameEn: "Handi", icon: "/src/assets/afbeeldingen/spice-palace/handi-category.png", id: "handi" },
        { name: "Kebab", nameEn: "Kebab", icon: "/src/assets/afbeeldingen/spice-palace/kebab-category.png", id: "kebab" },
        { name: "Rijst", nameEn: "Rice", icon: "/src/assets/afbeeldingen/spice-palace/rice-category.png", id: "rice" },
        { name: "BBQ", nameEn: "BBQ", icon: "/src/assets/afbeeldingen/spice-palace/bbq-category.png", id: "bbq" },
        { name: "Karahi", nameEn: "Karahi", icon: "/src/assets/afbeeldingen/spice-palace/karahi-category.png", id: "karahi" },
        { name: "Tandoori", nameEn: "Tandoori", icon: "/src/assets/afbeeldingen/spice-palace/tandoor-category.png", id: "tandoori" },
      ];
    case "sweetdelights":
      return [
        { name: "Taarten", nameEn: "Cakes", icon: "/src/assets/afbeeldingen/sweet-delights/cake-icon.jpg", id: "cakes" },
        { name: "Koffie", nameEn: "Coffee", icon: "/src/assets/afbeeldingen/sweet-delights/coffee-icon.jpg", id: "coffee-specialties" },
        { name: "Koude Dranken", nameEn: "Cold Drinks", icon: "/src/assets/afbeeldingen/sweet-delights/cold-drink-icon.jpg", id: "cold-drinks" },
        { name: "Warme Dranken", nameEn: "Hot Drinks", icon: "/src/assets/afbeeldingen/sweet-delights/hot-drink-icon.jpg", id: "hot-drinks" },
      ];
    case "coffeecorner":
      return [
        { name: "Koffie", nameEn: "Coffee", icon: "/src/assets/afbeeldingen/coffee-corner/coffee-icon.jpg", id: "coffee-specialties" },
        { name: "Koude Dranken", nameEn: "Cold Drinks", icon: "/src/assets/afbeeldingen/coffee-corner/cold-icon.jpg", id: "cold-drinks" },
        { name: "Warme Dranken", nameEn: "Hot Drinks", icon: "/src/assets/afbeeldingen/coffee-corner/hot-icon.jpg", id: "hot-drinks" },
        { name: "Gebak", nameEn: "Pastries", icon: "/src/assets/afbeeldingen/coffee-corner/pastry-icon.jpg", id: "pastries" },
      ];
    default:
      return [
        { name: "Popular", icon: "/icons/popular.png", id: "popular" },
        { name: "Curry", icon: "/icons/curry.png", id: "curry" },
        { name: "Ramen", icon: "/icons/ramen.png", id: "ramen" },
        { name: "Pizza", icon: "/icons/pizza.png", id: "pizza" },
        { name: "Drinks", icon: "/icons/drink.png", id: "drinks" },
      ];
  }
};

const toppingsData = [
  { name: "extra kaas", nameEn: "extra cheese", price: 0.75 },
  { name: "extra augurk", nameEn: "extra pickle", price: 0.75 },
  { name: "extra jalopenos", nameEn: "extra jalapeños", price: 0.75 },
];

// Translation object
const translations = {
  nl: {
    orderButton: "Bestel",
    items: "gerecht",
    itemsPlural: "gerechten",
    for: "voor",
    yourOrder: "Jouw bestelling",
    subtotal: "Subtotal", 
    continue: "Doorgaan",
    addToOrder: "Toevoegen aan bestelling",
    chooseSpicy: "Keuze Original/Spicy",
    chooseUpTo1: "Kies maximaal 1",
    addToppings: "Toppings toevoegen",
    chooseUpTo7: "Kies maximaal 7",
    nutritionalInfo: "Voedingswaarden",
    allergenInfo: "Allergeen Informatie",
    chefRecommendations: "Chef's Aanbevelingen",
    preparationTime: "Bereidingstijd",
    calories: "Calorieën",
    protein: "Eiwitten",
    carbs: "Koolhydraten",
    fat: "Vetten",
    fiber: "Vezels",
    sugar: "Suikers",
    sodium: "Natrium",
    contains: "Bevat",
    mayContain: "Kan sporen bevatten van",
    preparation: "Dit gerecht wordt bereid in een keuken die alle allergenen verwerkt",
    bestEnjoyed: "Het beste vers en warm geserveerd voor optimale smaak",
    pairsWell: "Combineert uitstekend met onze signature huissaus",
    addVeggies: "Overweeg extra groenten voor meer voeding",
    perfectSharing: "Perfect om te delen of als stevige individuele maaltijd",
    estimatedTime: "Geschatte bereidingstijd",
    freshOrder: "We bereiden elk gerecht vers op bestelling voor de beste kwaliteit en smaak."
  },
  en: {
    orderButton: "Order",
    items: "item",
    itemsPlural: "items", 
    for: "for",
    yourOrder: "Your Order",
    subtotal: "Subtotal",
    continue: "Continue",
    addToOrder: "Add to order",
    chooseSpicy: "Choose Original/Spicy",
    chooseUpTo1: "Choose up to 1",
    addToppings: "Add Toppings",
    chooseUpTo7: "Choose up to 7", 
    nutritionalInfo: "Nutritional Information",
    allergenInfo: "Allergen Information",
    chefRecommendations: "Chef's Recommendations",
    preparationTime: "Preparation Time",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbohydrates",
    fat: "Fat",
    fiber: "Fiber",
    sugar: "Sugar",
    sodium: "Sodium",
    contains: "Contains",
    mayContain: "May contain traces of",
    preparation: "This dish is prepared in a kitchen that handles all major allergens",
    bestEnjoyed: "Best enjoyed fresh and hot for optimal taste",
    pairsWell: "Pairs excellently with our signature house sauce",
    addVeggies: "Consider adding extra vegetables for enhanced nutrition",
    perfectSharing: "Perfect for sharing or as a hearty individual meal",
    estimatedTime: "Estimated preparation time",
    freshOrder: "We prepare each dish fresh to order for the best quality and taste."
  }
};

const getTranslation = (isEnglish: boolean) => isEnglish ? translations.en : translations.nl;

const getThemeConfig = (theme: string) => {
  switch (theme) {
    case "spicepalace":
      return {
        name: "Spice Palace",
        icon: <Flame className="w-5 h-5 text-white" />,
        bgColor: "bg-gradient-to-b from-red-700 via-red-800 to-red-900",
        headerBg: "bg-gradient-to-r from-red-600 to-red-700",
        textColor: "text-white",
        categoryBg: "bg-white/95 border-2 border-amber-200 shadow-lg",
        categoryHoverBg: "bg-amber-300 border-2 border-amber-400 shadow-xl",
        categoryTextColor: "text-red-700",
        buttonColor: "bg-black text-white hover:bg-gray-800 font-semibold shadow-lg",
        cardBg: "bg-white/95 backdrop-blur-sm border border-amber-200",
        cardTextColor: "text-gray-800",
      };
    case "sweetdelights":
      return {
        name: "Sweet Delights",
        icon: <img src="/src/assets/afbeeldingen/sweet-delights/logo.png" alt="Sweet Delights Logo" className="w-5 h-5" />,
        bgColor: "bg-gradient-to-b from-pink-100 to-pink-200",
        headerBg: "bg-pink-500",
        textColor: "text-gray-800",
        categoryBg: "bg-pink-400",
        categoryHoverBg: "bg-pink-500",
        categoryTextColor: "text-white",
        buttonColor: "bg-pink-500 hover:bg-pink-600",
        cardBg: "bg-white",
        cardTextColor: "text-gray-800",
      };
    case "coffeecorner":
      return {
        name: "Coffee Corner",
        icon: <Coffee className="w-5 h-5 text-white" />,
        bgColor: "bg-gradient-to-b from-amber-100 to-amber-200",
        headerBg: "bg-amber-600",
        textColor: "text-amber-800",
        categoryBg: "bg-amber-500",
        categoryHoverBg: "bg-amber-600",
        categoryTextColor: "text-white",
        buttonColor: "bg-green-600 hover:bg-green-700",
        cardBg: "bg-white",
        cardTextColor: "text-gray-800",
      };
    default:
      return {
        name: "TableTech",
        icon: null,
        bgColor: "bg-white",
        headerBg: "bg-[#7b4f35]",
        textColor: "text-gray-800",
        categoryBg: "bg-yellow-300",
        categoryHoverBg: "bg-orange-200 hover:bg-yellow-200",
        categoryTextColor: "text-gray-800",
        buttonColor: "bg-green-500 hover:bg-green-600",
        cardBg: "bg-white",
        cardTextColor: "text-gray-800",
      };
  }
};

const PhoneMockup: React.FC<PhoneMockupProps> = ({ theme = "tabletech" }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasCartAppeared, setHasCartAppeared] = useState(false);
  const [floaters, setFloaters] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isEnglish, setIsEnglish] = useState(false);

  const mockMenu = getMenuForTheme(theme);
  const categories = getCategoriesForTheme(theme);
  const themeConfig = getThemeConfig(theme);

  // Reset states when theme changes
  useEffect(() => {
    setSelectedItem(null);
    setCartOpen(false);
    setSelectedToppings([]);
    setActiveCategory("popular");
    setCart([]); // Reset cart when switching themes
    setHasCartAppeared(false);
    setFloaters([]);
  }, [theme]);

  const sectionRefs = React.useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
    categories.forEach(cat => {
      refs[cat.id] = React.createRef<HTMLDivElement>();
    });
    return refs;
  }, [categories]);

  const scrollToSection = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    const targetSection = sectionRefs[categoryId]?.current;
    
    if (mainScrollContainer && targetSection) {
      const containerRect = mainScrollContainer.getBoundingClientRect();
      const sectionRect = targetSection.getBoundingClientRect();
      const scrollOffset = sectionRect.top - containerRect.top + mainScrollContainer.scrollTop - 10;
      
      mainScrollContainer.scrollTop = Math.max(0, scrollOffset);
    }
  };

  // Add scroll tracking for categories
  useEffect(() => {
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    if (!mainScrollContainer) return;

    const updateActiveCategory = () => {
      for (const categoryId of categories.map(c => c.id)) {
        const section = sectionRefs[categoryId]?.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          const containerRect = mainScrollContainer.getBoundingClientRect();
          
          if (rect.top <= containerRect.top + 100 && rect.bottom > containerRect.top + 50) {
            if (activeCategory !== categoryId) {
              setActiveCategory(categoryId);
            }
            break;
          }
        }
      }
    };

    mainScrollContainer.addEventListener('scroll', updateActiveCategory, { passive: true });
    
    return () => {
      mainScrollContainer.removeEventListener('scroll', updateActiveCategory);
    };
  }, [activeCategory, sectionRefs, categories]);

  const addToCart = (id: number, category: CategoryId, withToppings: string[] = []) => {
    const item = mockMenu[category].find((i) => i.id === id);
    if (!item) return;
    
    // Calculate toppings price
    const toppingsPrice = withToppings
      .map((toppingName) => toppingsData.find((top) => (isEnglish ? top.nameEn : top.name) === toppingName)?.price || 0)
      .reduce((a, b) => a + b, 0);
    
    const cartItem: CartItem = {
      ...item,
      toppings: withToppings.length > 0 ? withToppings : undefined,
      toppingsPrice: toppingsPrice > 0 ? toppingsPrice : undefined
    };
    
    // Debug log om te controleren of toppings correct worden opgeslagen
    console.log('Adding to cart:', cartItem);
    
    setCart((prev) => [...prev, cartItem]);
    setFloaters((prev) => [...prev, id]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f !== id));
    }, 500);
  };

  useEffect(() => {
    if (cart.length > 0 && !hasCartAppeared) {
      setHasCartAppeared(true);
    }
  }, [cart.length, hasCartAppeared]);

  const total = cart.reduce((sum, item) => sum + item.price + (item.toppingsPrice || 0), 0).toFixed(2);
  const translations = getTranslation(isEnglish);

  const extraTotal = selectedToppings
    .map((toppingName) => toppingsData.find((top) => (isEnglish ? top.nameEn : top.name) === toppingName)?.price || 0)
    .reduce((a, b) => a + b, 0);

  const buttonTotal = selectedItem
    ? (selectedItem.price + extraTotal).toFixed(2)
    : "0.00";

  const renderMenuSection = (categoryId: CategoryId) => {
    const items = mockMenu[categoryId];
    if (!items || items.length === 0) return null;

    // TableTech gebruikt de originele compacte grid layout
    if (theme === "tabletech") {
      return (
        <div ref={sectionRefs[categoryId]} className="mb-6" key={`section-${categoryId}`}>
          <h2 className="text-lg font-bold text-gray-800 mb-3 px-1 sticky -top-2 bg-white py-2 border-b border-gray-300 z-10">
            {categories.find((c) => c.id === categoryId)?.name}
          </h2>
          <div className="grid grid-cols-2 gap-3 px-1">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.category}-tabletech`}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col items-center bg-white ring-1 ring-gray-200 rounded-2xl overflow-hidden p-3 pb-3 transform transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full aspect-square object-cover rounded-lg mb-2"
                />
                <h3 className="text-sm font-semibold text-center leading-tight text-gray-800 mb-1">
                  {isEnglish && item.nameEn ? item.nameEn : item.name}
                </h3>
                {item.description && (
                  <p className="text-xs text-gray-500 text-center mb-2">
                    {isEnglish && item.descriptionEn ? item.descriptionEn : item.description}
                  </p>
                )}
                <div className="flex items-center w-full mt-auto">
                  <span className="text-base font-bold text-gray-600 flex-1">
                    €{item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.id, item.category, []);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors duration-150 relative z-10"
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <FaPlus size={14} className="text-white" />
                  </button>
                </div>

                <AnimatePresence>
                  {floaters.includes(item.id) && (
                    <motion.div
                      key={`floater-${item.id}`}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute text-sm font-semibold text-green-500 bottom-14 right-4 pointer-events-none z-20"
                    >
                      +1
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Andere thema's gebruiken de grote kaart layout
    return (
      <div ref={sectionRefs[categoryId]} className="mb-6" key={`section-${categoryId}`}>
        <h2 className={`text-lg font-bold mb-4 px-4 sticky top-0 py-3 border-b z-10 ${themeConfig.bgColor} ${themeConfig.textColor} backdrop-blur-md shadow-sm`}>
          {categories.find((c) => c.id === categoryId)?.name}
        </h2>
        <div className="space-y-4 px-3">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.category}-${theme}`}
              onClick={() => setSelectedItem(item)}
              className={`relative flex flex-col ${themeConfig.cardBg} rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4">
                <h3 className={`text-lg font-bold ${themeConfig.cardTextColor} mb-1 group-hover:text-red-700 transition-colors duration-300`}>
                  {isEnglish && item.nameEn ? item.nameEn : item.name}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {isEnglish && item.descriptionEn ? item.descriptionEn : item.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-red-600">
                    €{item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.id, item.category, []);
                    }}
                    className={`${themeConfig.buttonColor} px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md`}
                  >
                    {isEnglish ? "Order" : "Bestellen"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {floaters.includes(item.id) && (
                  <motion.div
                    key={`floater-${item.id}`}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute text-sm font-semibold text-green-500 bottom-14 right-4 pointer-events-none drop-shadow-lg"
                  >
                    +1
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    if (theme === "tabletech") {
      return (
        <div className={`flex items-center justify-between p-4 border-b shadow-sm ${themeConfig.headerBg}`}>
          <div className="text-lg font-bold text-white tracking-tight">
            TableTech.
          </div>
          <button 
            onClick={() => setIsEnglish(!isEnglish)}
            className="text-xs border border-white text-white px-3 py-1 rounded-full hover:bg-white hover:text-[#7b4f35] transition"
          >
            {isEnglish ? 'Nederlands' : 'English'}
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center justify-between p-4 ${themeConfig.headerBg} ${themeConfig.textColor} shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
            {themeConfig.icon}
          </div>
          <h1 className="text-xl font-bold text-white drop-shadow-sm">{themeConfig.name}</h1>
        </div>
        <button 
          onClick={() => setIsEnglish(!isEnglish)}
          className="text-xs border border-amber-200 text-amber-100 px-3 py-1.5 rounded-full hover:bg-amber-300 hover:text-red-800 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
        >
          <Globe className="w-3 h-3" />
          {isEnglish ? 'Nederlands' : 'English'}
        </button>
      </div>
    );
  };

  return (
    <div 
      data-phone-container="true"
      className={`relative w-[320px] h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-black flex flex-col font-sans ${theme === "tabletech" ? "bg-white" : themeConfig.bgColor}`}
    >
      {renderHeader()}

      {/* CATEGORIES - verschillende layouts per thema */}
      {theme === "tabletech" ? (
        // TableTech: Rechthoekige categorieën zoals in afbeelding
        <div 
          className="flex overflow-x-auto px-2 py-3 gap-3 border-b-2 border-gray-200 scrollbar-hide"
          data-horizontal-scroll="true"
          style={{ 
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((cat) => (
            <button
              key={`category-${cat.id}`}
              onClick={() => scrollToSection(cat.id)}
              className={`flex flex-col items-center min-w-[70px] text-xs rounded-lg px-3 py-2 transition shadow-sm ${
                activeCategory === cat.id
                  ? "bg-yellow-300 text-gray-800"
                  : "bg-orange-200 hover:bg-yellow-200 text-gray-800"
              }`}
            >
              <img
                src={cat.icon}
                alt={cat.name}
                loading="lazy"
                className="w-6 h-6 mb-1 object-contain"
              />
              {isEnglish && cat.nameEn ? cat.nameEn : cat.name}
            </button>
          ))}
        </div>
      ) : (
        // Andere thema's: Cirkelvormige scroll
        <div 
          className="flex overflow-x-auto px-4 py-4 gap-4 scrollbar-hide"
          data-horizontal-scroll="true"
          style={{ 
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((cat) => (
            <div
              key={`category-${cat.id}`}
              onClick={() => scrollToSection(cat.id)}
              className="flex flex-col items-center min-w-[70px] cursor-pointer group"
            >
              <div
                className={`w-16 h-16 rounded-full mb-2 overflow-hidden border-2 transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "border-amber-300 shadow-xl scale-110 ring-2 ring-amber-400/50"
                    : "border-white/60 hover:border-amber-200/80 hover:shadow-lg hover:scale-105"
                }`}
              >
                <img
                  src={cat.icon}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <span className={`text-xs text-center font-medium transition-all duration-300 ${
                theme === "spicepalace" 
                  ? activeCategory === cat.id 
                    ? "text-amber-200 drop-shadow-sm" 
                    : "text-white/90 group-hover:text-amber-100"
                  : themeConfig.textColor
              }`}>
                {isEnglish && cat.nameEn ? cat.nameEn : cat.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MAIN SCROLLABLE AREA */}
      <div 
        data-phone-scroll-container="true"
        className="flex-1 overflow-y-auto pt-2 pb-40"
        style={{ 
          scrollBehavior: 'auto',
          overscrollBehavior: 'contain'
        }}
      >
        {categories.map((cat) => renderMenuSection(cat.id))}
      </div>

      <AnimatePresence>
        {cart.length > 0 && !selectedItem && !cartOpen && (
          <>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-40" />
            <motion.div
              onClick={() => setCartOpen(true)}
              key={cart.length}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute bottom-5 left-4 right-4 z-50 ${theme === "tabletech" ? "bg-orange-600" : theme === "spicepalace" ? "bg-black" : "bg-gray-800"} text-white py-4 px-4 rounded-full text-sm font-bold text-center cursor-pointer shadow-xl transition-all duration-200 ${theme === "tabletech" ? "hover:bg-orange-700" : theme === "spicepalace" ? "hover:bg-gray-800" : "hover:bg-gray-900"} flex items-center justify-center gap-2 transform hover:scale-105`}
            >
              {theme === "tabletech" ? (
                // TableTech: Originele eenvoudige layout
                <>
                  {translations.orderButton} {cart.length} {cart.length === 1 ? translations.items : translations.itemsPlural} {translations.for}{" "}
                  <motion.span
                    key={total}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    €{total}
                  </motion.span>
                </>
              ) : (
                // Andere thema's: Moderne layout met cirkel
                <motion.div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-gray-800 text-xs font-bold">{cart.length}</span>
                  </div>
                  <span className="font-semibold">{translations.orderButton}</span>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block font-bold text-lg"
                  >
                    €{total}
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="absolute inset-0 bg-black/50 z-50"
            onClick={() => setCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl flex flex-col h-5/6 overflow-hidden"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                ease: [0.16, 1, 0.3, 1],
                duration: 0.6,
              }}
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold">{translations.yourOrder}</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close basket"
                  className="group p-0 rounded-full transition hover:bg-gray-200 focus:outline-none"
                >
                  <span className="text-3xl font-bold text-gray-700 group-hover:text-black leading-none">
                    ×
                  </span>
                </button>
              </div>

              <div 
                className="flex-1 overflow-y-auto"
                data-phone-scroll-container="true"
                data-phone-cart-scroll="true"
                style={{ 
                  scrollBehavior: 'auto',
                  overscrollBehavior: 'contain'
                }}
              >
                {[...new Set(cart.map((i) => `${i.id}|||${JSON.stringify(i.toppings || [])}`))]
                  .map((uniqueKey) => {
                    const [idStr, toppingsStr] = uniqueKey.split('|||');
                    const id = parseInt(idStr);
                    let toppings: string[] = [];
                    
                    // Safe JSON parsing to prevent crashes
                    try {
                      toppings = JSON.parse(toppingsStr || '[]');
                    } catch (error) {
                      console.warn('JSON parse error:', error);
                      toppings = [];
                    }
                    
                    const matchingItems = cart.filter((i) => 
                      i.id === id && JSON.stringify(i.toppings || []) === JSON.stringify(toppings)
                    );
                    const item = matchingItems[0];
                    
                    if (!item) return null; // Safety check
                    
                    const qty = matchingItems.length;
                    
                    return (
                      <div
                        key={uniqueKey}
                        className="flex items-start justify-between p-3 pr-2 border-b"
                      >
                        <div className="flex items-start space-x-4 flex-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-0.5">
                              {isEnglish && item.nameEn ? item.nameEn : item.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              €{item.price.toFixed(2)}
                            </p>
                            {item.toppings && item.toppings.length > 0 && (
                              <div className="text-xs text-gray-400 mt-1 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                                <span className="font-medium text-gray-600">Toppings: </span>
                                <span className="text-orange-600 font-medium">
                                  {item.toppings.map(topping => 
                                    topping.replace(/^extra\s+/i, '')
                                  ).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-2">
                          <button
                            onClick={() => {
                              const itemToRemove = cart.find((cartItem) => 
                                cartItem.id === id && JSON.stringify(cartItem.toppings || []) === JSON.stringify(toppings)
                              );
                              if (itemToRemove) {
                                setCart((prev) => {
                                  const idx = prev.findIndex((i) => i === itemToRemove);
                                  if (idx >= 0) {
                                    const copy = [...prev];
                                    copy.splice(idx, 1);
                                    return copy;
                                  }
                                  return prev;
                                });
                              }
                            }}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold">{qty}</span>
                          <button
                            onClick={() => addToCart(id, item.category, toppings)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="px-4 py-2 border-t flex justify-between items-center font-semibold">
                <span>{translations.subtotal}</span>
                <span className="text-lg font-bold">€{total}</span>
              </div>

              <div className="p-4">
                <button className={`w-full ${theme === "tabletech" ? "bg-orange-600 hover:bg-orange-700" : theme === "spicepalace" ? "bg-black hover:bg-gray-800" : "bg-black hover:bg-gray-900"} text-white py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}>
                  {translations.continue}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              ease: [0.16, 1, 0.3, 1],
              duration: 0.6,
            }}
            className="absolute inset-0 z-40 bg-white flex flex-col"
            data-phone-container="true"
          >
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                loading="lazy"
                className="w-full h-44 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 active:bg-gray-600 transition-colors duration-150"
              >
                <IoArrowBack size={20} className="text-gray-800" />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <div 
                className="p-4 h-full overflow-y-auto pb-[120px] flex flex-col gap-4"
                data-phone-scroll-container="true"
                data-product-detail-scroll="true"
                style={{ 
                  scrollBehavior: 'auto',
                  overscrollBehavior: 'contain',
                  maxHeight: 'calc(100vh - 200px)'
                }}
              >
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    {isEnglish && selectedItem.nameEn ? selectedItem.nameEn : selectedItem.name}
                  </h2>
                  <p className="text-xl font-semibold text-gray-500 mt-1">
                    €{selectedItem.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedItem.description || selectedItem.descriptionEn || (isEnglish 
                    ? "This is a delicious example dish with rich flavor and presentation. Perfect for sharing or enjoying as a main course. Made with fresh ingredients and expertly prepared by our chefs."
                    : "Dit is een heerlijk voorbeeldgerecht met rijke smaak en presentatie. Perfect om te delen of te genieten als hoofdgerecht. Gemaakt met verse ingrediënten en vakkundig bereid door onze chefs."
                  )}
                </p>

                {theme === "tabletech" && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">
                        {translations.chooseSpicy}
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">{translations.chooseUpTo1}</p>
                      <div className="flex flex-col gap-3">
                        {["Spicy", "Original"].map((option) => (
                          <label
                            key={`flavor-${option}`}
                            className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white cursor-pointer transition"
                          >
                            <input
                              type="radio"
                              name="flavor"
                              className="accent-black w-4 h-4"
                            />
                            <span className="font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">
                        {translations.addToppings}
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">{translations.chooseUpTo7}</p>
                      <div className="flex flex-col gap-3">
                        {toppingsData.map((top) => (
                          <label
                            key={`topping-${isEnglish ? top.nameEn : top.name}-${selectedItem?.id}`}
                            className="flex justify-between items-center text-sm p-3 rounded-lg hover:bg-white cursor-pointer transition"
                          >
                            <div>
                              <span className="block font-medium">{isEnglish ? top.nameEn : top.name}</span>
                              <span className="text-xs text-gray-500">
                                +€{top.price.toFixed(2)}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedToppings.includes(isEnglish ? top.nameEn : top.name)}
                              onChange={() => {
                                const toppingName = isEnglish ? top.nameEn : top.name;
                                setSelectedToppings((prev) =>
                                  prev.includes(toppingName)
                                    ? prev.filter((item) => item !== toppingName)
                                    : [...prev, toppingName]
                                );
                              }}
                              className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-black checked:border-black hover:border-gray-500 active:border-gray-600 transition-colors duration-150"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="h-20"></div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-4 h-14 bg-white z-10" />
            <div className="pointer-events-none absolute bottom-12 left-0 right-4 h-24 bg-gradient-to-t from-white to-transparent z-10" />

            <div className="absolute bottom-4 left-4 right-4 z-50">
              <button
                onClick={() => {
                  if (theme === "tabletech" && selectedToppings.length > 0) {
                    addToCart(selectedItem.id, selectedItem.category, selectedToppings);
                  } else {
                    addToCart(selectedItem.id, selectedItem.category);
                  }
                  setSelectedItem(null);
                  setSelectedToppings([]);
                }}
                className={`w-full ${theme === "spicepalace" ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" : "bg-black hover:bg-gray-900"} text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
              >
                {translations.addToOrder} • €{buttonTotal}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneMockup;