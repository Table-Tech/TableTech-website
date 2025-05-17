import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-white backdrop-blur-sm transition">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-white drop-shadow">
          TableTech
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
          <Link to="/" className="hover:text-[#ffe7c3] transition">Home</Link>
          <Link to="/features" className="hover:text-[#ffe7c3] transition">Functies</Link>
          <Link to="/pricing" className="hover:text-[#ffe7c3] transition">Prijzen</Link>
          <Link to="/about" className="hover:text-[#ffe7c3] transition">Over ons</Link>
          <Link
            to="/signup"
            className="ml-4 bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-5 py-2 rounded-full font-medium transition"
          >
            Probeer gratis
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden focus:outline-none"
          aria-label={open ? "Sluit menu" : "Open menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-[#3a2a20]/80 backdrop-blur border-t border-white/10 shadow-xl px-6 py-4 transition-all">
          <nav className="flex flex-col space-y-4 text-center text-sm text-white font-medium">
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">Home</Link>
            <Link to="/features" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">Functies</Link>
            <Link to="/pricing" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">Prijzen</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">Over ons</Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="mt-4 bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-5 py-2 rounded-full font-medium transition"
            >
              Probeer gratis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
