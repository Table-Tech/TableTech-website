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
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col space-y-4">
      {sections.map((id) => (
        <div
          key={id}
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            active === id
              ? "bg-[#7b4f35] border-[#7b4f35] scale-125"
              : "bg-[#f5efe7]/60 border-[#b89b85]"
          }`}
          aria-label={`Section: ${id}`}
        />
      ))}
    </div>
  );
};
