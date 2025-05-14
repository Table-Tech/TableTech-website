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

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
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
      <div className="flex overflow-x-auto px-2 py-3 gap-2 border-b">
        {["Popular", "Curry", "Ramen", "Teppanyaki", "Donburi"].map((cat) => (
          <button
            key={cat}
            className="text-xs whitespace-nowrap bg-yellow-200 hover:bg-yellow-300 rounded-full px-4 py-1 font-medium transition"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {mockMenu.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col items-center bg-white border rounded-xl shadow-md overflow-hidden p-2 pb-10 hover:shadow-lg transition"
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
                onClick={() => addToCart(item.id)}
                className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center shadow-md transition"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Bar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            key={cart.length}
            initial={{ y: hasCartAppeared ? 0 : 80 }}
            animate={{ y: hasCartAppeared ? [0, -6, 0] : 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-full p-3 bg-black text-white text-sm font-semibold text-center"
          >
            Order {cart.length} item{cart.length > 1 && "s"} for €{total}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
