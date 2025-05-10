// src/components/ScrollDots.tsx
import React, { useEffect, useState } from "react";

const sections = ["hero", "benefits", "dashboard", "cta"];

export const ScrollDots: React.FC = () => {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            setActive(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col space-y-4">
      {sections.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            active === id
              ? "bg-blue-600 border-blue-600 scale-125"
              : "bg-white/60 border-gray-400"
          }`}
          aria-label={`Ga naar ${id}`}
        />
      ))}
    </div>
  );
};
