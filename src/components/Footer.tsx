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
        
        {/* Minimal Footer Content */}
        <div className="text-center mb-8">
          {/* Company Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#FFD382] rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-[#2C1E1A]" />
            </div>
            <span className="text-2xl font-bold text-white">TableTech</span>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+31853030723" className="hover:text-white transition">
                +31 85 303 07 23
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@tabletech.nl" className="hover:text-white transition">
                info@tabletech.nl
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Nederland</span>
            </div>
          </div>
        </div>

        {/* Simple Bottom Section */}
        <div className="pt-6 border-t border-[#3B2A1D] text-center text-sm">
          <p className="text-[#FFD382]/80">
            &copy; {currentYear} <span className="font-semibold text-white">TableTech</span>. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};