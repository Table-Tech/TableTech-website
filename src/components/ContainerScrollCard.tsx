import React, { useMemo, useRef, useState } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
      className="mx-auto -mt-12 h-[325px] w-full max-w-4xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[485px] md:max-w-4xl md:p-6 transform-gpu will-change-transform"
    >
      <div className="size-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 md:rounded-2xl">
        <div 
          className="size-full rounded-2xl overflow-hidden relative bg-gradient-to-br from-gray-900 to-black group cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={togglePlay}
        >
          {/* Dashboard preview video - fits entire container */}
          <video 
            ref={videoRef}
            src="/videos/kitchen-side-demo.mp4"
            className="absolute inset-0 w-full h-full object-contain opacity-90 rounded-2xl"
            loop
            muted
            playsInline
          />
          
          {/* Play/Pause Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-4 transition-all duration-200 hover:scale-110"
            >
              {isPlaying ? (
                // Pause Icon
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                // Play Icon
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
          
          {/* Screen overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          
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