// src/components/AiNetwork.tsx
import React from "react";
import Lottie from "lottie-react";
import AiChipAnimation from "../assets/animations/ai-chip-animation.json";

export const AiNetwork: React.FC = () => {
  return (
    <div className="relative w-48 h-48 z-20">
      <Lottie animationData={AiChipAnimation} loop autoplay className="w-full h-full" />
    </div>
  );
};
