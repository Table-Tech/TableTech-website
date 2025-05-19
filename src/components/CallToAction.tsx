import React, { useEffect, useRef, useState } from "react";

export const CallToAction: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
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

  return (
    <section id="cta" className="bg-[#2C1E1A] text-white py-16 px-4 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 flex justify-center">
        <div
          ref={ref}
          className={`bg-[#3A2B24]/90 backdrop-blur-sm border border-[#4A372E] rounded-3xl shadow-xl p-8 transform transition-all duration-1000 ease-out w-full max-w-4xl text-center ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Klaar om jouw restaurant te digitaliseren?
          </h2>
          <button
            onClick={() => alert("Proefperiode gestart!")}
            className="bg-[#E86C28] hover:bg-[#C3561D] hover:scale-105 hover:shadow-lg transition-all duration-300 text-white px-8 py-3 rounded-full text-lg font-semibold"
          >
            Start gratis proefperiode
          </button>
        </div>
      </div>
    </section>
  );
};
