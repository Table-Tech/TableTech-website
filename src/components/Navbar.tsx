import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">QRMenu</Link>
        <nav className={`md:flex space-x-6 ${open ? "" : "hidden"}`}>
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/features" className="hover:text-blue-600">Features</Link>
          <Link to="/pricing" className="hover:text-blue-600">Pricing</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
        </nav>
        <div className="flex items-center">
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden mr-4 focus:outline-none"
          >
            {/* Hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <Link
            to="/signup"
            className="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
