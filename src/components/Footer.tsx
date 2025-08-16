import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative bg-[#231813] text-[#FFD382] pt-0 pb-8 w-full overflow-hidden">
      {/* Volledig naadloze overgang - geen zichtbare scheiding */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Zeer subtiele gradient die niet interfereert met de overgang */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#231813] from-0% to-[#1A120E]/70 to-100%"></div>
        {/* Subtiele decoratieve gloed - geen grote blur */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFD382]/4 via-transparent to-[#E86C28]/3 opacity-40"></div>
        {/* Kleine, natuurlijke accent glows */}
        <div className="absolute top-16 right-16 w-32 h-32 bg-[#E86C28]/8 rounded-full blur-xl opacity-70"></div>
        <div className="absolute bottom-16 left-16 w-40 h-40 bg-[#FFD382]/6 rounded-full blur-2xl opacity-60"></div>
        {/* Extra kleine accenten voor warme uitstraling */}
        <div className="absolute top-32 left-1/3 w-24 h-24 bg-[#FFD382]/5 rounded-full blur-lg opacity-50"></div>
        <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-[#E86C28]/6 rounded-full blur-xl opacity-45"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 flex flex-col items-center pt-16">
        {/* Groot logo en slogan */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src="/logo4.svg" alt="TableTech logo" className="w-24 h-24 mb-2 drop-shadow-lg" />
          <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">TableTech</span>
          <span className="text-lg text-[#FFD382] font-medium italic drop-shadow-sm">De slimme oplossing voor elk restaurant</span>
        </div>

        {/* Contact & Socials */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-8">
          <div className="flex items-center gap-2 text-base">
            <Phone className="w-5 h-5 text-[#FFD382]" />
            <a href="tel:+31853030723" className="hover:text-white transition-colors duration-300 font-semibold">
              +31 85 303 07 23
            </a>
          </div>
          <div className="flex items-center gap-2 text-base">
            <Mail className="w-5 h-5 text-[#FFD382]" />
            <a href="mailto:info@tabletech.nl" className="hover:text-white transition-colors duration-300 font-semibold">
              info@tabletech.nl
            </a>
          </div>
          <div className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5 text-[#FFD382]" />
            <span className="font-semibold">Nederland</span>
          </div>
        </div>

        {/* Social media icons */}
        <div className="flex gap-6 mb-8">
          <a href="https://www.instagram.com/tabletech.nl" target="_blank" rel="noopener" aria-label="Instagram" className="hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-[#FFD382] hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="https://www.facebook.com/tabletech.nl" target="_blank" rel="noopener" aria-label="Facebook" className="hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-[#FFD382] hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="mailto:info@tabletech.nl" aria-label="Email" className="hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-[#FFD382] hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><polyline points="2,4 12,14 22,4"/></svg>
          </a>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#FFD382]/20 mb-4"></div>

        {/* Copyright en links */}
        <div className="text-center text-sm flex flex-col items-center gap-2">
          <p className="text-[#FFD382]/80">
            &copy; {currentYear} <span className="font-semibold text-white">TableTech</span>. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-4 mt-1">
            <a href="/privacy" className="underline hover:text-white transition-colors">Privacybeleid</a>
            <span className="text-[#FFD382]/40">|</span>
            <a href="/algemene-voorwaarden" className="underline hover:text-white transition-colors">Algemene voorwaarden</a>
          </div>
        </div>
      </div>

      {/* Subtiele fade onderkant */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#231813]/60"></div>
    </footer>
  );
};