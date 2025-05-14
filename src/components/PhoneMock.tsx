import React, { useState } from "react";
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
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 500); // Reset animation flag
  };

  const total = cart
    .map((id) => mockMenu.find((item) => item.id === id)?.price || 0)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);

  return (
    <div className="w-[300px] h-[600px] rounded-[2rem] shadow-lg border-4 border-black bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="text-lg font-bold text-red-600">★ TableTech</div>
        <button className="text-sm border px-2 py-1 rounded-full">
          English
        </button>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto p-2 gap-3 border-b">
        {["Popular", "Curry", "Ramen", "Teppanyaki", "Donburi"].map((cat) => (
          <button
            key={cat}
            className="text-sm whitespace-nowrap bg-yellow-100 rounded-full px-4 py-1 font-medium"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-3">
          {mockMenu.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col items-center bg-white border rounded-lg shadow-md overflow-hidden p-2 pb-10"
            >
              <img
                src={`/menu/${item.image}`} // <- coming soon, see step 2
                alt={item.name}
                className="w-full h-24 object-cover rounded"
              />
              <h3 className="text-sm font-medium mt-2 text-center">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500">€{item.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(item.id)}
                className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center shadow-lg"
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
            initial={{ y: 0 }} // <-- was y: 80 before, now matches final
            animate={{ y: [0, -6, 0] }}
            exit={{ y: 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-3 bg-black text-white text-sm font-semibold text-center"
          >
            Order {cart.length} item{cart.length > 1 && "s"} for €{total}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
