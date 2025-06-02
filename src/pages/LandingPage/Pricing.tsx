import React, { useEffect, useRef, useState } from "react";
import planten2 from "../../assets/afbeeldingen/optie9.png";

const pricingData = [
  ["Tablet inbegrepen", "❌ Huur €12/m", "✔ 1 tablet", "✔ 1+ tablets"],
  ["Dashboard & bestellingen", "✔", "✔", "✔"],
  ["QR-menu met logo", "✔", "✔", "✔"],
  ["Online betalingen", "✔", "✔", "✔"],
  ["Onbeperkt aantal tafels", "✔", "✔", "✔"],
  ["Kassa-integratie", "✔", "✔", "✔"],
  ["Printer-integratie", "✔", "✔", "✔"],
  ["Afhaal & bezorgopties", "✔", "✔", "✔"],
  ["Analytics & rapporten", "❌", "✔", "✔ geavanceerd"],
  ["Exportmogelijkheden", "❌", "✔", "✔"],
  ["Meerdere gebruikers", "❌", "✔", "✔"],
  ["Upsell/Cross-sell", "❌", "❌", "✔"],
  ["Volledige branding", "❌", "❌", "✔ (kleur, logo, stijl)"],
  ["Prioriteit support", "❌", "❌", "✔ 24/7"],
  ["Installatie op locatie", "❌", "❌", "✔ inbegrepen"],
  ["Extra vestiging", "€45/m", "€35/m", "Op maat"],
  ["Proefperiode", "14 dagen", "14 dagen", "14 dagen"],
];

export const PricingSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Handle scroll behavior for table
  useEffect(() => {
    const tableElement = tableRef.current;
    if (!tableElement) return;

    let isMouseOver = false;

    const handleMouseEnter = () => {
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isMouseOver) return;
      
      // Always prevent page scroll when mouse is over table
      e.preventDefault();
      e.stopPropagation();
      
      // Scroll the table manually
      tableElement.scrollTop += e.deltaY * 0.5; // Smooth scrolling
    };

    // Add event listeners
    tableElement.addEventListener('mouseenter', handleMouseEnter);
    tableElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      tableElement.removeEventListener('mouseenter', handleMouseEnter);
      tableElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section
      id="pricing"
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat py-20"
      style={{ backgroundImage: `url(${planten2})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#2C1E1A]/30 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 flex justify-end">
        <div
          ref={ref}
          className={`max-w-4xl bg-white/90 backdrop-blur-md border border-[#E8D8CE] rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all duration-1000 ease-out ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-[#3B2A1D]">
            Vergelijk onze abonnementen
          </h2>
          <p className="text-center text-[#5A4235] mb-8 text-sm">
            Kies het pakket dat perfect bij jouw restaurant past.
          </p>

          <div className="relative">
            {/* Scrollable table container with custom scrollbar */}
            <div 
              ref={tableRef}
              className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#A77B5D] scrollbar-track-[#E8D8CE] pr-2 focus:outline-none hover:bg-white/95 transition-colors duration-200"
              tabIndex={0}
            >
              <table className="w-full border border-[#cbb6a0] border-collapse text-[#2C1E1A] bg-white/90 rounded-lg overflow-hidden">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#A77B5D] text-white font-semibold border-b border-[#d5c8bb]">
                    <th className="p-3 border-r border-[#d5c8bb] text-left text-sm">Functie</th>
                    <th className="p-3 border-r border-[#d5c8bb] text-center text-sm">
                      Starter<br />
                      <span className="text-xs font-normal">€65/m</span>
                    </th>
                    <th className="p-3 border-r border-[#d5c8bb] text-center text-sm">
                      Standaard<br />
                      <span className="text-xs font-normal">€70/m</span>
                    </th>
                    <th className="p-3 text-center text-sm">
                      Professional<br />
                      <span className="text-xs font-normal">€85/m</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map(([feature, starter, standard, pro], i) => (
                    <tr key={i} className="border-b border-[#d5c8bb] hover:bg-[#f8f5f2] transition-colors duration-200">
                      <td className="p-3 border-r border-[#d5c8bb] text-left font-medium text-sm">{feature}</td>
                      <td className="p-3 text-center border-r border-[#d5c8bb] text-sm">{starter}</td>
                      <td className="p-3 text-center border-r border-[#d5c8bb] text-sm">{standard}</td>
                      <td className="p-3 text-center text-sm">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/90 to-transparent pointer-events-none rounded-b-lg"></div>
          </div>

          {/* Call to action buttons */}
          <div className="mt-6 flex justify-center">
            <button className="bg-[#7b4f35] hover:bg-[#5e3b29] hover:scale-105 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform active:scale-95 shadow-lg text-sm">
              Start gratis proefperiode
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};