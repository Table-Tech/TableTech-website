// src/components/Footer.tsx
import { Link } from "react-router-dom";

export const Footer: React.FC = () => (
  <footer
    id="footer"
    className="bg-transparent pt-4 pb-6 transition-all"
  >
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
      <p className="text-center md:text-left">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-800">TableTech</span>. Alle rechten voorbehouden.
      </p>
      <div className="flex space-x-6 mt-4 md:mt-0 justify-center md:justify-end">
        <Link
          to="/about"
          className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
        >
          Over ons
        </Link>
        <Link
          to="/contact"
          className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
        >
          Contact
        </Link>
        <Link
          to="/privacy"
          className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
        >
          Privacybeleid
        </Link>
      </div>
    </div>
  </footer>
);
