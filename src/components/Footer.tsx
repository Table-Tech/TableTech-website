import { Link } from "react-router-dom";

export const Footer: React.FC = () => (
  <footer className="bg-white border-t">
    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row
                    items-center justify-between">
      <p className="text-gray-600">&copy; {new Date().getFullYear()} QRMenu</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
        <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        <Link to="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link>
      </div>
    </div>
  </footer>
);
