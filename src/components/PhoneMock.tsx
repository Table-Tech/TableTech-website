import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaFire, FaCoffee, FaGlobeAmericas } from "react-icons/fa";

interface PhoneMockupProps {
  theme?: "tabletech" | "spicepalace" | "sweetdelights" | "coffeecorner";
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
      image: "/menu/menu1.webp",
      category: "popular",
      description: "Sappige garnalen in een romige kokoskaree saus met verse kruiden en basmati rijst.",
      descriptionEn: "Juicy prawns in a creamy coconut curry sauce with fresh herbs and basmati rice.",
    },
    {
      id: 2,
      name: "Firecracker Prawn",
      price: 11.0,
      image: "/menu/menu2.webp",
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
      image: "/menu/menu3.webp",
      category: "curry",
      description: "Knapperige gepaneerde kip met Japanse curry saus en gestoomde rijst.",
      descriptionEn: "Crispy breaded chicken with Japanese curry sauce and steamed rice.",
    },
    {
      id: 4,
      name: "Vegetable Curry",
      price: 9.0,
      image: "/menu/menu4.webp",
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
      image: "/menu/menu5.webp",
      category: "ramen",
      description: "Pittige ramen met knapperige tofu, verse groenten en een gekookt ei.",
      descriptionEn: "Spicy ramen with crispy tofu, fresh vegetables and a soft-boiled egg.",
    },
    {
      id: 6,
      name: "Chilli Steak Ramen",
      price: 8.95,
      image: "/menu/menu4.webp",
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
      image: "/menu/menu1.webp",
      category: "pizza",
      description: "Klassieke pizza met verse tomaten, mozzarella en basilicum op dunne bodem.",
      descriptionEn: "Classic pizza with fresh tomatoes, mozzarella and basil on thin crust.",
    },
    {
      id: 8,
      name: "Pepperoni Pizza",
      price: 9.5,
      image: "/menu/menu2.webp",
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
      image: "/images/menu-items/beverages/cold-drinks/lemonade.webp",
      category: "drinks",
      description: "Verse limonade gemaakt van echte citroenen met een vleugje munt.",
      descriptionEn: "Fresh lemonade made from real lemons with a hint of mint.",
    },
    {
      id: 10,
      name: "Iced Green Tea",
      price: 2.95,
      image: "/images/menu-items/beverages/cold-drinks/green-tea-with-ice-glass_.webp",
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
      id: 112,
      name: "Kip Karahi",
      nameEn: "Chicken Karahi", 
      price: 17.0,
      image: "/images/spice-palace/karahi-dish.webp",
      category: "popular",
      description: "Authentieke Pakistaanse kip karahi bereid in een wok met verse tomaten, gember, knoflook en groene pepers. Een explosie van smaken in elke hap.",
      descriptionEn: "Authentic Pakistani chicken karahi prepared in a wok with fresh tomatoes, ginger, garlic and green peppers. An explosion of flavors in every bite.",
    },
    {
      id: 106,
      name: "Gemengde Kebab",
      nameEn: "Mixed Kebab",
      price: 15.0,
      image: "/images/spice-palace/kebab.webp",
      category: "popular",
      description: "Een heerlijke combinatie van gegrilde kip, lam en gehakt kebab, gemarineerd in yoghurt en speciale kruiden. Geserveerd met verse salade en mintchutney.",
      descriptionEn: "A delicious combination of grilled chicken, lamb and minced kebab, marinated in yogurt and special spices. Served with fresh salad and mint chutney.",
    },
  ],
  handi: [
    {
      id: 101,
      name: "Kip Handi Special",
      nameEn: "Chicken Handi Special",
      price: 16.5,
      image: "/images/spice-palace/handi1.webp",
      category: "handi",
      description: "Malse kipstukjes langzaam gestoofd in een traditionele klei pot met verse kruiden, tomaten en ui. Geserveerd met aromatische basmati rijst en warme naan.",
      descriptionEn: "Tender chicken pieces slowly stewed in a traditional clay pot with fresh herbs, tomatoes and onions. Served with aromatic basmati rice and warm naan.",
    },
    {
      id: 102,
      name: "Lams Handi",
      nameEn: "Lamb Handi",
      price: 18.5,
      image: "/images/spice-palace/handi2.webp",
      category: "handi",
      description: "Succulent lamsvlees in een rijke, kruidige saus met verse koriander en garam masala. Perfect voor liefhebbers van intense smaken.",
      descriptionEn: "Succulent lamb in a rich, spicy sauce with fresh coriander and garam masala. Perfect for lovers of intense flavors.",
    },
    {
      id: 105,
      name: "Vegetarische Handi",
      nameEn: "Vegetarian Handi",
      price: 14.0,
      image: "/images/spice-palace/handi3.webp",
      category: "handi",
      description: "Een kleurrijke mix van seizoensgroenten zoals aubergine, bloemkool en erwten in een aromatische masala saus. Vegetarisch genieten op zijn best.",
      descriptionEn: "A colorful mix of seasonal vegetables like eggplant, cauliflower and peas in an aromatic masala sauce. Vegetarian enjoyment at its best.",
    },
  ],
  kebab: [
    {
      id: 107,
      name: "Broodje Kebab",
      nameEn: "Kebab Sandwich",
      price: 8.5,
      image: "/images/spice-palace/kebab-sandwich.webp",
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
      image: "/images/spice-palace/fried-rice.webp",
      category: "rice",
      description: "Wok-gebakken basmati rijst met verse groenten, ei en sojasaus. Een perfecte balans tussen Aziatische en Indiase smaken, gegarneerd met verse lente-ui.",
      descriptionEn: "Wok-fried basmati rice with fresh vegetables, egg and soy sauce. A perfect balance between Asian and Indian flavors, garnished with fresh spring onions.",
    },
    {
      id: 109,
      name: "Biryani Rijst",
      nameEn: "Biryani Rice",
      price: 14.0,
      image: "/images/spice-palace/rice-dish.webp",
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
      image: "/images/spice-palace/bbq-ribs.webp",
      category: "bbq",
      description: "Sappige spareribs langzaam gegrild en gemarineerd in onze huisgemaakte BBQ saus met honing en specerijen. Geserveerd met crispy frites en coleslaw.",
      descriptionEn: "Juicy spareribs slowly grilled and marinated in our homemade BBQ sauce with honey and spices. Served with crispy fries and coleslaw.",
    },
    {
      id: 111,
      name: "BBQ Mixed Grill",
      nameEn: "BBQ Mixed Grill",
      price: 22.0,
      image: "/images/spice-palace/bbq-mixed.webp",
      category: "bbq",
      description: "Een royale selectie van gegrilde specialiteiten: kip tikka, lam seekh kebab, spareribs en gegrilde groenten. Perfect om te delen met vrienden.",
      descriptionEn: "A generous selection of grilled specialties: chicken tikka, lamb seekh kebab, spareribs and grilled vegetables. Perfect for sharing with friends.",
    },
  ],
  karahi: [
    {
      id: 113,
      name: "Curry Schotel",
      nameEn: "Curry Plate",
      price: 18.0,
      image: "/images/spice-palace/curry-plate.webp",
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
      image: "/images/spice-palace/garlic-naan.webp",
      category: "tandoori",
      description: "Vers gebakken naan brood uit de tandoor oven, rijkelijk belegd met verse knoflook en koriander. Perfect als bijgerecht bij elke curry.",
      descriptionEn: "Freshly baked naan bread from the tandoor oven, generously topped with fresh garlic and coriander. Perfect as a side dish with any curry.",
    },
    {
      id: 115,
      name: "Tandoori Kip",
      nameEn: "Tandoori Chicken",
      price: 16.0,
      image: "/images/spice-palace/ramen-dark.webp",
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
      image: "/images/menu-items/desserts/chocolate-cake.webp",
      category: "popular",
    },
    {
      id: 202,
      name: "Cheesecake",
      nameEn: "Cheesecake",
      price: 8.0,
      image: "/images/menu-items/desserts/cheesecake.webp",
      category: "popular",
    },
  ],
  cakes: [
    {
      id: 203,
      name: "Chocolade Taart",
      nameEn: "Chocolate Cake",
      price: 7.5,
      image: "/images/menu-items/desserts/chocolate-cake.webp",
      category: "cakes",
      description: "Rijke chocoladetaart met zachte vulling",
      descriptionEn: "Rich chocolate cake with soft filling",
    },
    {
      id: 204,
      name: "Cheesecake",
      nameEn: "Cheesecake",
      price: 8.0,
      image: "/images/menu-items/desserts/cheesecake.webp",
      category: "cakes",
      description: "Romige cheesecake met verse vruchten",
      descriptionEn: "Creamy cheesecake with fresh fruits",
    },
    {
      id: 205,
      name: "Opera Taart",
      nameEn: "Opera Cake",
      price: 9.5,
      image: "/images/menu-items/desserts/Opera-taart.webp",
      category: "cakes",
      description: "Elegante Franse opera taart met chocolade en koffie",
      descriptionEn: "Elegant French opera cake with chocolate and coffee",
    },
    {
      id: 206,
      name: "Macaron Selectie",
      nameEn: "Macaron Selection", 
      price: 6.0,
      image: "/images/menu-items/desserts/macaron.webp",
      category: "cakes",
      description: "Verfijnde Franse macarons in verschillende smaken",
      descriptionEn: "Refined French macarons in various flavors",
    },
  ],
  "coffee-specialties": [
    {
      id: 208,
      name: "Latte Art",
      nameEn: "Latte Art",
      price: 4.5,
      image: "/images/menu-items/beverages/coffee/latte-art.webp",
      category: "coffee-specialties",
      description: "Artistieke latte met prachtige melkschuim kunst",
      descriptionEn: "Artistic latte with beautiful milk foam art",
    },
    {
      id: 207,
      name: "Espresso",
      nameEn: "Espresso",
      price: 2.5,
      image: "/images/menu-items/beverages/coffee/espresso-machine.webp",
      category: "coffee-specialties",
      description: "Intense en pure espresso shot",
      descriptionEn: "Intense and pure espresso shot",
    },
    {
      id: 209,
      name: "Koffie Special",
      nameEn: "Coffee Special",
      price: 4.0,
      image: "/images/menu-items/beverages/coffee/coffee-splash.webp",
      category: "coffee-specialties",
      description: "Huisspecialiteit met unieke smaakcombinatie",
      descriptionEn: "House specialty with unique flavor combination",
    },
  ],
  "cold-drinks": [
    {
      id: 210,
      name: "IJskoffie",
      nameEn: "Iced Coffee",
      price: 4.5,
      image: "/images/menu-items/beverages/coffee/iceekoffie.webp",
      category: "cold-drinks",
      description: "Verfrissende ijskoffie perfect voor warme dagen",
      descriptionEn: "Refreshing iced coffee perfect for warm days",
    },
    {
      id: 211,
      name: "Coca Cola",
      nameEn: "Coca Cola",
      price: 2.5,
      image: "/images/menu-items/beverages/cold-drinks/coca-cola.webp",
      category: "cold-drinks",
      description: "Klassieke frisdrank met bruisende smaak",
      descriptionEn: "Classic soft drink with fizzy taste",
    },
    {
      id: 212,
      name: "Fanta",
      nameEn: "Fanta",
      price: 2.5,
      image: "/images/menu-items/beverages/cold-drinks/fanta.webp",
      category: "cold-drinks",
      description: "Zoete sinaasappel frisdrank",
      descriptionEn: "Sweet orange soft drink",
    },
    {
      id: 213,
      name: "Red Bull",
      nameEn: "Red Bull",
      price: 3.0,
      image: "/images/menu-items/beverages/cold-drinks/red-bull.webp",
      category: "cold-drinks",
      description: "Energiedrank voor extra boost",
      descriptionEn: "Energy drink for extra boost",
    },
  ],
  "hot-drinks": [
    {
      id: 214,
      name: "Groene Thee",
      nameEn: "Green Tea",
      price: 3.0,
      image: "/images/menu-items/beverages/cold-drinks/green-tea.webp",
      category: "hot-drinks",
      description: "Gezonde groene thee vol antioxidanten",
      descriptionEn: "Healthy green tea full of antioxidants",
    },
    {
      id: 215,
      name: "Warme Chocolademelk",
      nameEn: "Hot Chocolate",
      price: 3.5,
      image: "/images/menu-items/beverages/hot-drinks/chocolade-melk.webp",
      category: "hot-drinks",
      description: "Romige warme chocolademelk met slagroom",
      descriptionEn: "Creamy hot chocolate milk with whipped cream",
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
      name: "Latte Art",
      nameEn: "Latte Art",
      price: 4.5,
      image: "/images/coffee-corner/latte-art1.webp",
      category: "popular",
      description: "Australische Bonen",
      descriptionEn: "Australian Beans",
    },
    {
      id: 302,
      name: "Latte Art Special",
      nameEn: "Latte Art Special", 
      price: 5.0,
      image: "/images/coffee-corner/latte-art2.webp",
      category: "popular",
      description: "Premium koffie",
      descriptionEn: "Premium coffee",
    },
  ],
  "coffee-specialties": [
    {
      id: 303,
      name: "Latte Art",
      nameEn: "Latte Art",
      price: 4.5,
      image: "/images/coffee-corner/latte-art1.webp",
      category: "coffee-specialties",
      description: "Australische Bonen",
      descriptionEn: "Australian Beans",
    },
    {
      id: 304,
      name: "Latte Art Special",
      nameEn: "Latte Art Special",
      price: 5.0,
      image: "/images/coffee-corner/latte-art2.webp",
      category: "coffee-specialties",
      description: "Premium koffie",
      descriptionEn: "Premium coffee",
    },
  ],
  "cold-drinks": [
    {
      id: 306,
      name: "IJskoffie",
      nameEn: "Iced Coffee",
      price: 4.0,
      image: "/images/menu-items/beverages/coffee/iceekoffie.webp",
      category: "cold-drinks",
      description: "Verfrissende ijskoffie perfect voor de zomer",
      descriptionEn: "Refreshing iced coffee perfect for summer",
    },
    {
      id: 307,
      name: "Frappé",
      nameEn: "Frappé",
      price: 4.5,
      image: "/images/menu-items/beverages/coffee/caramelcoffee.webp",
      category: "cold-drinks",
      description: "Romige ijskoffie met slagroom",
      descriptionEn: "Creamy iced coffee with whipped cream",
    },
    {
      id: 311,
      name: "Iced Tea",
      nameEn: "Iced Tea",
      price: 3.0,
      image: "/images/menu-items/beverages/cold-drinks/iced-tea.webp",
      category: "cold-drinks",
      description: "Verfrissende ijsthee met citroen",
      descriptionEn: "Refreshing iced tea with lemon",
    },
  ],
  "hot-drinks": [
    {
      id: 308,
      name: "Warme Chocolademelk",
      nameEn: "Hot Chocolate",
      price: 3.5,
      image: "/images/menu-items/beverages/hot-drinks/Warme-chocolademelk-Gwenns-Bakery-2.webp",
      category: "hot-drinks",
      description: "Rijke warme chocolademelk met marshmallows",
      descriptionEn: "Rich hot chocolate milk with marshmallows",
    },
    {
      id: 309,
      name: "Cappuccino",
      nameEn: "Cappuccino",
      price: 4.0,
      image: "/images/menu-items/beverages/coffee/gingerbread-cappuccino.webp",
      category: "hot-drinks",
      description: "Klassieke Italiaanse koffie met melkschuim",
      descriptionEn: "Classic Italian coffee with milk foam",
    },
  ],
  pastries: [
    {
      id: 310,
      name: "Croissant",
      nameEn: "Croissant",
      price: 2.5,
      image: "/images/menu-items/pastries/crossant-foto.webp",
      category: "pastries",
      description: "Krokante Franse croissant vers uit de oven",
      descriptionEn: "Crispy French croissant fresh from the oven",
    },
    {
      id: 313,
      name: "Muffin",
      nameEn: "Muffin",
      price: 3.0,
      image: "/images/menu-items/pastries/Sweet-Potato-Muffins-22.webp",
      category: "pastries",
      description: "Verse muffin met blueberries",
      descriptionEn: "Fresh muffin with blueberries",
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
        { name: "Handi", nameEn: "Handi", icon: "/images/spice-palace/handi-category.webp", id: "handi" },
        { name: "Kebab", nameEn: "Kebab", icon: "/images/spice-palace/kebab-category.webp", id: "kebab" },
        { name: "Rijst", nameEn: "Rice", icon: "/images/spice-palace/rice-category.webp", id: "rice" },
        { name: "BBQ", nameEn: "BBQ", icon: "/images/spice-palace/bbq-category.webp", id: "bbq" },
        { name: "Karahi", nameEn: "Karahi", icon: "/images/spice-palace/karahi-category.webp", id: "karahi" },
        { name: "Tandoori", nameEn: "Tandoori", icon: "/images/spice-palace/tandoor-category.webp", id: "tandoori" },
      ];
    case "sweetdelights":
      return [
        { name: "Taarten", nameEn: "Cakes", icon: "🍰", id: "cakes" },
        { name: "Koffie Specialiteiten", nameEn: "Coffee Specialties", icon: "☕", id: "coffee-specialties" },
        { name: "Koude Dranken", nameEn: "Cold Drinks", icon: "🧊", id: "cold-drinks" },
        { name: "Warme Dranken", nameEn: "Hot Drinks", icon: "🔥", id: "hot-drinks" },
      ];
    case "coffeecorner":
      return [
        { name: "Koffie", nameEn: "Coffee", icon: "☕", id: "coffee-specialties" },
        { name: "Koude Dranken", nameEn: "Cold Drinks", icon: "🧊", id: "cold-drinks" },
        { name: "Warme Dranken", nameEn: "Hot Drinks", icon: "🔥", id: "hot-drinks" },
        { name: "Bakkerij", nameEn: "Bakery", icon: "🥐", id: "pastries" },
      ];
    default:
      return [
        { name: "All", icon: "/icons/popular.webp", id: "all" },
        { name: "Curry", icon: "/icons/curry.webp", id: "curry" },
        { name: "Ramen", icon: "/icons/ramen.webp", id: "ramen" },
        { name: "Pizza", icon: "/icons/pizza.webp", id: "pizza" },
        { name: "Drinks", icon: "/icons/drink.webp", id: "drinks" },
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

// Sweet Delights toppings per category
const sweetDelightsToppings: Record<CategoryId, ToppingItem[]> = {
  cakes: [
    { name: "extra room", nameEn: "extra cream", price: 1.00 },
    { name: "verse aardbeien", nameEn: "fresh strawberries", price: 1.50 },
    { name: "chocolade drizzle", nameEn: "chocolate drizzle", price: 0.75 },
    { name: "poedersuiker", nameEn: "powdered sugar", price: 0.25 },
  ],
  "hot-drinks": [
    { name: "extra suiker", nameEn: "extra sugar", price: 0.00 },
    { name: "honing", nameEn: "honey", price: 0.50 },
    { name: "slagroom", nameEn: "whipped cream", price: 0.75 },
    { name: "kaneel", nameEn: "cinnamon", price: 0.25 },
    { name: "marshmallows", nameEn: "marshmallows", price: 0.50 },
  ],
  all: [],
  popular: [],
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
  "coffee-specialties": [
    { name: "extra room", nameEn: "extra cream", price: 1.00 },
    { name: "verse aardbeien", nameEn: "fresh strawberries", price: 1.50 },
    { name: "chocolade drizzle", nameEn: "chocolate drizzle", price: 0.75 },
    { name: "slagroom", nameEn: "whipped cream", price: 0.75 },
    { name: "kaneel", nameEn: "cinnamon", price: 0.25 },
    { name: "vanille siroop", nameEn: "vanilla syrup", price: 0.50 },
  ],
  "cold-drinks": [],
  pastries: [
    { name: "boter", nameEn: "butter", price: 0.50 },
    { name: "jam", nameEn: "jam", price: 0.75 },
    { name: "verse room", nameEn: "fresh cream", price: 1.00 },
  ],
};

// Coffee Corner toppings per category
const coffeeCornerToppings: Record<CategoryId, ToppingItem[]> = {
  "coffee-specialties": [
    { name: "extra shot", nameEn: "extra shot", price: 0.75 },
    { name: "sojamilk", nameEn: "soy milk", price: 0.50 },
    { name: "havermelk", nameEn: "oat milk", price: 0.60 },
    { name: "extra schuim", nameEn: "extra foam", price: 0.25 },
    { name: "karamel siroop", nameEn: "caramel syrup", price: 0.50 },
    { name: "vanille siroop", nameEn: "vanilla syrup", price: 0.50 },
  ],
  "hot-drinks": [
    { name: "extra suiker", nameEn: "extra sugar", price: 0.00 },
    { name: "honing", nameEn: "honey", price: 0.50 },
    { name: "slagroom", nameEn: "whipped cream", price: 0.75 },
    { name: "kaneel", nameEn: "cinnamon", price: 0.25 },
    { name: "marshmallows", nameEn: "marshmallows", price: 0.50 },
    { name: "chocolade vlokken", nameEn: "chocolate flakes", price: 0.75 },
  ],
  "cold-drinks": [
    { name: "extra ijs", nameEn: "extra ice", price: 0.00 },
    { name: "citroen", nameEn: "lemon", price: 0.25 },
    { name: "munt", nameEn: "mint", price: 0.30 },
    { name: "suiker siroop", nameEn: "sugar syrup", price: 0.25 },
    { name: "slagroom", nameEn: "whipped cream", price: 0.75 },
  ],
  pastries: [
    { name: "boter", nameEn: "butter", price: 0.50 },
    { name: "jam", nameEn: "jam", price: 0.75 },
    { name: "verse room", nameEn: "fresh cream", price: 1.00 },
    { name: "honing", nameEn: "honey", price: 0.50 },
  ],
  all: [],
  popular: [],
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
    case "sweetdelights":
      if (category && sweetDelightsToppings[category] && sweetDelightsToppings[category].length > 0) {
        return sweetDelightsToppings[category];
      }
      return [];
    case "coffeecorner":
      if (category && coffeeCornerToppings[category] && coffeeCornerToppings[category].length > 0) {
        return coffeeCornerToppings[category];
      }
      return [];
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
        icon: <FaFire className="w-5 h-5 text-white" />,
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
        name: "SWEET DELIGHTS",
        icon: <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
        </div>,
        bgColor: "bg-gradient-to-b from-pink-100 to-pink-200",
        headerBg: "bg-pink-500",
        textColor: "text-pink-800",
        categoryBg: "bg-pink-400",
        categoryHoverBg: "bg-pink-500",
        categoryTextColor: "text-white",
        buttonColor: "bg-pink-500 hover:bg-pink-600",
        cardBg: "bg-white",
        cardTextColor: "text-pink-800",
      };
    case "coffeecorner":
      return {
        name: "Coffee Corner",
        icon: <FaCoffee className="w-5 h-5 text-white" />,
        bgColor: "bg-gradient-to-b from-amber-100 to-amber-200",
        headerBg: "bg-amber-600",
        textColor: "text-amber-800",
        categoryBg: "bg-amber-500",
        categoryHoverBg: "bg-amber-600",
        categoryTextColor: "text-white",
        buttonColor: "bg-green-600 hover:bg-green-700",
        cardBg: "bg-white",
        cardTextColor: "text-amber-800",
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

// Memoized PhoneMockup component for better performance with performance optimizations
const PhoneMockup: React.FC<PhoneMockupProps> = memo(({ theme = "tabletech" }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasCartAppeared, setHasCartAppeared] = useState(false);
  const [floaters, setFloaters] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isEnglish, setIsEnglish] = useState(false);

  // Custom smooth touch scroll implementation - ALLEEN VOOR MOBIELE TELEFOON DEMO
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 1024; // Alleen op mobiele schermen
    
    if (!isMobile) return; // SKIP: Desktop gebruikt eigen scroll
    
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    if (!mainScrollContainer) return;

    let isScrolling = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let scrollVelocity = 0;
    let momentumAnimation: number | null = null;

    // Smooth touch scroll handlers
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchCurrentY = touchStartY;
      scrollVelocity = 0;
      isScrolling = true;
      
      if (momentumAnimation) {
        cancelAnimationFrame(momentumAnimation);
        momentumAnimation = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchCurrentY - touchY;
      touchCurrentY = touchY;
      
      // Smooth scrolling with velocity calculation
      scrollVelocity = deltaY * 1.5; // Multiplier voor smoothness
      
      const newScrollTop = mainScrollContainer.scrollTop + deltaY;
      const maxScroll = mainScrollContainer.scrollHeight - mainScrollContainer.clientHeight;
      
      mainScrollContainer.scrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
      
      e.preventDefault(); // Prevent default touch scroll
    };

    const handleTouchEnd = () => {
      isScrolling = false;
      
      // Momentum scroll effect
      if (Math.abs(scrollVelocity) > 1) {
        const startVelocity = scrollVelocity;
        const startTime = performance.now();
        const friction = 0.95; // Deceleration factor
        
        const momentumScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const currentVelocity = startVelocity * Math.pow(friction, elapsed / 16);
          
          if (Math.abs(currentVelocity) > 0.5) {
            const newScrollTop = mainScrollContainer.scrollTop + currentVelocity;
            const maxScroll = mainScrollContainer.scrollHeight - mainScrollContainer.clientHeight;
            
            mainScrollContainer.scrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
            momentumAnimation = requestAnimationFrame(momentumScroll);
          } else {
            momentumAnimation = null;
          }
        };
        
        momentumAnimation = requestAnimationFrame(momentumScroll);
      }
    };

    // Add touch event listeners
    mainScrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    mainScrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    mainScrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup function
    return () => {
      mainScrollContainer.removeEventListener('touchstart', handleTouchStart);
      mainScrollContainer.removeEventListener('touchmove', handleTouchMove);
      mainScrollContainer.removeEventListener('touchend', handleTouchEnd);
      
      if (momentumAnimation) {
        cancelAnimationFrame(momentumAnimation);
      }
    };
  }, [theme]); // Re-run wanneer theme verandert

  // Memoized calculations for better performance with reduced recalculation
  const mockMenu = useMemo(() => getMenuForTheme(theme), [theme]);
  const categories = useMemo(() => getCategoriesForTheme(theme), [theme]);
  const themeConfig = useMemo(() => getThemeConfig(theme), [theme]);

  // Set initial category based on theme
  useEffect(() => {
    if (theme === "sweetdelights") {
      setActiveCategory("cakes");
    } else if (theme === "coffeecorner") {
      setActiveCategory("coffee-specialties");
    } else {
      setActiveCategory("all");
    }
  }, [theme]);

  // Reset states when theme changes
  useEffect(() => {
    setSelectedItem(null);
    setCartOpen(false);
    setSelectedToppings([]);
    if (theme === "sweetdelights") {
      setActiveCategory("cakes");
    } else if (theme === "coffeecorner") {
      setActiveCategory("coffee-specialties");
    } else {
      setActiveCategory("all");
    }
    setCart([]);
    setHasCartAppeared(false);
    setFloaters([]);
    
    // Reset scroll position to top when theme changes
    setTimeout(() => {
      const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
      if (mainScrollContainer) {
        mainScrollContainer.scrollTop = 0;
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
    
    // Vind de scroll container
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    
    if (mainScrollContainer) {
      // Desktop detection
      const viewportWidth = window.innerWidth;
      const isDesktop = viewportWidth >= 1024;
      
      console.log('🔍 ScrollToSection Debug:', {
        categoryId,
        theme,
        isDesktop,
        viewportWidth,
        containerFound: !!mainScrollContainer,
        currentScrollTop: mainScrollContainer.scrollTop
      });
      
      // UNIFIED: Same scroll behavior for BOTH desktop and mobile (exactly like phone method)
      console.log('🚀 Scroll to top triggered:', {
        categoryId,
        theme,
        isDesktop,
        viewportWidth,
        currentScrollTop: mainScrollContainer.scrollTop
      });
      
      // Set programmatic scrolling flag to prevent interference
      const setFlag = (mainScrollContainer as HTMLElement & { _setProgrammaticScrolling?: (value: boolean) => void })._setProgrammaticScrolling;
      if (setFlag) {
        setFlag(true);
        setTimeout(() => setFlag(false), 300);
      }
      
      // DIRECT scroll to top for ALL themes and ALL devices (instant, no animation)
      console.log('🚀 Direct scroll to top - current scrollTop:', mainScrollContainer.scrollTop);
      mainScrollContainer.scrollTop = 0;
      
      // Extra verification to ensure scroll position is reset
      setTimeout(() => {
        if (mainScrollContainer.scrollTop !== 0) {
          console.log('🔧 Second attempt - scrollTop was:', mainScrollContainer.scrollTop);
          mainScrollContainer.scrollTop = 0;
          mainScrollContainer.scrollTo({ top: 0, behavior: 'auto' });
        }
        console.log('✅ Final scrollTop:', mainScrollContainer.scrollTop);
      }, 50);
    } else {
      console.error('❌ No scroll container found!');
    }
  }, [theme]);

  // Enhanced scroll tracking with throttling and performance optimization
  useEffect(() => {
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    if (!mainScrollContainer) return;

    let ticking = false;
    let isUserScrolling = false;
    let programmaticScrolling = false; // Flag to prevent category updates during programmatic scrolling
    let scrollTimeout: NodeJS.Timeout;

    const updateActiveCategory = () => {
      if (!ticking && !isUserScrolling && !programmaticScrolling) {
        requestAnimationFrame(() => {
          for (const categoryId of categories.map(c => c.id)) {
            const section = sectionRefs[categoryId]?.current;
            if (section) {
              const rect = section.getBoundingClientRect();
              const containerRect = mainScrollContainer.getBoundingClientRect();
              
              // Use same offset values for all themes to prevent rapid switching
              const topOffset = theme === "tabletech" ? 100 : 100; // Increased for Spice Palace
              const bottomOffset = theme === "tabletech" ? 50 : 50; // Increased for Spice Palace
              
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

    const handleScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 150); // Increased timeout to prevent conflicts with programmatic scrolling
      updateActiveCategory();
    };

    // Expose function to set programmatic scrolling flag
    (mainScrollContainer as HTMLElement & { _setProgrammaticScrolling?: (value: boolean) => void })._setProgrammaticScrolling = (value: boolean) => {
      programmaticScrolling = value;
    };

    // Enhanced wheel event handling for better mouse scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const scrollSpeed = 1.8; // Snellere scroll speed: was 1.2, nu 1.8 voor sneller scrollen
      const newScrollTop = mainScrollContainer.scrollTop + (delta * scrollSpeed);
      
      mainScrollContainer.scrollTop = Math.max(0, Math.min(newScrollTop, mainScrollContainer.scrollHeight - mainScrollContainer.clientHeight));
    };

    mainScrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    mainScrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      mainScrollContainer.removeEventListener('scroll', handleScroll);
      mainScrollContainer.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
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
    }, 300); // Faster floater cleanup
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

    // Sweet Delights & Coffee Corner get special horizontal card layout
    if (theme === "sweetdelights" || theme === "coffeecorner") {
      const isSweet = theme === "sweetdelights";
      const isCoffee = theme === "coffeecorner";
      
      return (
        <div ref={sectionRefs[categoryId]} className="mb-6" key={`section-${categoryId}`}>
          <div className="px-4 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.category}-${theme}`}
                onClick={() => setSelectedItem(item)}
                className={`relative flex items-center rounded-2xl overflow-hidden shadow-md transform transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 ${
                  isSweet 
                    ? "bg-white" 
                    : "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200"
                }`}
              >
                <ImageWithLoading
                  src={item.image}
                  alt={item.name}
                  className={`w-20 h-20 object-cover flex-shrink-0 ${
                    isSweet 
                      ? "rounded-l-2xl" 
                      : "rounded-l-2xl border-r border-amber-200"
                  }`}
                />
                <div className="flex-1 p-3">
                  <h3 className={`text-sm font-bold mb-1 ${
                    isSweet 
                      ? "text-pink-800" 
                      : "text-amber-900"
                  }`}>
                    {isEnglish && item.nameEn ? item.nameEn : item.name}
                  </h3>
                  {item.description && (isSweet || isCoffee) && (
                    <p className={`text-xs mb-2 italic ${
                      isSweet ? "text-pink-700" : "text-amber-700"
                    }`}>
                      {isEnglish && item.descriptionEn ? item.descriptionEn : item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${
                      isSweet 
                        ? "text-pink-600" 
                        : "text-amber-800"
                    }`}>
                      €{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.id, item.category, []);
                      }}
                      className={`text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 relative z-10 transform hover:scale-110 ${
                        isSweet 
                          ? "bg-pink-500 hover:bg-pink-600" 
                          : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                      }`}
                      style={{ minWidth: '32px', minHeight: '32px' }}
                    >
                      <FaPlus size={14} className="text-white" />
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
                      className="absolute text-sm font-semibold text-green-500 bottom-2 right-2 pointer-events-none z-20"
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

    // TableTech uses the grid layout
    if (theme === "tabletech") {
      return (
        <div ref={sectionRefs[categoryId]} className="mb-6" key={`section-${categoryId}`}>
          <h2 className="text-lg font-bold mb-3 px-1 sticky -top-2 py-2 border-b z-50 shadow-sm bg-white text-gray-900 border-gray-300">
            {categories.find((c) => c.id === categoryId)?.name}
          </h2>
          <div className="grid grid-cols-2 gap-2 px-1 pb-16">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.category}-${theme}`}
                onClick={() => setSelectedItem(item)}
                className="relative flex flex-col items-center bg-white ring-1 ring-gray-200 rounded-2xl overflow-hidden p-2 pb-2 transform transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <ImageWithLoading
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-lg mb-1"
                />
                <h3 className="text-sm font-semibold text-center leading-tight mb-1 text-gray-900">
                  {isEnglish && item.nameEn ? item.nameEn : item.name}
                </h3>
                <div className="flex items-center w-full mt-auto">
                  <span className="text-base font-bold flex-1 text-gray-800">
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
                      animate={{ opacity: 0, y: -8 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
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

    // Spice Palace gebruikt de grote kaart layout
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
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
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
                    animate={{ opacity: 0, y: -8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
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

    if (theme === "sweetdelights") {
      return (
        <div className={`flex items-center justify-between p-4 ${themeConfig.headerBg} text-white shadow-lg`}>
          <div className="flex items-center gap-3">
            {themeConfig.icon}
            <h1 className="text-lg font-bold text-white">{themeConfig.name}</h1>
          </div>
          <button 
            onClick={() => setIsEnglish(!isEnglish)}
            className="text-xs border border-white text-white px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:bg-white hover:text-pink-500"
          >
            <FaGlobeAmericas className="w-3 h-3" />
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
          <FaGlobeAmericas className="w-3 h-3" />
          {isEnglish ? 'Nederlands' : 'English'}
        </button>
      </div>
    );
  };

  return (
    <div 
      data-phone-container="true"
      data-phone-mockup="true"
      data-theme={theme}
      className={`relative w-[320px] h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-black flex flex-col font-sans gpu-accelerated phone-screen ${theme === "tabletech" ? "bg-white" : themeConfig.bgColor}`}
      style={{
        willChange: 'transform',
        contain: 'layout style paint'
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
              data-category={cat.id}
              data-category-btn="true"
              onClick={() => scrollToSection(cat.id)}
              className={`flex flex-col items-center min-w-[70px] text-xs rounded-lg px-3 py-2 transition shadow-sm category-btn ${
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
      ) : theme === "sweetdelights" || theme === "coffeecorner" ? (
        // Sweet Delights & Coffee Corner: 2x2 Grid layout zoals in de afbeelding
        <div className={`px-4 py-4 ${
          theme === "sweetdelights" ? "border-b-2 border-pink-300" : "border-b-2 border-amber-300"
        }`}>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={`category-${cat.id}`}
                data-category={cat.id}
                data-category-btn="true"
                onClick={() => scrollToSection(cat.id)}
                className="flex flex-col items-center cursor-pointer group category-btn"
              >
                <div
                  className={`w-16 h-16 rounded-full mb-2 overflow-hidden border-2 transition-all duration-300 flex items-center justify-center ${
                    theme === "sweetdelights" 
                      ? activeCategory === cat.id
                        ? "border-pink-400 shadow-xl scale-110 ring-2 ring-pink-300/50 bg-pink-400"
                        : "border-pink-300 hover:border-pink-400 hover:shadow-lg hover:scale-105 bg-pink-400"
                      : activeCategory === cat.id
                        ? "border-amber-500 shadow-xl scale-110 ring-2 ring-amber-400/50 bg-gradient-to-br from-amber-500 to-amber-600"
                        : "border-amber-400 hover:border-amber-500 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-amber-500 to-amber-600"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    theme === "sweetdelights" ? "bg-white" : "bg-white/95 backdrop-blur-sm"
                  }`}>
                    <span className={`text-lg ${
                      theme === "coffeecorner" ? "text-amber-800" : ""
                    }`}>{cat.icon}</span>
                  </div>
                </div>
                <span className={`text-xs text-center font-medium transition-all duration-300 ${
                  theme === "sweetdelights"
                    ? activeCategory === cat.id 
                      ? "text-pink-800 font-bold" 
                      : "text-pink-700 group-hover:text-pink-800"
                    : activeCategory === cat.id
                      ? "text-amber-900 font-bold drop-shadow-sm"
                      : "text-amber-800 group-hover:text-amber-900"
                }`}>
                  {isEnglish && cat.nameEn ? cat.nameEn : cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Spice Palace: Cirkelvormige scroll
        <div 
          className="flex overflow-x-auto px-4 py-4 gap-3 scrollbar-hide"
          data-horizontal-scroll="true"
          style={{ 
            overscrollBehavior: 'contain',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x'
          }}
        >
          {categories.map((cat) => (
            <div
              key={`category-${cat.id}`}
              data-category={cat.id}
              data-category-btn="true"
              onClick={() => scrollToSection(cat.id)}
              className="flex flex-col items-center min-w-[60px] cursor-pointer group flex-shrink-0 category-btn"
            >
              <div
                className={`w-12 h-12 rounded-full mb-2 overflow-hidden border-2 transition-all duration-300 flex items-center justify-center ${
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
                activeCategory === cat.id 
                  ? "text-amber-200 drop-shadow-sm font-bold" 
                  : "text-white/90 group-hover:text-amber-100"
              }`}>
                {isEnglish && cat.nameEn ? cat.nameEn : cat.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MAIN SCROLLABLE AREA - Enhanced scrolling with performance optimization */}
      <div 
        data-phone-scroll-container="true"
        className={`flex-1 overflow-y-auto pt-2 ${
          theme === "tabletech" ? "pb-28" : "pb-40"
        } gpu-accelerated optimized-scroll`}
        style={{ 
          overscrollBehavior: 'contain',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          contain: 'layout style paint',
          willChange: 'scroll-position',
          position: 'relative', // Required for scroll positioning
          height: '100%' // Zorg dat de container een vaste hoogte heeft
        }}
      >
        {/* Show content based on active category */}
        {renderMenuSection(activeCategory, false)}
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
              className={`absolute bottom-5 left-4 right-4 z-50 ${
                theme === "tabletech" ? "bg-[#7b4f35]" : 
                theme === "spicepalace" ? "bg-black" : 
                theme === "sweetdelights" ? "bg-pink-500" :
                theme === "coffeecorner" ? "bg-green-600" : "bg-gray-800"
              } text-white py-4 px-4 rounded-full text-sm font-bold text-center cursor-pointer shadow-xl transition-all duration-200 ${
                theme === "tabletech" ? "hover:bg-[#5e3b29]" : 
                theme === "spicepalace" ? "hover:bg-gray-800" : 
                theme === "sweetdelights" ? "hover:bg-pink-600" :
                theme === "coffeecorner" ? "hover:bg-green-700" : "hover:bg-gray-900"
              } flex items-center justify-center gap-2 transform hover:scale-105`}
            >
              {theme === "tabletech" ? (
                // TableTech: Originele eenvoudige layout
                <>
                  {translationTexts.orderButton} {cart.length} {cart.length === 1 ? translationTexts.items : translationTexts.itemsPlural} {translationTexts.for}{" "}
                  <motion.span
                    key={total}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }} // Faster price animation
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
                    transition={{ duration: 0.2 }} // Faster price animation
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
                duration: 0.4, // Faster cart animation
              }}
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold text-gray-900">{translationTexts.yourOrder}</h2>
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
                            <p className="text-sm font-medium text-gray-900 mb-0.5">
                              {isEnglish && item.nameEn ? item.nameEn : item.name}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              €{item.price.toFixed(2)}
                            </p>
                            {item.toppings && item.toppings.length > 0 && (
                              <div className={`text-xs mt-1 px-2 py-1 rounded border ${
                                theme === "coffeecorner"
                                  ? "bg-amber-50 border-amber-200"
                                  : theme === "sweetdelights"
                                  ? "bg-pink-50 border-pink-200"
                                  : theme === "spicepalace"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-orange-50 border-orange-200"
                              }`}>
                                <span className="font-medium text-gray-700">Toppings: </span>
                                <span className={`font-medium ${
                                  theme === "coffeecorner"
                                    ? "text-amber-700"
                                    : theme === "sweetdelights"
                                    ? "text-pink-700"
                                    : theme === "spicepalace"
                                    ? "text-red-700"
                                    : "text-orange-600"
                                }`}>
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
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 text-gray-900 font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-gray-900">{qty}</span>
                          <button
                            onClick={() => addToCart(id, item.category, toppings)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 text-gray-900 font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="px-4 py-2 border-t flex justify-between items-center font-semibold">
                <span className="text-gray-900">{translationTexts.subtotal}</span>
                <span className="text-lg font-bold text-gray-900">€{total}</span>
              </div>

              <div className="p-4">
                <button className={`w-full ${
                  theme === "tabletech" ? "bg-[#7b4f35] hover:bg-[#5e3b29]" : 
                  theme === "spicepalace" ? "bg-black hover:bg-gray-800" : 
                  theme === "sweetdelights" ? "bg-pink-500 hover:bg-pink-600" :
                  theme === "coffeecorner" ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-900"
                } text-white py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}>
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
              duration: 0.4, // Faster animation for better responsiveness
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
                  overscrollBehavior: 'contain',
                  maxHeight: 'calc(100vh - 200px)',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
                }}
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEnglish && selectedItem.nameEn ? selectedItem.nameEn : selectedItem.name}
                  </h2>
                  <p className="text-xl font-semibold text-gray-700 mt-1">
                    €{selectedItem.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedItem.description || selectedItem.descriptionEn || (isEnglish 
                    ? "This is a delicious example dish with rich flavor and presentation. Perfect for sharing or enjoying as a main course. Made with fresh ingredients and expertly prepared by our chefs."
                    : "Dit is een heerlijk voorbeeldgerecht met rijke smaak en presentatie. Perfect om te delen of te genieten als hoofdgerecht. Gemaakt met verse ingrediënten en vakkundig bereid door onze chefs."
                  )}
                </p>

                {theme === "tabletech" && (selectedItem.category === "curry" || selectedItem.category === "ramen" || selectedItem.category === "popular") && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {translationTexts.chooseSpicy}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">{translationTexts.chooseUpTo1}</p>
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
                          <span className="font-medium text-gray-800">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(theme === "tabletech" || theme === "spicepalace" || theme === "sweetdelights" || theme === "coffeecorner") && selectedItemToppings.length > 0 && (
                  <div className={`${
                    theme === "spicepalace" ? "bg-red-50" : 
                    theme === "sweetdelights" ? "bg-pink-50" :
                    theme === "coffeecorner" ? "bg-amber-50" :
                    "bg-gray-50"
                  } p-4 rounded-lg`}>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {theme === "spicepalace" ? (isEnglish ? "Customize your dish" : "Personaliseer je gerecht") :
                       theme === "sweetdelights" ? (isEnglish ? "Sweet extras" : "Zoete extra's") :
                       theme === "coffeecorner" ? (isEnglish ? "Customize your drink" : "Personaliseer je drankje") :
                       translationTexts.addToppings}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      {theme === "spicepalace" ? (isEnglish ? "Choose your preferred additions" : "Kies je gewenste toevoegingen") : 
                       theme === "sweetdelights" ? (isEnglish ? "Make it extra special" : "Maak het extra speciaal") :
                       theme === "coffeecorner" ? (isEnglish ? "Perfect your drink" : "Perfectioneer je drankje") :
                       translationTexts.chooseUpTo7}
                    </p>
                    <div className="flex flex-col gap-3">
                      {selectedItemToppings.map((top: ToppingItem) => (
                        <label
                          key={`topping-${isEnglish ? top.nameEn : top.name}-${selectedItem?.id}`}
                          className="flex justify-between items-center text-sm p-3 rounded-lg hover:bg-white cursor-pointer transition"
                        >
                          <div>
                            <span className="block font-medium text-gray-900">{isEnglish ? top.nameEn : top.name}</span>
                            <span className="text-xs text-gray-600">
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
                                : theme === "sweetdelights"
                                ? "border-pink-400 checked:bg-pink-500 checked:border-pink-500 hover:border-pink-500"
                                : theme === "coffeecorner"
                                ? "border-amber-500 checked:bg-green-600 checked:border-green-600 hover:border-amber-600"
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
                  if ((theme === "tabletech" || theme === "spicepalace" || theme === "sweetdelights" || theme === "coffeecorner") && selectedToppings.length > 0) {
                    addToCart(selectedItem.id, selectedItem.category, selectedToppings);
                  } else {
                    addToCart(selectedItem.id, selectedItem.category);
                  }
                  setSelectedItem(null);
                  setSelectedToppings([]);
                }}
                className={`w-full ${
                  theme === "spicepalace" ? "bg-black hover:bg-gray-800" : 
                  theme === "tabletech" ? "bg-[#7b4f35] hover:bg-[#5e3b29]" : 
                  theme === "sweetdelights" ? "bg-pink-500 hover:bg-pink-600" :
                  theme === "coffeecorner" ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-900"
                } text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
              >
                {translationTexts.addToOrder} • €{buttonTotal}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Set display name for debugging
PhoneMockup.displayName = 'PhoneMockup';

export default PhoneMockup;