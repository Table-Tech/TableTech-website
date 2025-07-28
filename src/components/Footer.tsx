import React from "react";
import { Phone, Mail, MapPin, ChefHat } from "lucide-react";

interface FooterProps {
  onOpenCustomerDemo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCustomerDemo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#2C1E1A] text-[#FFD382] py-12 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#FFD382] rounded-lg flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-[#2C1E1A]" />
              </div>
              <span className="text-2xl font-bold text-white">TableTech</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <a href="tel:+31853030723" className="hover:text-white transition">
                  +31 85 303 07 23
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@tabletech.nl" className="hover:text-white transition">
                  info@tabletech.nl
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Nederland</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Producten</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/qr-menu" className="hover:text-white transition">QR Menu Systeem</a>
              </li>
              <li>
                <a href="/online-bestellen" className="hover:text-white transition">Online Bestellen</a>
              </li>
              <li>
                <a href="/betaalsysteem" className="hover:text-white transition">Betaalsysteem</a>
              </li>
              <li>
                <a href="/analytics" className="hover:text-white transition">Analytics Dashboard</a>
              </li>
              <li>
                <a href="/integraties" className="hover:text-white transition">Integraties</a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition">Prijzen</a>
              </li>
              <li>
                <button
                  onClick={onOpenCustomerDemo}
                  className="hover:text-white transition text-left"
                >
                  Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Doelgroepen</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/restaurants" className="hover:text-white transition">Restaurants</a></li>
              <li><a href="/cafes" className="hover:text-white transition">Cafés & Bars</a></li>
              <li><a href="/hotels" className="hover:text-white transition">Hotels</a></li>
              <li><a href="/festivals" className="hover:text-white transition">Festivals & Events</a></li>
              <li><a href="/fastfood" className="hover:text-white transition">Fast Food</a></li>
              <li><a href="/kantines" className="hover:text-white transition">Bedrijfskantines</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Bedrijf</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/over-ons" className="hover:text-white transition">Over TableTech</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">Contact</a>
              </li>
              <li>
                <a href="/support" className="hover:text-white transition">Support</a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition">Blog</a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition">Carrières</a>
              </li>
              <li>
                <a href="/partners" className="hover:text-white transition">Partners</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#3B2A1D] flex flex-col md:flex-row justify-between items-center text-sm">
          <div>
            <p className="text-[#FFD382]/80 mb-2 md:mb-0">
              &copy; {currentYear} <span className="font-semibold text-white">TableTech</span>. Alle rechten voorbehouden.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <a href="/privacy" className="hover:text-white transition">
              Privacybeleid
            </a>
            <a href="/voorwaarden" className="hover:text-white transition">
              Algemene Voorwaarden
            </a>
            <a href="/cookies" className="hover:text-white transition">
              Cookies
            </a>
            <a href="/security" className="hover:text-white transition">
              Beveiliging
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};