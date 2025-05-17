import React from "react";

export const VerticalLightStream: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[6px] z-40 pointer-events-none hidden md:block">
      <div className="relative w-full h-full">
        {/* Warm golden glow animated line */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e0b97e] via-[#d9a86c] to-transparent opacity-80 blur-[1px] animate-move-down rounded-full" />

        {/* Extra glow layer */}
        <div className="absolute inset-0 w-full bg-[#d9a86c] opacity-40 blur-[6px] animate-pulse rounded-full" />
      </div>
    </div>
  );
};
