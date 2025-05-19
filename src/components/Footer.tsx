import { Link } from "react-router-dom";

export const Footer: React.FC = () => (
  <footer id="footer" className="bg-[#2C1E1A] text-[#FFD382] py-12 w-full">
    <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="text-2xl font-bold text-white">TableTech</span>
          <p className="mt-4">📞 +31 85 303 07 23</p>
          <p>✉️ info@tabletech.nl</p>
          <p>📍 Nederland</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Info</h3>
          <ul className="space-y-2">
            <li><Link to="/integraties" className="hover:text-white transition">Integraties</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition">Prijzen</Link></li>
            <li><Link to="/demo" className="hover:text-white transition">Demo</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Type horeca</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-white transition">Cafés</Link></li>
            <li><Link to="#" className="hover:text-white transition">Hotels</Link></li>
            <li><Link to="#" className="hover:text-white transition">Restaurants</Link></li>
            <li><Link to="#" className="hover:text-white transition">Festivals</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Bedrijf</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white transition">Over ons</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Privacybeleid</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-[#3B2A1D] flex flex-col md:flex-row justify-between items-center text-sm text-[#FFD382]">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold text-white">TableTech</span>. Alle rechten voorbehouden.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link to="/voorwaarden" className="hover:text-white transition">Algemene voorwaarden</Link>
          <Link to="/cookies" className="hover:text-white transition">Cookies</Link>
        </div>
      </div>
    </div>
  </footer>
);
