import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoCart, 
  IoClose, 
  IoAdd, 
  IoRemove,
  IoChevronBack,
  IoSearch,
  IoFilter
} from "react-icons/io5";
import { tableTechMenu, tableTechCategories, MenuItem, CategoryId } from "../../data/menuData";

const MenuDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"nl" | "en">("nl");

  // Filter menu items based on category and search
  const filteredItems = tableTechMenu[selectedCategory].filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(searchLower) || 
           (item.nameEn && item.nameEn.toLowerCase().includes(searchLower));
  });

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Add to cart
  const addToCart = (item: MenuItem) => {
    setCartItems([...cartItems, item]);
    // Show brief notification
    const notification = document.createElement("div");
    notification.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    notification.textContent = "Toegevoegd aan winkelwagen!";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  // Remove from cart
  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // Get cart count
  const getItemCount = (itemId: number) => {
    return cartItems.filter(item => item.id === itemId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#7b4f35]">TableTech Menu</h1>
            </div>

            {/* Language Toggle & Cart */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === "nl" ? "en" : "nl")}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {language === "nl" ? "EN" : "NL"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-[#7b4f35] text-white rounded-lg hover:bg-[#5e3b29] transition-colors"
              >
                <IoCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-16 z-30 bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={language === "nl" ? "Zoek gerechten..." : "Search dishes..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7b4f35]"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-32 z-20 bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tableTechCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#7b4f35] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">
                  {language === "nl" ? category.name : (category.nameEn || category.name)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const itemCount = getItemCount(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => setSelectedProduct(item)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                  {itemCount > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-sm px-2 py-1 rounded-full">
                      {itemCount}x
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {language === "nl" ? item.name : (item.nameEn || item.name)}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {language === "nl" ? item.description : (item.descriptionEn || item.description)}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#7b4f35]">
                      €{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="bg-[#7b4f35] text-white p-2 rounded-lg hover:bg-[#5e3b29] transition-colors"
                    >
                      <IoAdd size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x400/f3f4f6/6b7280?text=${encodeURIComponent(selectedProduct.name)}`;
                  }}
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === "nl" ? selectedProduct.name : (selectedProduct.nameEn || selectedProduct.name)}
                </h2>
                {selectedProduct.description && (
                  <p className="text-gray-600 mb-4">
                    {language === "nl" ? selectedProduct.description : (selectedProduct.descriptionEn || selectedProduct.description)}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#7b4f35]">
                    €{selectedProduct.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="bg-[#7b4f35] text-white px-6 py-3 rounded-lg hover:bg-[#5e3b29] transition-colors flex items-center gap-2"
                  >
                    <IoAdd size={24} />
                    <span>{language === "nl" ? "Toevoegen" : "Add to cart"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "nl" ? "Winkelwagen" : "Shopping Cart"}
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500 mt-8">
                    {language === "nl" ? "Je winkelwagen is leeg" : "Your cart is empty"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/64x64/f3f4f6/6b7280?text=${encodeURIComponent(item.name.substring(0, 2))}`;
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {language === "nl" ? item.name : (item.nameEn || item.name)}
                          </h4>
                          <p className="text-[#7b4f35] font-semibold">€{item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <IoRemove size={20} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>{language === "nl" ? "Totaal" : "Total"}</span>
                    <span className="text-[#7b4f35]">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-[#7b4f35] text-white py-3 rounded-lg hover:bg-[#5e3b29] transition-colors font-medium">
                    {language === "nl" ? "Afrekenen" : "Checkout"}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuDemo;