import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      id="footer" 
      className="relative text-[#FFD382] pt-0 pb-8 w-full overflow-hidden border-0 shadow-none" 
      style={{
        border: 'none', 
        borderTop: 'none', 
        boxShadow: 'none',
        background: 'linear-gradient(180deg, #231813 0%, #1f140f 50%, #1a110d 100%)'
      }}
    >
      {/* Ambient lighting and accent effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient top lighting effect */}
        <div 
          className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-[600px] h-48 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(237, 125, 49, 0.1) 0%, transparent 70%)'
          }}
        ></div>
        
        {/* Enhanced accent glows with subtle animation */}
        <div className="absolute top-16 right-16 w-32 h-32 bg-[#E86C28]/6 rounded-full blur-xl opacity-60 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-16 left-16 w-40 h-40 bg-[#FFD382]/5 rounded-full blur-2xl opacity-50 animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-32 left-1/3 w-24 h-24 bg-[#FFD382]/4 rounded-full blur-lg opacity-40 animate-pulse" style={{animationDuration: '5s'}}></div>
        <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-[#E86C28]/5 rounded-full blur-xl opacity-50 animate-pulse" style={{animationDuration: '7s'}}></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 flex flex-col items-center pt-4 sm:pt-6 lg:pt-8">
        {/* Groot logo en slogan met enhanced effecten */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img 
            src="/logo4.svg" 
            alt="TableTech logo" 
            className="w-24 h-24 mb-2 transition-all duration-300 hover:scale-110" 
            style={{
              filter: 'drop-shadow(0 0 20px rgba(237, 125, 49, 0.3))',
              transition: 'filter 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(237, 125, 49, 0.5))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(237, 125, 49, 0.3))';
            }}
            loading="lazy" 
            decoding="async" 
          />
          <span 
            className="text-3xl font-extrabold text-white tracking-wide transition-all duration-300 hover:text-[#FFD382]"
            style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 15px rgba(237, 125, 49, 0.2)'}}
          >
            TableTech
          </span>
          <span 
            className="text-lg text-[#FFD382] font-medium italic"
            style={{textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)'}}
          >
            De slimme oplossing voor elk restaurant
          </span>
        </div>

        {/* Contact & Socials met enhanced effecten */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-8">
          <div className="flex items-center gap-2 text-base group">
            <Phone className="w-5 h-5 text-[#FFD382] group-hover:text-[#E86C28] transition-colors duration-300" />
            <a 
              href="tel:+31853030723" 
              className="hover:text-white transition-all duration-300 font-semibold hover:scale-105"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              +31 85 303 07 23
            </a>
          </div>
          <div className="flex items-center gap-2 text-base group">
            <Mail className="w-5 h-5 text-[#FFD382] group-hover:text-[#E86C28] transition-colors duration-300" />
            <a 
              href="mailto:info@tabletech.nl" 
              className="hover:text-white transition-all duration-300 font-semibold hover:scale-105"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              info@tabletech.nl
            </a>
          </div>
          <div className="flex items-center gap-2 text-base group">
            <MapPin className="w-5 h-5 text-[#FFD382] group-hover:text-[#E86C28] transition-colors duration-300" />
            <span 
              className="font-semibold group-hover:text-white transition-colors duration-300"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
            >
              Nederland
            </span>
          </div>
        </div>

        {/* Social media icons met enhanced glow effecten */}
        <div className="flex gap-6 mb-8">
          <a 
            href="https://www.instagram.com/tabletech.nl" 
            target="_blank" 
            rel="noopener" 
            aria-label="Instagram" 
            className="text-[#E86C28] hover:scale-110 transition-all duration-300 hover:text-[#ff9347]"
            style={{
              filter: 'drop-shadow(0 0 5px rgba(237, 125, 49, 0.3))',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(237, 125, 49, 0.6))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 5px rgba(237, 125, 49, 0.3))';
            }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a 
            href="https://www.facebook.com/tabletech.nl" 
            target="_blank" 
            rel="noopener" 
            aria-label="Facebook" 
            className="text-[#E86C28] hover:scale-110 transition-all duration-300 hover:text-[#ff9347]"
            style={{
              filter: 'drop-shadow(0 0 5px rgba(237, 125, 49, 0.3))',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(237, 125, 49, 0.6))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 5px rgba(237, 125, 49, 0.3))';
            }}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a 
            href="mailto:info@tabletech.nl" 
            aria-label="Email" 
            className="text-[#E86C28] hover:scale-110 transition-all duration-300 hover:text-[#ff9347]"
            style={{
              filter: 'drop-shadow(0 0 5px rgba(237, 125, 49, 0.3))',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(237, 125, 49, 0.6))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 5px rgba(237, 125, 49, 0.3))';
            }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><polyline points="2,4 12,14 22,4"/></svg>
          </a>
        </div>

        {/* Removed visual divider for seamless flow */}
        <div className="mb-4"></div>

        {/* Copyright en links met enhanced effecten */}
        <div className="text-center text-sm flex flex-col items-center gap-2">
          <p 
            className="text-[#FFD382]/80"
            style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
          >
            &copy; {currentYear} <span 
              className="font-semibold text-white hover:text-[#FFD382] transition-colors duration-300"
              style={{textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5), 0 0 10px rgba(237, 125, 49, 0.2)'}}
            >
              TableTech
            </span>. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6 mt-1">
            <a 
              href="/privacy" 
              className="underline hover:text-white transition-all duration-300 hover:scale-105 hover:text-[#E86C28]"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              Privacybeleid
            </a>
            <a 
              href="/algemene-voorwaarden" 
              className="underline hover:text-white transition-all duration-300 hover:scale-105 hover:text-[#E86C28]"
              style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4), 0 0 8px rgba(237, 125, 49, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.4)';
              }}
            >
              Algemene voorwaarden
            </a>
          </div>
        </div>
      </div>

      {/* Removed bottom fade for cleaner finish */}
    </footer>
  );
};