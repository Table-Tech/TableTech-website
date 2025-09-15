import React, { useMemo } from "react";

export interface ContainerScrollTitleProps {
  translate: number;
  children?: React.ReactNode;
}

export const ContainerScrollTitle: React.FC<ContainerScrollTitleProps> = ({
  translate,
  children
}) => {
  // Calculate additional effects based on translate value
  const effects = useMemo(() => {
    const progress = Math.abs(translate) / 120; // Normalize based on max translate
    const opacity = Math.max(0.3, 1 - progress * 0.7); // Fade out as it moves up
    const scale = Math.max(0.9, 1 - progress * 0.1); // Slight scale down
    
    return { opacity, scale };
  }, [translate]);

  return (
    <div
      className="mx-auto max-w-5xl text-center transform-gpu will-change-transform"
      style={{
        transform: `translateY(${translate}px) scale(${effects.scale})`,
        opacity: effects.opacity,
      }}
    >
      {children}
    </div>
  );
};