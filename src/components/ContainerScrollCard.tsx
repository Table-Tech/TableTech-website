import React, { useMemo } from "react";

export interface ContainerScrollCardProps {
  rotate: number;
  scale: number;
  isInView?: boolean;
  children?: React.ReactNode;
}

export const ContainerScrollCard: React.FC<ContainerScrollCardProps> = ({ 
  rotate, 
  scale,
  isInView = true,
  children 
}) => {
  // Enhanced shadow calculation based on rotation and scale
  const dynamicShadow = useMemo(() => {
    const intensity = Math.max(0.3, Math.min(1, scale));
    const rotationShadow = Math.abs(rotate) * 0.02;
    
    return `
      0 0 rgba(0, 0, 0, ${0.3 * intensity}),
      0 ${9 + rotationShadow}px ${20 + rotationShadow}px rgba(0, 0, 0, ${0.29 * intensity}),
      0 ${37 + rotationShadow * 2}px ${37 + rotationShadow * 2}px rgba(0, 0, 0, ${0.26 * intensity}),
      0 ${84 + rotationShadow * 3}px ${50 + rotationShadow * 2}px rgba(0, 0, 0, ${0.15 * intensity}),
      0 ${149 + rotationShadow * 4}px ${60 + rotationShadow * 3}px rgba(0, 0, 0, ${0.04 * intensity}),
      0 ${233 + rotationShadow * 5}px ${65 + rotationShadow * 3}px rgba(0, 0, 0, ${0.01 * intensity})
    `;
  }, [rotate, scale]);

  return (
    <div
      style={{
        transform: `rotateX(${rotate}deg) scale(${scale})`,
        boxShadow: dynamicShadow,
        opacity: isInView ? 1 : 0.8,
        transition: 'opacity 0.3s ease-out',
      }}
      className="mx-auto -mt-12 h-[26rem] w-full max-w-4xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[36rem] md:max-w-4xl md:p-6 transform-gpu will-change-transform"
    >
      <div className="size-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 md:rounded-2xl md:p-4">
        <div className="size-full rounded-2xl overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
          {/* Enhanced background with better visual hierarchy */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />
          
          {/* Dashboard preview image */}
          <img 
            src="/aap.webp" 
            alt="TableTech Dashboard Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          
          {/* Screen overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
          
          {/* Optional content overlay */}
          {children && (
            <div className="relative z-10 size-full flex items-center justify-center p-4">
              {children}
            </div>
          )}
          
          {/* Subtle inner border for depth */}
          <div className="absolute inset-2 rounded-xl border border-white/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};