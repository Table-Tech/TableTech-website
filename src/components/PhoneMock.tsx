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

// point these at public/icons/*.png
const categories: CategoryItem[] = [
  { name: "Popular", icon: "/icons/popular.png", id: "popular" },
  { name: "Curry", icon: "/icons/curry.png", id: "curry" },
  { name: "Ramen", icon: "/icons/ramen.png", id: "ramen" },
  { name: "Pizza", icon: "/icons/pizza.png", id: "pizza" },
  { name: "Drinks", icon: "/icons/drink.png", id: "drinks" },
];

const toppingsData = [
  { name: "extra kaas", price: 0.75 },
  { name: "extra augurk", price: 0.75 },
  { name: "extra jalopenos", price: 0.75 },
];

export default function App() {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [hasCartAppeared, setHasCartAppeared] = useState(false);
  const [floaters, setFloaters] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  // Refs for section scrolling
  const sectionRefs: Record<CategoryId, React.RefObject<HTMLDivElement>> = {
    popular: useRef<HTMLDivElement>(null),
    curry: useRef<HTMLDivElement>(null),
    ramen: useRef<HTMLDivElement>(null),
    pizza: useRef<HTMLDivElement>(null),
    drinks: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    sectionRefs[categoryId].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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

  const extraTotal = selectedToppings
    .map((t) => toppingsData.find((top) => top.name === t)?.price || 0)
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
              className="
            relative flex flex-col items-center
            bg-white ring-1 ring-gray-200
            rounded-2xl overflow-hidden
            p-3 pb-3 transform transition
            hover:-translate-y-1 hover:shadow-lg
            cursor-pointer
          "
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
              />
              <h3 className="text-sm font-semibold text-center leading-tight">
                {item.name}
              </h3>
              {/* Price + Button row */}
              <div className="flex items-center w-full mt-2">
                <span className="text-base font-bold text-gray-600 flex-1">
                  €{item.price.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item.id, item.category);
                  }}
                  className="
                bg-green-500 hover:bg-green-600
                text-white rounded-full
                w-8 h-8 flex items-center justify-center
                shadow-md transition-colors duration-150
              "
                >
                  <FaPlus size={14} />
                </button>
              </div>

              {/* Floating +1 */}
              <AnimatePresence>
                {floaters.includes(item.id) && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="
                  absolute text-sm font-semibold text-green-500
                  bottom-14 right-4 pointer-events-none
                "
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
    <div className="relative w-[320px] h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-black bg-white flex flex-col font-sans">
      {" "}
      <div className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="text-lg font-bold text-red-600 tracking-tight">
          TableTech.
        </div>
        <button className="text-xs border px-3 py-1 rounded-full hover:bg-gray-100 transition">
          English
        </button>
      </div>
      {/* Categories */}
      <div className="flex overflow-x-auto px-2 py-3 gap-3 border-b">
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
              className="w-6 h-6 mb-1 object-contain"
            />
            {cat.name}
          </button>
        ))}
      </div>
      {/* Menu List with Sections */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-40">
        {categories.map((cat) => renderMenuSection(cat.id))}
      </div>
      {/* Order Bar */}
      <AnimatePresence>
        {cart.length > 0 && !selectedItem && !cartOpen && (
          <>
            {/* White gradient fade above button */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-40" />

            {/* Pill-shaped Order Button */}
            <motion.div
              onClick={() => setCartOpen(true)}
              key={cart.length}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
          absolute bottom-5 left-4 right-4 z-50
          bg-black text-white py-4 px-4 rounded-full
          text-sm font-bold text-center cursor-pointer shadow-lg
          transition hover:bg-gray-900
        "
            >
              Bestel {cart.length} gerecht{cart.length === 1 ? "" : "en"} voor{" "}
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
      {/* 2) Basket bottom‐sheet */}
      <AnimatePresence>
        {cartOpen && (
          // backdrop
          <motion.div
            className="absolute inset-0 bg-black/50 z-50"
            onClick={() => setCartOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* sheet panel */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl flex flex-col h-5/6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier curve (nice spring-like feel with no bounce)
                duration: 0.6,
              }}
            >
              {/* header */}
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold">Jouw bestelling</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close basket"
                  className="
            group
            p-0
            rounded-full
            transition
            hover:bg-gray-200
            focus:outline-none
          "
                >
                  <span className="text-3xl font-bold text-gray-700 group-hover:text-black leading-none">
                    ×
                  </span>
                </button>
              </div>

              {/* list of unique cart items */}
              <div className="flex-1 overflow-y-auto">
                {[...new Set(cart.map((i) => i.id))].map((id) => {
                  const item = cart.find((i) => i.id === id)!;
                  const qty = cart.filter((i) => i.id === id).length;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 pr-2 border-b"
                    >
                      {/* left: image + text */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
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

                      {/* right: quantity controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(id)}
                          className="
                    w-8 h-8
                    bg-gray-100 rounded-full
                    flex items-center justify-center
                    hover:bg-gray-200 active:bg-gray-300
                    transition-colors duration-150
                  "
                        >
                          −
                        </button>
                        <span className="text-xl font-bold">{qty}</span>
                        <button
                          onClick={() => addToCart(id, item.category)}
                          className="
                    w-8 h-8
                    bg-gray-100 rounded-full
                    flex items-center justify-center
                    hover:bg-gray-200 active:bg-gray-300
                    transition-colors duration-150
                  "
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-2 border-t flex justify-between items-center font-semibold">
                <span>Subtotal</span>
                <span className="text-lg font-bold">€{total}</span>
              </div>

              {/* Continue button */}
              <div className="p-4">
                <button
                  className="
              w-full bg-black text-white py-3 rounded-full
              font-semibold shadow-md transition hover:bg-gray-900
            "
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Modal View */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              ease: [0.16, 1, 0.3, 1], // Same custom cubic-bezier curve as bottom sheet
              duration: 0.6,
            }}
            className="absolute inset-0 z-40 bg-white flex flex-col"
          >
            {/* Header image + back */}
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-44 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="
            absolute top-3 left-3
            w-8 h-8
            flex items-center justify-center
            bg-white rounded-full shadow
            hover:bg-gray-100 active:bg-gray-600
            transition-colors duration-150
          "
              >
                <IoArrowBack size={20} className="text-gray-800" />
              </button>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-hidden">
              <div className="p-4 h-full overflow-y-auto pb-[100px] flex flex-col gap-4">
                {/* Title on top, price underneath */}
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    {selectedItem.name}
                  </h2>
                  <p className="text-xl font-semibold text-gray-500 mt-1">
                    €{selectedItem.price.toFixed(2)}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  This is a delicious example dish with rich flavor and
                  presentation.
                </p>

                {/* Flavor */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Keuze Original/Spicy
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">Choose up to 1</p>
                  <div className="flex flex-col gap-2">
                    {["Spicy", "Original"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="flavor"
                          className="accent-black"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200 my-4" />

                {/* Toppings */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Toppings toevoegen / Add Toppings
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">Choose up to 7</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "extra kaas", price: 0.75 },
                      { name: "extra augurk", price: 0.75 },
                      { name: "extra jalopenos", price: 0.75 },
                    ].map((top) => (
                      <label
                        key={top.name}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <span className="block font-medium">{top.name}</span>
                          <span className="text-xs text-gray-500">
                            +€{top.price.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedToppings.includes(top.name)}
                          onChange={() => {
                            setSelectedToppings((prev) =>
                              prev.includes(top.name)
                                ? prev.filter((t) => t !== top.name)
                                : [...prev, top.name]
                            );
                          }}
                          className="
                      appearance-none
                      w-5 h-5
                      border-2 border-gray-400
                      rounded-full
                      checked:bg-black checked:border-black
                      hover:border-gray-500 active:border-gray-600
                      transition-colors duration-150
                    "
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Solid white block under the button */}
            <div className="absolute bottom-0 left-0 right-4 h-14 bg-white z-10" />

            {/* Gradient fade‐out above that white block */}
            <div className="pointer-events-none absolute bottom-12 left-0 right-4 h-24 bg-gradient-to-t from-white to-transparent z-10" />

            {/* Add to Order */}
            <div className="absolute bottom-4 left-4 right-4 z-50">
              <button
                onClick={() => {
                  addToCart(selectedItem.id, selectedItem.category);
                  setSelectedItem(null);
                }}
                className="w-full bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-gray-900 transition"
              >
                Toevoegen aan bestelling • €{buttonTotal}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
