import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mockMenu = [
  { id: 1, name: "Prawn Raisukaree", price: 12.0, image: "menu1.jpg" },
  { id: 2, name: "Firecracker Prawn", price: 11.0, image: "menu2.jpg" },
  { id: 3, name: "Tofu Firecracker", price: 9.75, image: "menu3.jpg" },
  { id: 4, name: "Chilli Steak Ramen", price: 8.95, image: "menu4.jpg" },
  { id: 5, name: "Yaki Udon", price: 8.95, image: "menu5.jpg" },
];

export const PhoneMock: React.FC = () => {
  const [cart, setCart] = useState<number[]>([]);
  const [hasCartAppeared, setHasCartAppeared] = useState(false);
  const [floaters, setFloaters] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<(typeof mockMenu)[0] | null>(
    null
  );

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
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

  const total = cart
    .map((id) => mockMenu.find((item) => item.id === id)?.price || 0)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);

  return (
    <div className="relative w-[320px] h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-black bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b shadow-sm">
        <div className="text-lg font-bold text-red-600 tracking-tight">
          ★ TableTech
        </div>
        <button className="text-xs border px-3 py-1 rounded-full hover:bg-gray-100 transition">
          English
        </button>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto px-2 py-3 gap-3 border-b">
        {[
          { name: "Popular", icon: "popular.png" },
          { name: "Curry", icon: "curry.png" },
          { name: "Ramen", icon: "ramen.png" },
          { name: "Pizza", icon: "pizza.png" },
          { name: "Drinks", icon: "drink.png" },
        ].map((cat) => (
          <button
            key={cat.name}
            className="flex flex-col items-center min-w-[70px] text-xs bg-orange-200 hover:bg-yellow-300 rounded-xl px-3 py-2 transition shadow-sm"
          >
            <img
              src={`/icons/${cat.icon}`}
              alt={cat.name}
              className="w-6 h-6 mb-1 object-contain"
            />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {mockMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="relative flex flex-col items-center bg-white border rounded-xl shadow-md overflow-hidden p-2 pb-10 hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={`/menu/${item.image}`}
                alt={item.name}
                className="w-full h-24 object-cover rounded"
              />
              <h3 className="text-sm font-semibold mt-2 text-center leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                €{item.price.toFixed(2)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item.id);
                }}
                className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center shadow-md transition"
              >
                +
              </button>

              {/* Floating +1 animation */}
              <AnimatePresence>
                {floaters.includes(item.id) && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute text-sm font-semibold text-green-500 bottom-12 right-3 pointer-events-none"
                  >
                    +1
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Order Bar */}
      <AnimatePresence>
        {cart.length > 0 && !selectedItem && (
          <motion.div
            key={cart.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 w-full p-3 bg-black text-white text-sm font-semibold text-center z-50"
          >
            Order {cart.length} item{cart.length > 1 && "s"} for{" "}
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
        )}
      </AnimatePresence>

      {/* Modal View */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-40 bg-white flex flex-col"
          >
            {/* Header image with back button */}
            <div className="relative">
              <img
                src={`/menu/${selectedItem.image}`}
                alt={selectedItem.name}
                className="w-full h-44 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white text-xl font-bold text-gray-800 flex items-center justify-center shadow"
              >
                ←
              </button>
            </div>

            {/* Info content */}
            {/* Info content with fade */}
            <div className="relative flex-1 overflow-hidden">
              {/* Scrollable content */}
              <div className="p-4 h-full overflow-y-auto pb-[100px] flex flex-col gap-4">
                {/* Title + Price */}
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    {selectedItem.name}
                  </h2>
                  <p className="text-xl text-gray-500 mt-1">
                    €{selectedItem.price.toFixed(2)}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  This is a delicious example dish with rich flavor and
                  presentation.
                </p>

                {/* Spicy/Original radio group */}
                <div>
                  <h4 className="font-semibold text-sm mb-1">
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

                {/* Toppings */}
                <div>
                  <h4 className="font-semibold text-sm mb-1">
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
                        <input type="checkbox" className="accent-black" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gradient fade-out */}
              <div className="pointer-events-none absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent z-10" />
            </div>

            {/* Add to Order Button */}
            <div className="absolute bottom-4 left-4 right-4 z-50">
              <button
                onClick={() => {
                  addToCart(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="w-full bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-gray-900 transition text-center"
              >
                Toevoegen aan bestelling • €{selectedItem.price.toFixed(2)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
