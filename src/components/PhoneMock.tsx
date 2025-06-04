import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

type CategoryId = "popular" | "curry" | "ramen" | "pizza" | "drinks";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: CategoryId;
}

interface CategoryItem {
  name: string;
  icon: string;
  id: CategoryId;
}

const mockMenu: Record<CategoryId, MenuItem[]> = {
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
};

const categories: CategoryItem[] = [
  { name: "Popular", icon: "/icons/popular.png", id: "popular" },
  { name: "Curry", icon: "/icons/curry.png", id: "curry" },
  { name: "Ramen", icon: "/icons/ramen.png", id: "ramen" },
  { name: "Pizza", icon: "/icons/pizza.png", id: "pizza" },
  { name: "Drinks", icon: "/icons/drink.png", id: "drinks" },
];

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

const PhoneMockup: React.FC = () => {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [hasCartAppeared, setHasCartAppeared] = useState(false);
  const [floaters, setFloaters] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isEnglish, setIsEnglish] = useState(false);

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const sectionRefs: Record<CategoryId, React.RefObject<HTMLDivElement>> = {
    popular: useRef<HTMLDivElement>(null),
    curry: useRef<HTMLDivElement>(null),
    ramen: useRef<HTMLDivElement>(null),
    pizza: useRef<HTMLDivElement>(null),
    drinks: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    const targetSection = sectionRefs[categoryId].current;
    
    if (mainScrollContainer && targetSection) {
      // Calculate the exact scroll position needed
      const containerRect = mainScrollContainer.getBoundingClientRect();
      const sectionRect = targetSection.getBoundingClientRect();
      const scrollOffset = sectionRect.top - containerRect.top + mainScrollContainer.scrollTop - 10;
      
      // Direct scroll without animation for immediate response
      mainScrollContainer.scrollTop = Math.max(0, scrollOffset);
    }
  };

  // Add scroll tracking for categories
  useEffect(() => {
    const mainScrollContainer = document.querySelector('[data-phone-scroll-container="true"]') as HTMLElement;
    if (!mainScrollContainer) return;

    const updateActiveCategory = () => {
      // Check which section is currently in view
      for (const categoryId of Object.keys(sectionRefs) as CategoryId[]) {
        const section = sectionRefs[categoryId].current;
        if (section) {
          const rect = section.getBoundingClientRect();
          const containerRect = mainScrollContainer.getBoundingClientRect();
          
          // Check if section is in the top portion of the container
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
  }, [activeCategory, sectionRefs]); // Add sectionRefs to dependencies

  const addToCart = (id: number, category: CategoryId) => {
    const item = mockMenu[category].find((i) => i.id === id);
    if (!item) return;
    setCart((prev) => [...prev, item]);
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

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  const t = getTranslation(isEnglish);

  const extraTotal = selectedToppings
    .map((t) => toppingsData.find((top) => (isEnglish ? top.nameEn : top.name) === t)?.price || 0)
    .reduce((a, b) => a + b, 0);

  const buttonTotal = selectedItem
    ? (selectedItem.price + extraTotal).toFixed(2)
    : "0.00";

  const renderMenuSection = (categoryId: CategoryId) => {
    const items = mockMenu[categoryId];

    return (
      <div ref={sectionRefs[categoryId]} className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3 px-1 sticky -top-2 bg-white py-2 border-b z-10">
          {categories.find((c) => c.id === categoryId)?.name}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="relative flex flex-col items-center bg-white ring-1 ring-gray-200 rounded-2xl overflow-hidden p-3 pb-3 transform transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full aspect-square object-cover rounded-lg mb-2"
              />
              <h3 className="text-sm font-semibold text-center leading-tight">
                {item.name}
              </h3>
              <div className="flex items-center w-full mt-2">
                <span className="text-base font-bold text-gray-600 flex-1">
                  €{item.price.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item.id, item.category);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors duration-150"
                >
                  <FaPlus size={14} />
                </button>
              </div>

              <AnimatePresence>
                {floaters.includes(item.id) && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute text-sm font-semibold text-green-500 bottom-14 right-4 pointer-events-none"
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

  return (
    <div 
      data-phone-container="true"
      className="relative w-[320px] h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-black bg-white flex flex-col font-sans"
    >
      <div className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="text-lg font-bold text-red-600 tracking-tight">
          TableTech.
        </div>
        <button 
          onClick={() => setIsEnglish(!isEnglish)}
          className="text-xs border px-3 py-1 rounded-full hover:bg-gray-100 transition"
        >
          {isEnglish ? 'Nederlands' : 'English'}
        </button>
      </div>

      {/* CATEGORIES HORIZONTAL SCROLL - This gets horizontal scroll behavior */}
      <div 
        className="flex overflow-x-auto px-2 py-3 gap-3 border-b scrollbar-hide"
        data-horizontal-scroll="true"
        style={{ 
          scrollBehavior: 'auto', // Remove smooth for instant response
          overscrollBehavior: 'contain',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToSection(cat.id)}
            className={`flex flex-col items-center min-w-[70px] text-xs rounded-xl px-3 py-2 transition shadow-sm ${
              activeCategory === cat.id
                ? "bg-yellow-300"
                : "bg-orange-200 hover:bg-yellow-200"
            }`}
          >
            <img
              src={cat.icon}
              alt={cat.name}
              loading="lazy"
              className="w-6 h-6 mb-1 object-contain"
            />
            {cat.name}
          </button>
        ))}
      </div>

      {/* MAIN SCROLLABLE AREA - This receives vertical scroll events from overlay */}
      <div 
        data-phone-scroll-container="true"
        className="flex-1 overflow-y-auto px-3 pt-2 pb-40"
        style={{ 
          scrollBehavior: 'auto', // Remove smooth for instant response
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
              className="absolute bottom-5 left-4 right-4 z-50 bg-black text-white py-4 px-4 rounded-full text-sm font-bold text-center cursor-pointer shadow-lg transition hover:bg-gray-900"
            >
              {t.orderButton} {cart.length} {cart.length === 1 ? t.items : t.itemsPlural} {t.for}{" "}
              <motion.span
                key={total}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                €{total}
              </motion.span>
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
              onClick={(e) => e.stopPropagation()}
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
                <h2 className="text-lg font-bold">{t.yourOrder}</h2>
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

              {/* CART SCROLLABLE AREA */}
              <div 
                className="flex-1 overflow-y-auto"
                data-phone-scroll-container="true"
                data-phone-cart-scroll="true"
                style={{ 
                  scrollBehavior: 'auto', // Instant response
                  overscrollBehavior: 'contain'
                }}
              >
                {[...new Set(cart.map((i) => i.id))].map((id) => {
                  const item = cart.find((i) => i.id === id)!;
                  const qty = cart.filter((i) => i.id === id).length;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 pr-2 border-b"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium mb-0.5">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            €{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(id)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150"
                        >
                          −
                        </button>
                        <span className="text-xl font-bold">{qty}</span>
                        <button
                          onClick={() => addToCart(id, item.category)}
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
                <span>{t.subtotal}</span>
                <span className="text-lg font-bold">€{total}</span>
              </div>

              <div className="p-4">
                <button className="w-full bg-black text-white py-3 rounded-full font-semibold shadow-md transition hover:bg-gray-900">
                  {t.continue}
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
              {/* PRODUCT DETAIL SCROLLABLE AREA */}
              <div 
                className="p-4 h-full overflow-y-auto pb-[120px] flex flex-col gap-4"
                data-phone-scroll-container="true"
                data-product-detail-scroll="true"
                style={{ 
                  scrollBehavior: 'auto', // Instant response
                  overscrollBehavior: 'contain',
                  maxHeight: 'calc(100vh - 200px)' // Ensure scrollable area
                }}
              >
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    {selectedItem.name}
                  </h2>
                  <p className="text-xl font-semibold text-gray-500 mt-1">
                    €{selectedItem.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {isEnglish 
                    ? "This is a delicious example dish with rich flavor and presentation. Perfect for sharing or enjoying as a main course. Made with fresh ingredients and expertly prepared by our chefs. Our culinary team takes pride in sourcing the finest ingredients to create memorable dining experiences. Each dish tells a story of culinary expertise and passion for great food."
                    : "Dit is een heerlijk voorbeeldgerecht met rijke smaak en presentatie. Perfect om te delen of te genieten als hoofdgerecht. Gemaakt met verse ingrediënten en vakkundig bereid door onze chefs. Ons culinaire team is er trots op de beste ingrediënten te gebruiken voor onvergetelijke eetmomenten. Elk gerecht vertelt een verhaal van culinaire expertise en passie voor lekker eten."
                  }
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">
                    {t.chooseSpicy}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">{t.chooseUpTo1}</p>
                  <div className="flex flex-col gap-3">
                    {["Spicy", "Original"].map((option) => (
                      <label
                        key={option}
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
                    {t.addToppings}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">{t.chooseUpTo7}</p>
                  <div className="flex flex-col gap-3">
                    {toppingsData.map((top) => (
                      <label
                        key={isEnglish ? top.nameEn : top.name}
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
                                ? prev.filter((t) => t !== toppingName)
                                : [...prev, toppingName]
                            );
                          }}
                          className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-black checked:border-black hover:border-gray-500 active:border-gray-600 transition-colors duration-150"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nutritional Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold mb-3 text-blue-800">{t.nutritionalInfo}</h4>
                  <div className="text-xs text-gray-700 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>{t.calories}:</span>
                        <span className="font-medium">{isEnglish ? "350 per serving" : "350 per portie"}</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>{t.protein}:</span>
                        <span className="font-medium">25g</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>{t.carbs}:</span>
                        <span className="font-medium">30g</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>{t.fat}:</span>
                        <span className="font-medium">15g</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>{t.fiber}:</span>
                        <span className="font-medium">5g</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>{t.sugar}:</span>
                        <span className="font-medium">8g</span>
                      </div>
                    </div>
                    <div className="flex justify-between bg-white p-2 rounded">
                      <span>{t.sodium}:</span>
                      <span className="font-medium">650mg</span>
                    </div>
                  </div>
                </div>

                {/* Allergen Information */}
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="text-sm font-semibold mb-3 text-yellow-800">{t.allergenInfo}</h4>
                  <div className="text-xs text-gray-700 space-y-2">
                    <p><strong>{t.contains}:</strong> {isEnglish ? "Gluten, Dairy, Shellfish" : "Gluten, Zuivel, Schaaldieren"}</p>
                    <p><strong>{t.mayContain}:</strong> {isEnglish ? "Nuts, Soy, Sesame" : "Noten, Soja, Sesam"}</p>
                    <p><strong>{isEnglish ? "Preparation" : "Bereiding"}:</strong> {t.preparation}</p>
                  </div>
                </div>

                {/* Chef's Recommendations */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold mb-3 text-green-800">{t.chefRecommendations}</h4>
                  <div className="text-xs text-gray-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{t.bestEnjoyed}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{t.pairsWell}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{t.addVeggies}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{t.perfectSharing}</span>
                    </div>
                  </div>
                </div>

                {/* Preparation Time */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold mb-3 text-purple-800">{t.preparationTime}</h4>
                  <div className="text-xs text-gray-700 space-y-2">
                    <p className="bg-white p-2 rounded">
                      <strong>{t.estimatedTime}:</strong> <span className="text-purple-600 font-semibold">{isEnglish ? "12-15 minutes" : "12-15 minuten"}</span>
                    </p>
                    <p className="bg-white p-2 rounded">{t.freshOrder}</p>
                  </div>
                </div>

                {/* Extra content sections to ensure scrolling */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-3">{isEnglish ? "Ingredients" : "Ingrediënten"}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isEnglish 
                      ? "Premium quality ingredients carefully selected from trusted suppliers. Fresh vegetables, high-grade proteins, and authentic spices combine to create this exceptional dish. We source locally whenever possible to ensure maximum freshness and support our community."
                      : "Premium kwaliteit ingrediënten zorgvuldig geselecteerd van vertrouwde leveranciers. Verse groenten, hoogwaardige eiwitten en authentieke kruiden combineren om dit uitzonderlijke gerecht te creëren. We kopen lokaal wanneer mogelijk om maximale versheid te garanderen en onze gemeenschap te steunen."
                    }
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-3">{isEnglish ? "Sustainability" : "Duurzaamheid"}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isEnglish 
                      ? "We are committed to sustainable practices. Our packaging is eco-friendly, and we work with suppliers who share our environmental values. This dish is prepared with minimal waste and maximum care for our planet."
                      : "We zijn toegewijd aan duurzame praktijken. Onze verpakking is milieuvriendelijk en we werken samen met leveranciers die onze milieuwaarden delen. Dit gerecht wordt bereid met minimaal afval en maximale zorg voor onze planeet."
                    }
                  </p>
                </div>

                {/* Add significant bottom padding to ensure all content is scrollable */}
                <div className="h-20"></div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-4 h-14 bg-white z-10" />
            <div className="pointer-events-none absolute bottom-12 left-0 right-4 h-24 bg-gradient-to-t from-white to-transparent z-10" />

            <div className="absolute bottom-4 left-4 right-4 z-50">
              <button
                onClick={() => {
                  addToCart(selectedItem.id, selectedItem.category);
                  setSelectedItem(null);
                  setSelectedToppings([]);
                }}
                className="w-full bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-gray-900 transition"
              >
                {t.addToOrder} • €{buttonTotal}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneMockup;