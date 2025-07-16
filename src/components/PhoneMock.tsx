import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { Flame, Coffee, Globe } from "lucide-react";

interface PhoneMockupProps {
  theme?: string;
}

type CategoryId = "all" | "popular" | "curry" | "ramen" | "pizza" | "drinks" | "handi" | "kebab" | "rice" | "bbq" | "karahi" | "tandoori" | "cakes" | "coffee-specialties" | "cold-drinks" | "hot-drinks" | "pastries";

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

interface ToppingItem {
  name: string;
  nameEn: string;
  price: number;
}

// TableTech menu (original)
const tableTechMenu: Record<CategoryId, MenuItem[]> = {
  all: [],
  popular: [
    {
      id: 1,
      name: "Prawn Raisukaree",
      price: 12.0,
      image: "/menu/menu1.jpg",
      category: "popular",
      description: "Sappige garnalen in een romige kokoskaree saus met verse kruiden en basmati rijst.",
      descriptionEn: "Juicy prawns in a creamy coconut curry sauce with fresh herbs and basmati rice.",
    },
    {
      id: 2,
      name: "Firecracker Prawn",
      price: 11.0,
      image: "/menu/menu2.jpg",
      category: "popular",
      description: "Knapperige garnalen met een pittige sweet chili glaze en verse koriander.",
      descriptionEn: "Crispy prawns with a spicy sweet chili glaze and fresh coriander.",
    },
  ],
  curry: [
    {
      id: 3,
      name: "Chicken Katsu Curry",
      price: 10.5,
      image: "/menu/menu3.jpg",
      category: "curry",
      description: "Knapperige gepaneerde kip met Japanse curry saus en gestoomde rijst.",
      descriptionEn: "Crispy breaded chicken with Japanese curry sauce and steamed rice.",
    },
    {
      id: 4,
      name: "Vegetable Curry",
      price: 9.0,
      image: "/menu/menu4.jpg",
      category: "curry",
      description: "Verse seizoensgroenten in een aromatische curry saus met kokosmelk.",
      descriptionEn: "Fresh seasonal vegetables in an aromatic curry sauce with coconut milk.",
    },
  ],
  ramen: [
    {
      id: 5,
      name: "Tofu Firecracker Ramen",
      price: 9.75,
      image: "/menu/menu5.jpg",
      category: "ramen",
      description: "Pittige ramen met knapperige tofu, verse groenten en een gekookt ei.",
      descriptionEn: "Spicy ramen with crispy tofu, fresh vegetables and a soft-boiled egg.",
    },
    {
      id: 6,
      name: "Chilli Steak Ramen",
      price: 8.95,
      image: "/menu/menu4.jpg",
      category: "ramen",
      description: "Rijke ramen bouillon met malse steak strips, chilipeper en verse lente-ui.",
      descriptionEn: "Rich ramen broth with tender steak strips, chili pepper and fresh spring onions.",
    },
  ],
  pizza: [
    {
      id: 7,
      name: "Margherita Pizza",
      price: 8.5,
      image: "/menu/menu1.jpg",
      category: "pizza",
      description: "Klassieke pizza met verse tomaten, mozzarella en basilicum op dunne bodem.",
      descriptionEn: "Classic pizza with fresh tomatoes, mozzarella and basil on thin crust.",
    },
    {
      id: 8,
      name: "Pepperoni Pizza",
      price: 9.5,
      image: "/menu/menu2.jpg",
      category: "pizza",
      description: "Pittige pepperoni pizza met extra kaas en oregano op knapperige bodem.",
      descriptionEn: "Spicy pepperoni pizza with extra cheese and oregano on crispy crust.",
    },
  ],
  drinks: [
    {
      id: 9,
      name: "Fresh Lemonade",
      price: 3.5,
      image: "src/assets/afbeeldingen/lemonade.jpg",
      category: "drinks",
      description: "Verse limonade gemaakt van echte citroenen met een vleugje munt.",
      descriptionEn: "Fresh lemonade made from real lemons with a hint of mint.",
    },
    {
      id: 10,
      name: "Iced Green Tea",
      price: 2.95,
      image: "src/assets/afbeeldingen/green-tea-with-ice-glass_.jpg",
      category: "drinks",
      description: "Verfrissende ijskoude groene thee met natuurlijke antioxidanten.",
      descriptionEn: "Refreshing ice-cold green tea with natural antioxidants.",
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
  all: [],
  popular: [
    {
      id: 101,
      name: "Kip Handi Special",
      nameEn: "Chicken Handi Special",
      price: 16.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi1.png",
      category: "popular",
      description: "Malse kipstukjes langzaam gestoofd in een traditionele klei pot met verse kruiden, tomaten en ui. Geserveerd met aromatische basmati rijst en warme naan.",
      descriptionEn: "Tender chicken pieces slowly stewed in a traditional clay pot with fresh herbs, tomatoes and onions. Served with aromatic basmati rice and warm naan.",
    },
    {
      id: 102,
      name: "Lams Handi",
      nameEn: "Lamb Handi",
      price: 18.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi2.png",
      category: "popular",
      description: "Succulent lamsvlees in een rijke, kruidige saus met verse koriander en garam masala. Een authentiek gerecht uit de Punjab streek.",
      descriptionEn: "Succulent lamb in a rich, spicy sauce with fresh coriander and garam masala. An authentic dish from the Punjab region.",
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
      description: "Malse kipstukjes langzaam gestoofd in een traditionele klei pot met verse kruiden, tomaten en ui. Geserveerd met aromatische basmati rijst en warme naan.",
      descriptionEn: "Tender chicken pieces slowly stewed in a traditional clay pot with fresh herbs, tomatoes and onions. Served with aromatic basmati rice and warm naan.",
    },
    {
      id: 104,
      name: "Lams Handi",
      nameEn: "Lamb Handi",
      price: 18.5,
      image: "/src/assets/afbeeldingen/spice-palace/handi2.png",
      category: "handi",
      description: "Succulent lamsvlees in een rijke, kruidige saus met verse koriander en garam masala. Perfect voor liefhebbers van intense smaken.",
      descriptionEn: "Succulent lamb in a rich, spicy sauce with fresh coriander and garam masala. Perfect for lovers of intense flavors.",
    },
    {
      id: 105,
      name: "Vegetarische Handi",
      nameEn: "Vegetarian Handi",
      price: 14.0,
      image: "/src/assets/afbeeldingen/spice-palace/handi3.png",
      category: "handi",
      description: "Een kleurrijke mix van seizoensgroenten zoals aubergine, bloemkool en erwten in een aromatische masala saus. Vegetarisch genieten op zijn best.",
      descriptionEn: "A colorful mix of seasonal vegetables like eggplant, cauliflower and peas in an aromatic masala sauce. Vegetarian enjoyment at its best.",
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
      description: "Een heerlijke combinatie van gegrilde kip, lam en gehakt kebab, gemarineerd in yoghurt en speciale kruiden. Geserveerd met verse salade en mintchutney.",
      descriptionEn: "A delicious combination of grilled chicken, lamb and minced kebab, marinated in yogurt and special spices. Served with fresh salad and mint chutney.",
    },
    {
      id: 107,
      name: "Broodje Kebab",
      nameEn: "Kebab Sandwich",
      price: 8.5,
      image: "/src/assets/afbeeldingen/spice-palace/kebab-sandwich.png",
      category: "kebab",
      description: "Vers gegrilde kebab in warm pita brood met knapperige sla, tomaten, ui en een keuze uit verschillende sauzen. Perfect voor een snelle maar smaakvolle maaltijd.",
      descriptionEn: "Freshly grilled kebab in warm pita bread with crispy lettuce, tomatoes, onions and a choice of various sauces. Perfect for a quick but flavorful meal.",
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
      description: "Wok-gebakken basmati rijst met verse groenten, ei en sojasaus. Een perfecte balans tussen Aziatische en Indiase smaken, gegarneerd met verse lente-ui.",
      descriptionEn: "Wok-fried basmati rice with fresh vegetables, egg and soy sauce. A perfect balance between Asian and Indian flavors, garnished with fresh spring onions.",
    },
    {
      id: 109,
      name: "Biryani Rijst",
      nameEn: "Biryani Rice",
      price: 14.0,
      image: "/src/assets/afbeeldingen/spice-palace/rice-dish.png",
      category: "rice",
      description: "Aromatische basmati rijst gekookt met saffraan, kardemom en kaneelstokjes. Elke korrel is doordrenkt met de rijke smaken van authentieke Indiase kruiden.",
      descriptionEn: "Aromatic basmati rice cooked with saffron, cardamom and cinnamon sticks. Each grain is infused with the rich flavors of authentic Indian spices.",
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
      description: "Sappige spareribs langzaam gegrild en gemarineerd in onze huisgemaakte BBQ saus met honing en specerijen. Geserveerd met crispy frites en coleslaw.",
      descriptionEn: "Juicy spareribs slowly grilled and marinated in our homemade BBQ sauce with honey and spices. Served with crispy fries and coleslaw.",
    },
    {
      id: 111,
      name: "BBQ Mixed Grill",
      nameEn: "BBQ Mixed Grill",
      price: 22.0,
      image: "/src/assets/afbeeldingen/spice-palace/bbq-mixed.png",
      category: "bbq",
      description: "Een royale selectie van gegrilde specialiteiten: kip tikka, lam seekh kebab, spareribs en gegrilde groenten. Perfect om te delen met vrienden.",
      descriptionEn: "A generous selection of grilled specialties: chicken tikka, lamb seekh kebab, spareribs and grilled vegetables. Perfect for sharing with friends.",
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
      description: "Authentieke Pakistaanse kip karahi bereid in een wok met verse tomaten, gember, knoflook en groene pepers. Een explosie van smaken in elke hap.",
      descriptionEn: "Authentic Pakistani chicken karahi prepared in a wok with fresh tomatoes, ginger, garlic and green peppers. An explosion of flavors in every bite.",
    },
    {
      id: 113,
      name: "Curry Schotel",
      nameEn: "Curry Plate",
      price: 18.0,
      image: "/src/assets/afbeeldingen/spice-palace/curry-plate.png",
      category: "karahi",
      description: "Een rijke, romige curry met tender vlees in een saus van kokosmelk, ui en een geheime mix van garam masala kruiden. Geserveerd met basmati rijst.",
      descriptionEn: "A rich, creamy curry with tender meat in a sauce of coconut milk, onions and a secret mix of garam masala spices. Served with basmati rice.",
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
      description: "Vers gebakken naan brood uit de tandoor oven, rijkelijk belegd met verse knoflook en koriander. Perfect als bijgerecht bij elke curry.",
      descriptionEn: "Freshly baked naan bread from the tandoor oven, generously topped with fresh garlic and coriander. Perfect as a side dish with any curry.",
    },
    {
      id: 115,
      name: "Tandoori Kip",
      nameEn: "Tandoori Chicken",
      price: 16.0,
      image: "/src/assets/afbeeldingen/spice-palace/ramen-dark.png",
      category: "tandoori",
      description: "Malse kip gemarineerd in yoghurt en tandoori kruiden, gegrild in de traditionele klei-oven. Geserveerd met muntchutney en verse ui.",
      descriptionEn: "Tender chicken marinated in yogurt and tandoori spices, grilled in the traditional clay oven. Served with mint chutney and fresh onions.",
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
  all: [],
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
  all: [],
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

const getMenuForTheme = (theme: string): Record<CategoryId, MenuItem[]> => {
  let baseMenu: Record<CategoryId, MenuItem[]>;
  
  switch (theme) {
    case "spicepalace":
      baseMenu = { ...spicePalaceMenu };
      break;
    case "sweetdelights":
      baseMenu = { ...sweetDelightsMenu };
      break;
    case "coffeecorner":
      baseMenu = { ...coffeeCornerMenu };
      break;
    default:
      baseMenu = { ...tableTechMenu };
      break;
  }
  
  // Populate "all" category with all non-empty categories, removing duplicates
  const allItems: MenuItem[] = [];
  const seenIds = new Set<number>();
  Object.entries(baseMenu).forEach(([key, items]) => {
    if (key !== "all" && items.length > 0) {
      items.forEach(item => {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          allItems.push(item);
        }
      });
    }
  });
  baseMenu.all = allItems;
  
  return baseMenu;
};

const getCategoriesForTheme = (theme: string): CategoryItem[] => {
  switch (theme) {
    case "spicepalace":
      return [
        { name: "Alles", nameEn: "All", icon: "🔥", id: "all" },
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
        { name: "All", icon: "/icons/popular.png", id: "all" },
        { name: "Curry", icon: "/icons/curry.png", id: "curry" },
        { name: "Ramen", icon: "/icons/ramen.png", id: "ramen" },
        { name: "Pizza", icon: "/icons/pizza.png", id: "pizza" },
        { name: "Drinks", icon: "/icons/drink.png", id: "drinks" },
      ];
  }
};

const toppingsData: ToppingItem[] = [
  { name: "extra kaas", nameEn: "extra cheese", price: 0.75 },
  { name: "extra augurk", nameEn: "extra pickle", price: 0.75 },
  { name: "extra jalopenos", nameEn: "extra jalapeños", price: 0.75 },
];

// TableTech specific toppings per category
const tableTechToppings: Record<CategoryId, ToppingItem[]> = {
  all: [
    { name: "extra kaas", nameEn: "extra cheese", price: 0.75 },
    { name: "extra augurk", nameEn: "extra pickle", price: 0.75 },
    { name: "extra jalopenos", nameEn: "extra jalapeños", price: 0.75 },
  ],
  popular: [
    { name: "extra kaas", nameEn: "extra cheese", price: 0.75 },
    { name: "extra augurk", nameEn: "extra pickle", price: 0.75 },
    { name: "extra jalopenos", nameEn: "extra jalapeños", price: 0.75 },
    { name: "extra rijst", nameEn: "extra rice", price: 1.50 },
  ],
  curry: [
    { name: "extra rijst", nameEn: "extra rice", price: 1.50 },
    { name: "extra naan brood", nameEn: "extra naan bread", price: 2.00 },
    { name: "extra groenten", nameEn: "extra vegetables", price: 1.25 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.50 },
    { name: "extra kokosmelk", nameEn: "extra coconut milk", price: 0.75 },
  ],
  ramen: [
    { name: "extra noedels", nameEn: "extra noodles", price: 1.75 },
    { name: "extra ei", nameEn: "extra egg", price: 1.50 },
    { name: "extra groenten", nameEn: "extra vegetables", price: 1.25 },
    { name: "extra tofu", nameEn: "extra tofu", price: 2.00 },
    { name: "extra vlees", nameEn: "extra meat", price: 2.50 },
    { name: "extra pittig", nameEn: "extra spicy", price: 0.00 },
  ],
  pizza: [
    { name: "extra kaas", nameEn: "extra cheese", price: 1.50 },
    { name: "extra pepperoni", nameEn: "extra pepperoni", price: 2.00 },
    { name: "extra champignons", nameEn: "extra mushrooms", price: 1.25 },
    { name: "extra olijven", nameEn: "extra olives", price: 1.00 },
    { name: "extra tomaten", nameEn: "extra tomatoes", price: 1.00 },
    { name: "extra basilicum", nameEn: "extra basil", price: 0.75 },
  ],
  drinks: [
    { name: "met ijsblokjes", nameEn: "with ice cubes", price: 0.00 },
    { name: "zonder ijsblokjes", nameEn: "without ice cubes", price: 0.00 },
    { name: "extra citroen", nameEn: "extra lemon", price: 0.50 },
    { name: "extra munt", nameEn: "extra mint", price: 0.50 },
    { name: "extra zoet", nameEn: "extra sweet", price: 0.00 },
    { name: "minder zoet", nameEn: "less sweet", price: 0.00 },
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

// Spice Palace specific toppings per category
const spicePalaceToppings: Record<CategoryId, ToppingItem[]> = {
  all: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
    { name: "extra rijst", nameEn: "extra rice", price: 1.00 },
    { name: "extra naan", nameEn: "extra naan", price: 1.50 },
    { name: "extra raita", nameEn: "extra raita", price: 0.75 },
  ],
  handi: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
    { name: "extra ui", nameEn: "extra onion", price: 0.50 },
    { name: "extra yoghurt saus", nameEn: "extra yogurt sauce", price: 0.75 },
    { name: "extra basmati rijst", nameEn: "extra basmati rice", price: 1.00 },
    { name: "extra garlic naan", nameEn: "extra garlic naan", price: 1.50 },
    { name: "extra garam masala", nameEn: "extra garam masala", price: 0.75 },
    { name: "extra komijn", nameEn: "extra cumin", price: 0.50 },
  ],
  kebab: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra rode ui", nameEn: "extra red onion", price: 0.50 },
    { name: "extra tomaat", nameEn: "extra tomato", price: 0.50 },
    { name: "extra sla", nameEn: "extra lettuce", price: 0.50 },
    { name: "extra tzatziki", nameEn: "extra tzatziki", price: 0.75 },
    { name: "extra pita brood", nameEn: "extra pita bread", price: 1.00 },
    { name: "extra harissa saus", nameEn: "extra harissa sauce", price: 0.75 },
    { name: "extra augurk", nameEn: "extra pickles", price: 0.50 },
  ],
  rice: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
    { name: "extra amandelen", nameEn: "extra almonds", price: 1.00 },
    { name: "extra rozijnen", nameEn: "extra raisins", price: 0.75 },
    { name: "extra saffraan", nameEn: "extra saffron", price: 1.50 },
    { name: "extra kardemom", nameEn: "extra cardamom", price: 0.75 },
    { name: "extra ghee", nameEn: "extra ghee", price: 0.50 },
    { name: "extra kaneel", nameEn: "extra cinnamon", price: 0.50 },
  ],
  bbq: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra gegrilde ui", nameEn: "extra grilled onion", price: 0.50 },
    { name: "extra BBQ saus", nameEn: "extra BBQ sauce", price: 0.75 },
    { name: "extra knoflook", nameEn: "extra garlic", price: 0.50 },
    { name: "extra coleslaw", nameEn: "extra coleslaw", price: 1.00 },
    { name: "extra frites", nameEn: "extra fries", price: 1.50 },
    { name: "extra jalapeños", nameEn: "extra jalapeños", price: 0.75 },
    { name: "extra honing", nameEn: "extra honey", price: 0.50 },
  ],
  karahi: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
    { name: "extra gember", nameEn: "extra ginger", price: 0.75 },
    { name: "extra ui", nameEn: "extra onion", price: 0.50 },
    { name: "extra rijst", nameEn: "extra rice", price: 1.00 },
    { name: "extra naan", nameEn: "extra naan", price: 1.50 },
    { name: "extra groene peper", nameEn: "extra green pepper", price: 0.50 },
    { name: "extra tomaat", nameEn: "extra tomato", price: 0.50 },
  ],
  tandoori: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra yoghurt marinade", nameEn: "extra yogurt marinade", price: 0.75 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
    { name: "extra munt chutney", nameEn: "extra mint chutney", price: 0.75 },
    { name: "extra butter naan", nameEn: "extra butter naan", price: 1.50 },
    { name: "extra tandoori masala", nameEn: "extra tandoori masala", price: 0.75 },
    { name: "extra limoen", nameEn: "extra lime", price: 0.50 },
    { name: "extra rode ui", nameEn: "extra red onion", price: 0.50 },
  ],
  popular: [
    { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
    { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
    { name: "extra rijst", nameEn: "extra rice", price: 1.00 },
    { name: "extra naan", nameEn: "extra naan", price: 1.50 },
    { name: "extra raita", nameEn: "extra raita", price: 0.75 },
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

// Default spice palace toppings
const defaultSpicePalaceToppings: ToppingItem[] = [
  { name: "extra scherp", nameEn: "extra spicy", price: 0.50 },
  { name: "extra koriander", nameEn: "extra coriander", price: 0.75 },
  { name: "extra ui", nameEn: "extra onion", price: 0.50 },
  { name: "extra rijst", nameEn: "extra rice", price: 1.00 },
  { name: "extra naan", nameEn: "extra naan", price: 1.50 },
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

const getToppingsForTheme = (theme: string, category?: CategoryId): ToppingItem[] => {
  switch (theme) {
    case "spicepalace":
      if (category && spicePalaceToppings[category] && spicePalaceToppings[category].length > 0) {
        return spicePalaceToppings[category];
      }
      return defaultSpicePalaceToppings;
    case "tabletech":
      if (category && tableTechToppings[category] && tableTechToppings[category].length > 0) {
        return tableTechToppings[category];
      }
      return toppingsData;
    default:
      return toppingsData;
  }
};

interface ThemeConfig {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  headerBg: string;
  textColor: string;
  categoryBg: string;
  categoryHoverBg: string;
  categoryTextColor: string;
  buttonColor: string;
  cardBg: string;
  cardTextColor: string;
}

const getThemeConfig = (theme: string): ThemeConfig => {
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

// Image loading component for better UX
const ImageWithLoading: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">Afbeelding niet beschikbaar</span>
        </div>
      )}
    </div>
  );
};

const PhoneMockup: React.FC<PhoneMockupProps> = ({ theme = "tabletech" }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasCartAppeared, setHasCartAppeared] = useState(false);
  const [floaters, setFloaters] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isEnglish, setIsEnglish] = useState(false);

  const mockMenu = getMenuForTheme(theme);
  const categories = getCategoriesForTheme(theme);
  const themeConfig = getThemeConfig(theme);

  // Set initial category based on theme
  useEffect(() => {
    setActiveCategory("all");
  }, [theme]);

  // Reset states when theme changes
  useEffect(() => {
    setSelectedItem(null);
    setCartOpen(false);
    setSelectedToppings([]);
    setActiveCategory("all");
    setCart([]);
    setHasCartAppeared(false);
    setFloaters([]);
    
    // Reset scroll position to top when theme changes
    setTimeout(() => {
      const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
      if (mainScrollContainer) {
        mainScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, [theme]);

  const sectionRefs = React.useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
    categories.forEach(cat => {
      refs[cat.id] = React.createRef<HTMLDivElement>();
    });
    return refs;
  }, [categories]);

  const scrollToSection = useCallback((categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    const targetSection = sectionRefs[categoryId]?.current;
    
    if (mainScrollContainer) {
      // For Spice Palace, always scroll to the very top to show header
      if (theme === "spicepalace") {
        mainScrollContainer.style.scrollBehavior = 'auto';
        mainScrollContainer.scrollTop = 0;
        // Add a gentle easing effect
        setTimeout(() => {
          mainScrollContainer.style.scrollBehavior = 'smooth';
        }, 50);
      } else if (targetSection) {
        const containerRect = mainScrollContainer.getBoundingClientRect();
        const sectionRect = targetSection.getBoundingClientRect();
        
        const extraOffset = theme === "tabletech" ? 60 : 10;
        const scrollOffset = sectionRect.top - containerRect.top + mainScrollContainer.scrollTop - extraOffset;
        
        mainScrollContainer.scrollTo({
          top: Math.max(0, scrollOffset),
          behavior: 'smooth'
        });
      }
    }
  }, [theme, sectionRefs]);

  // Add scroll tracking for categories with throttling for better performance
  useEffect(() => {
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    if (!mainScrollContainer) return;

    let ticking = false;
    const updateActiveCategory = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          for (const categoryId of categories.map(c => c.id)) {
            const section = sectionRefs[categoryId]?.current;
            if (section) {
              const rect = section.getBoundingClientRect();
              const containerRect = mainScrollContainer.getBoundingClientRect();
              
              const topOffset = theme === "tabletech" ? 120 : theme === "spicepalace" ? 60 : 100;
              const bottomOffset = theme === "tabletech" ? 60 : theme === "spicepalace" ? 20 : 50;
              
              if (rect.top <= containerRect.top + topOffset && rect.bottom > containerRect.top + bottomOffset) {
                if (activeCategory !== categoryId) {
                  setActiveCategory(categoryId);
                }
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    mainScrollContainer.addEventListener('scroll', updateActiveCategory, { passive: true });
    
    return () => {
      mainScrollContainer.removeEventListener('scroll', updateActiveCategory);
    };
  }, [activeCategory, sectionRefs, categories, theme]);

  const addToCart = useCallback((id: number, category: CategoryId, withToppings: string[] = []) => {
    const items = mockMenu[category];
    if (!items) return;
    
    const item = items.find((i) => i.id === id);
    if (!item) return;
    
    const currentToppings = getToppingsForTheme(theme, category);
    const toppingsPrice = withToppings
      .map((toppingName) => currentToppings.find((top: ToppingItem) => (isEnglish ? top.nameEn : top.name) === toppingName)?.price || 0)
      .reduce((a, b) => a + b, 0);
    
    const cartItem: CartItem = {
      ...item,
      toppings: withToppings.length > 0 ? withToppings : undefined,
      toppingsPrice: toppingsPrice > 0 ? toppingsPrice : undefined
    };
    
    setCart((prev) => [...prev, cartItem]);
    setFloaters((prev) => [...prev, id]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f !== id));
    }, 500);
  }, [mockMenu, theme, isEnglish]);

  useEffect(() => {
    if (cart.length > 0 && !hasCartAppeared) {
      setHasCartAppeared(true);
    }
  }, [cart.length, hasCartAppeared]);

  const total = cart.reduce((sum, item) => sum + item.price + (item.toppingsPrice || 0), 0).toFixed(2);
  const translationTexts = getTranslation(isEnglish);

  const selectedItemToppings = selectedItem ? getToppingsForTheme(theme, selectedItem.category) : [];
  const extraTotal = selectedToppings
    .map((toppingName) => selectedItemToppings.find((top: ToppingItem) => (isEnglish ? top.nameEn : top.name) === toppingName)?.price || 0)
    .reduce((a, b) => a + b, 0);

  const buttonTotal = selectedItem
    ? (selectedItem.price + extraTotal).toFixed(2)
    : "0.00";

  const renderMenuSection = (categoryId: CategoryId, forAllView: boolean = false) => {
    let items = mockMenu[categoryId];
    if (!items || items.length === 0) return null;
    
    // For "all" category, show all items from all categories
    if (categoryId === "all") {
      items = mockMenu[categoryId]; // This already contains all items
    } else {
      // For specific categories, ensure we only show items that belong to that exact category
      items = items.filter(item => item.category === categoryId);
      // Only limit items when viewed in "all" sections, not when viewing specific category
      if (forAllView) {
        items = items.slice(0, 2);
      }
    }

    // TableTech gebruikt de originele compacte grid layout
    if (theme === "tabletech") {
      return (
        <div ref={sectionRefs[categoryId]} className="mb-6" key={`section-${categoryId}`}>
          <h2 className="text-lg font-bold text-gray-800 mb-3 px-1 sticky -top-2 bg-white py-2 border-b border-gray-300 z-50 shadow-sm">
            {categories.find((c) => c.id === categoryId)?.name}
          </h2>
          <div className="grid grid-cols-2 gap-2 px-1 pb-16">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.category}-tabletech`}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col items-center bg-white ring-1 ring-gray-200 rounded-2xl overflow-hidden p-2 pb-2 transform transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <ImageWithLoading
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-lg mb-1"
                />
                <h3 className="text-sm font-semibold text-center leading-tight text-gray-800 mb-1">
                  {isEnglish && item.nameEn ? item.nameEn : item.name}
                </h3>
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
      <div ref={sectionRefs[categoryId]} className="mb-0" key={`section-${categoryId}`} style={{
        scrollMarginTop: theme === "spicepalace" ? "60px" : "0px"
      }}>
        <h2 className={`text-lg font-bold px-4 py-3 z-20 shadow-sm ${
          theme === "spicepalace" 
            ? "bg-gradient-to-r from-red-800 via-red-900 to-red-950 text-amber-100 border-b border-amber-400/40 mb-0 shadow-lg" 
            : `${themeConfig.bgColor} ${themeConfig.textColor} mb-4 border-b`
        }`}
        style={{
          position: 'static',
          zIndex: 20,
          marginBottom: theme === "spicepalace" ? 0 : '16px'
        }}>
          {categories.find((c) => c.id === categoryId)?.name}
        </h2>
        <div className={`px-3 ${
          theme === "spicepalace" ? "space-y-4 pb-0" : "space-y-4"
        }`}>
          {items.map((item) => (
            <div
              key={`${item.id}-${item.category}-${theme}`}
              onClick={() => setSelectedItem(item)}
              className={`relative flex flex-col ${themeConfig.cardBg} rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 cursor-pointer group ${
                theme === "spicepalace" 
                  ? "scroll-snap-align-start hover:shadow-xl" 
                  : "hover:scale-105 hover:shadow-xl"
              }`}
              style={{
                scrollSnapAlign: 'none',
                scrollSnapStop: 'normal'
              }}
            >
              <div className="relative overflow-hidden">
                <ImageWithLoading
                  src={item.image}
                  alt={item.name}
                  className={`w-full object-cover transition-transform duration-500 ${
                    theme === "spicepalace" ? "h-32 group-hover:scale-105" : "h-36 group-hover:scale-110"
                  }`}
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
                    className={`${themeConfig.buttonColor} px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 transform shadow-md relative z-30 ${
                      theme === "spicepalace" ? "hover:bg-gray-800 active:scale-95" : "hover:scale-105 active:scale-95"
                    }`}
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
                    className="absolute text-sm font-semibold text-green-500 bottom-14 right-4 pointer-events-none drop-shadow-lg z-40"
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
          className={`text-xs border px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
            theme === "spicepalace" 
              ? "border-white text-white hover:bg-white hover:text-red-800" 
              : "border-amber-200 text-amber-100 hover:bg-amber-300 hover:text-red-800"
          }`}
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
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {renderHeader()}

      {/* CATEGORIES - verschillende layouts per thema */}
      {theme === "tabletech" ? (
        // TableTech: Rechthoekige categorieën zoals in afbeelding
        <div 
          className={`flex overflow-x-auto px-4 py-3 gap-3 scrollbar-hide ${
            theme === "tabletech" 
              ? "border-b-2 border-gray-200" 
              : "border-b-2 border-amber-300/50"
          }`}
          data-horizontal-scroll="true"
          style={{ 
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x'
          }}
        >
          {categories.map((cat) => (
            <button
              key={`category-${cat.id}`}
              onClick={() => scrollToSection(cat.id)}
              className={`flex flex-col items-center min-w-[70px] text-xs rounded-lg px-3 py-2 transition shadow-sm ${
                activeCategory === cat.id
                  ? "bg-yellow-300 text-gray-800 ring-2 ring-yellow-500 font-bold"
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
          className="flex overflow-x-auto px-4 py-4 gap-3 scrollbar-hide"
          data-horizontal-scroll="true"
          style={{ 
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            scrollSnapType: 'none'
          }}
        >
          {categories.map((cat) => (
            <div
              key={`category-${cat.id}`}
              onClick={() => scrollToSection(cat.id)}
              className="flex flex-col items-center min-w-[60px] cursor-pointer group flex-shrink-0"
              style={{ scrollSnapAlign: 'none' }}
            >
              <div
                className={`w-12 h-12 rounded-full mb-2 overflow-hidden border-2 transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "border-amber-300 shadow-xl scale-110 ring-2 ring-amber-400/50"
                    : "border-white/60 hover:border-amber-200/80 hover:shadow-lg hover:scale-105"
                }`}
              >
                {cat.id === "all" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white text-lg">
                    🔥
                  </div>
                ) : (
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                  />
                )}
              </div>
              <span className={`text-xs text-center font-medium transition-all duration-300 ${
                theme === "spicepalace" 
                  ? activeCategory === cat.id 
                    ? "text-amber-200 drop-shadow-sm font-bold" 
                    : "text-white/90 group-hover:text-amber-100"
                  : themeConfig.textColor
              }`}>
                {isEnglish && cat.nameEn ? cat.nameEn : cat.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MAIN SCROLLABLE AREA - removed scroll-snap for TableTech */}
      <div 
        data-phone-scroll-container="true"
        className={`flex-1 overflow-y-auto pt-2 ${
          theme === "tabletech" ? "pb-28" : "pb-40"
        }`}
        style={{ 
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'none',
          touchAction: 'pan-y',
        }}
      >
        {/* Show content based on active category */}
        {activeCategory === "all" ? 
          renderMenuSection("all", false) :
          renderMenuSection(activeCategory, false)
        }
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
              className={`absolute bottom-5 left-4 right-4 z-50 ${theme === "tabletech" ? "bg-[#7b4f35]" : theme === "spicepalace" ? "bg-black" : "bg-gray-800"} text-white py-4 px-4 rounded-full text-sm font-bold text-center cursor-pointer shadow-xl transition-all duration-200 ${theme === "tabletech" ? "hover:bg-[#5e3b29]" : theme === "spicepalace" ? "hover:bg-gray-800" : "hover:bg-gray-900"} flex items-center justify-center gap-2 transform hover:scale-105`}
            >
              {theme === "tabletech" ? (
                // TableTech: Originele eenvoudige layout
                <>
                  {translationTexts.orderButton} {cart.length} {cart.length === 1 ? translationTexts.items : translationTexts.itemsPlural} {translationTexts.for}{" "}
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
                  <span className="font-semibold">{translationTexts.orderButton}</span>
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
                <h2 className="text-lg font-bold">{translationTexts.yourOrder}</h2>
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
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
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
                <span>{translationTexts.subtotal}</span>
                <span className="text-lg font-bold">€{total}</span>
              </div>

              <div className="p-4">
                <button className={`w-full ${theme === "tabletech" ? "bg-[#7b4f35] hover:bg-[#5e3b29]" : theme === "spicepalace" ? "bg-black hover:bg-gray-800" : "bg-black hover:bg-gray-900"} text-white py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}>
                  {translationTexts.continue}
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
            className="absolute inset-0 z-60 bg-white flex flex-col"
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
                  maxHeight: 'calc(100vh - 200px)',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
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
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">
                      {translationTexts.chooseSpicy}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">{translationTexts.chooseUpTo1}</p>
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
                )}

                {(theme === "tabletech" || theme === "spicepalace") && (
                  <div className={`${theme === "spicepalace" ? "bg-red-50" : "bg-gray-50"} p-4 rounded-lg`}>
                    <h4 className="text-sm font-semibold mb-2">
                      {theme === "spicepalace" ? (isEnglish ? "Customize your dish" : "Personaliseer je gerecht") : translationTexts.addToppings}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      {theme === "spicepalace" ? (isEnglish ? "Choose your preferred additions" : "Kies je gewenste toevoegingen") : translationTexts.chooseUpTo7}
                    </p>
                    <div className="flex flex-col gap-3">
                      {selectedItemToppings.map((top: ToppingItem) => (
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
                            className={`appearance-none w-5 h-5 border-2 rounded-full transition-colors duration-150 ${
                              theme === "spicepalace"
                                ? "border-red-400 checked:bg-red-600 checked:border-red-600 hover:border-red-500"
                                : "border-gray-400 checked:bg-black checked:border-black hover:border-gray-500 active:border-gray-600"
                            }`}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-20"></div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-4 h-14 bg-white z-60" />
            <div className="pointer-events-none absolute bottom-12 left-0 right-4 h-24 bg-gradient-to-t from-white to-transparent z-60" />

            <div className="absolute bottom-4 left-4 right-4 z-70">
              <button
                onClick={() => {
                  if ((theme === "tabletech" || theme === "spicepalace") && selectedToppings.length > 0) {
                    addToCart(selectedItem.id, selectedItem.category, selectedToppings);
                  } else {
                    addToCart(selectedItem.id, selectedItem.category);
                  }
                  setSelectedItem(null);
                  setSelectedToppings([]);
                }}
                className={`w-full ${theme === "spicepalace" ? "bg-black hover:bg-gray-800" : theme === "tabletech" ? "bg-[#7b4f35] hover:bg-[#5e3b29]" : "bg-black hover:bg-gray-900"} text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
              >
                {translationTexts.addToOrder} • €{buttonTotal}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneMockup;