import React from "react";

export const VerticalLightStream: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[6px] z-40 pointer-events-none hidden md:block">
      <div className="relative w-full h-full">
        {/* Glowing animated line */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent opacity-80 blur-[1px] animate-move-down rounded-full" />

        {/* Extra glow layer */}
        <div className="absolute inset-0 w-full bg-blue-400 opacity-40 blur-[6px] animate-pulse rounded-full" />
      </div>
    </div>
  );
};
