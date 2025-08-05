import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  onOpenCustomerDemo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCustomerDemo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative bg-[#2C1E1A] text-[#FFD382] py-12 w-full overflow-hidden">
      {/* VERBETERDE overgang van CallToAction - Perfect naadloos */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none">
        {/* Perfect blend met CTA sectie */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E1A] via-[#2C1E1A]/95 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#2C1E1A]"></div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFD382]/10 via-transparent to-[#E86C28]/5"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64">
        
        {/* Minimal Footer Content */}
        <div className="text-center mb-8">
          {/* Company Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/assets/achtergrond-removebg-preview.png" 
              alt="TableTech Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-bold text-white">TableTech</span>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+31853030723" className="hover:text-white transition-colors duration-300">
                +31 85 303 07 23
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@tabletech.nl" className="hover:text-white transition-colors duration-300">
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

      {/* Bottom fade for extra smoothness */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#2C1E1A]"></div>
    </footer>
  );
};