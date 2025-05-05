// src/components/ScrollProgressBar.tsx ****************** we gebruiken dit niet heb uit app.tsx gezet  we kunnen altijd nog gebruiken 
import { useEffect, useState } from "react";

export const ScrollProgressBar: React.FC = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scroll = (window.scrollY / totalHeight) * 100;
    setScrollWidth(scroll);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
      <div
        className="bg-blue-600 h-full transition-all duration-150 ease-out"
        style={{ width: `${scrollWidth}%` }}
      />
    </div>
  );
};
