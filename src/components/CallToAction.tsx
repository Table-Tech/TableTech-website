// src/components/CallToAction.tsx
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
    <section
      id="cta"
      className="relative py-12 px-2 text-center"
    >
      <div className="container mx-auto max-w-3xl">
        <div
          ref={ref}
          className={`bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl p-8 inline-block transform transition-all duration-1000 ease-out ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
            Klaar om jouw restaurant te digitaliseren?
          </h2>
          <button
            onClick={() => alert("Proefperiode gestart!")}
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 text-white px-6 py-2 rounded-full text-base font-medium"
          >
            Start gratis proefperiode
          </button>
        </div>
      </div>
    </section>
  );
};
