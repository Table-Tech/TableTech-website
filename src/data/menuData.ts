export interface MenuItem {
  id: number;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  category: CategoryId;
  description?: string;
  descriptionEn?: string;
}

export interface CartItem extends MenuItem {
  toppings?: string[];
  toppingsPrice?: number;
}

export interface CategoryItem {
  name: string;
  nameEn?: string;
  icon: string;
  id: CategoryId;
}

export interface ToppingItem {
  name: string;
  nameEn: string;
  price: number;
}

export type CategoryId = "all" | "popular" | "curry" | "ramen" | "pizza" | "drinks" | "handi" | "kebab" | "rice" | "bbq" | "karahi" | "tandoori" | "cakes" | "coffee-specialties" | "cold-drinks" | "hot-drinks" | "pastries";

// TableTech menu (original)
export const tableTechMenu: Record<CategoryId, MenuItem[]> = {
  all: [],
  popular: [
    {
      id: 1,
      name: "Prawn Raisukaree",
      price: 12.0,
      image: "/menu/menu1.jpg",
      category: "popular",
      description: "Heerlijke garnalen in een rijke curry saus",
      descriptionEn: "Delicious prawns in rich curry sauce"
    },
    {
      id: 2,
      name: "Chicken Tikka Masala",
      price: 10.5,
      image: "/menu/menu2.jpg",
      category: "popular",
      description: "Gegrilde kip in een romige tomatensaus",
      descriptionEn: "Grilled chicken in creamy tomato sauce"
    },
    {
      id: 3,
      name: "Beef Teriyaki",
      price: 14.0,
      image: "/menu/menu3.jpg",
      category: "popular",
      description: "Malse biefstuk met teriyaki glazuur",
      descriptionEn: "Tender beef with teriyaki glaze"
    },
  ],
  curry: [
    {
      id: 4,
      name: "Green Curry",
      price: 9.5,
      image: "/menu/curry1.jpg",
      category: "curry",
      description: "Thaise groene curry met groenten",
      descriptionEn: "Thai green curry with vegetables"
    },
    {
      id: 5,
      name: "Red Curry",
      price: 9.5,
      image: "/menu/curry2.jpg",
      category: "curry",
      description: "Pittige rode curry met kokosmelk",
      descriptionEn: "Spicy red curry with coconut milk"
    },
  ],
  ramen: [
    {
      id: 6,
      name: "Shoyu Ramen",
      price: 11.0,
      image: "/menu/ramen1.jpg",
      category: "ramen",
      description: "Klassieke soja-basis ramen",
      descriptionEn: "Classic soy-based ramen"
    },
    {
      id: 7,
      name: "Miso Ramen",
      price: 11.5,
      image: "/menu/ramen2.jpg",
      category: "ramen",
      description: "Rijke miso ramen met chashu",
      descriptionEn: "Rich miso ramen with chashu"
    },
  ],
  pizza: [
    {
      id: 8,
      name: "Margherita",
      price: 8.5,
      image: "/menu/pizza1.jpg",
      category: "pizza",
      description: "Klassieke pizza met tomaat en mozzarella",
      descriptionEn: "Classic pizza with tomato and mozzarella"
    },
    {
      id: 9,
      name: "Pepperoni",
      price: 10.0,
      image: "/menu/pizza2.jpg",
      category: "pizza",
      description: "Pizza met pepperoni en extra kaas",
      descriptionEn: "Pizza with pepperoni and extra cheese"
    },
  ],
  drinks: [
    {
      id: 10,
      name: "Cola",
      price: 2.5,
      image: "/menu/cola.jpg",
      category: "drinks",
    },
    {
      id: 11,
      name: "Sprite",
      price: 2.5,
      image: "/menu/sprite.jpg",
      category: "drinks",
    },
    {
      id: 12,
      name: "Fanta",
      price: 2.5,
      image: "/menu/fanta.jpg",
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

// Categories for TableTech
export const tableTechCategories: CategoryItem[] = [
  { name: "Alles", nameEn: "All", icon: "🍽️", id: "all" },
  { name: "Populair", nameEn: "Popular", icon: "⭐", id: "popular" },
  { name: "Curry", icon: "🍛", id: "curry" },
  { name: "Ramen", icon: "🍜", id: "ramen" },
  { name: "Pizza", icon: "🍕", id: "pizza" },
  { name: "Dranken", nameEn: "Drinks", icon: "🥤", id: "drinks" },
];

// Populate "all" category
tableTechMenu.all = Object.values(tableTechMenu).flat().filter(item => item);