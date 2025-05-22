import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "../i18n";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-white backdrop-blur-sm transition">
      <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-wide text-white drop-shadow">
          TableTech
        </Link>

        <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
          <Link to="/" className="hover:text-[#ffe7c3] transition">{t("home")}</Link>
          <Link to="/features" className="hover:text-[#ffe7c3] transition">{t("features")}</Link>
          <Link to="/pricing" className="hover:text-[#ffe7c3] transition">{t("pricing")}</Link>
          <Link to="/about" className="hover:text-[#ffe7c3] transition">{t("about")}</Link>

          {/* ✅ Hier staat de taalkiezer links van de signup knop */}
          <LanguageSwitcher />

          <Link
            to="/signup"
            className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-5 py-2 rounded-full font-medium transition"
          >
            {t("signup")}
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden focus:outline-none" aria-label={open ? "Sluit menu" : "Open menu"}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#3a2a20]/80 backdrop-blur border-t border-white/10 shadow-xl px-6 py-4 transition-all duration-300 ease-in-out">
          <nav className="flex flex-col space-y-4 text-center text-sm text-white font-medium">
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">{t("home")}</Link>
            <Link to="/features" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">{t("features")}</Link>
            <Link to="/pricing" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">{t("pricing")}</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="hover:text-[#ffe7c3] transition">{t("about")}</Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="mt-4 bg-[#7b4f35] hover:bg-[#5e3b29] text-white px-5 py-2 rounded-full font-medium transition">
              {t("signup")}
            </Link>

            {/* ✅ Mobile taalwissel */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
