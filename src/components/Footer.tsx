// src/components/Footer.tsx
import { Link } from "react-router-dom";

export const Footer: React.FC = () => (
  <footer className="relative z-10 bg-cyan-50 backdrop-blur-md border-t border-white/30">
    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
      <p>
        &copy; {new Date().getFullYear()} TableTech. Alle rechten voorbehouden.
      </p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <Link to="/about" className="hover:text-blue-600 transition">
          Over ons
        </Link>
        <Link to="/contact" className="hover:text-blue-600 transition">
          Contact
        </Link>
        <Link to="/privacy" className="hover:text-blue-600 transition">
          Privacybeleid
        </Link>
      </div>
    </div>
  </footer>
);
