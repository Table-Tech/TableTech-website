import React from "react";

export interface ContainerScrollTitleProps {
  isInView?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ContainerScrollTitle: React.FC<ContainerScrollTitleProps> = ({
  isInView = true,
  style = {},
  children
}) => {
  return (
    <div
      className="text-center max-w-6xl mx-auto px-4 transition-all duration-1000 ease-out"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(-40px)',
        ...style,
      }}
    >
      <div
        className="relative"
        style={{
          textShadow: `
            0 2px 8px rgba(0, 0, 0, 0.7),
            0 4px 16px rgba(139, 69, 19, 0.3),
            0 6px 24px rgba(210, 105, 30, 0.2)
          `,
        }}
      >
        {children}
        
        {/* Subtle text glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, 
              rgba(210, 105, 30, 0.3) 0%, 
              transparent 70%)`,
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};