import React from "react";
import optie4Bg from "../assets/afbeeldingen/optie4.png";

const SharedBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div 
      className="relative w-full h-full"
      style={{
        backgroundImage: `url(${optie4Bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'transparent !important',
        backgroundAttachment: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'fixed' : 'scroll', // Fixed on desktop only
      }}
    >
      {/* Content that scrolls normally over the background */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default SharedBackground;