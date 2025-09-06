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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const updateVideoTime = (clientX: number, rect: DOMRect) => {
    if (videoRef.current) {
      const clickX = clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(1, clickX / width));
      const clickedTime = percentage * videoRef.current.duration;
      videoRef.current.currentTime = clickedTime;
      setProgress(percentage * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateVideoTime(e.clientX, rect);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    updateVideoTime(e.clientX, rect);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const progressBar = document.querySelector('.video-progress-bar') as HTMLElement;
      if (progressBar) {
        const rect = progressBar.getBoundingClientRect();
        updateVideoTime(e.clientX, rect);
      }
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

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
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
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
          
          {/* Video Progress Bar */}
          <div className={`absolute bottom-4 left-4 right-4 transition-opacity duration-300 ${showControls || isDragging ? 'opacity-100' : 'opacity-0'}`}>
            {/* Larger clickable/draggable area */}
            <div 
              className="video-progress-bar relative w-full h-6 flex items-center cursor-pointer group"
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
            >
              {/* Visual progress bar */}
              <div className="relative w-full h-1.5 bg-black/50 rounded-full backdrop-blur-sm">
                {/* Progress fill */}
                <div 
                  className="h-full bg-white/90 rounded-full transition-all duration-200"
                  style={{ 
                    width: `${progress}%`,
                    transition: isDragging ? 'none' : 'width 0.2s ease'
                  }}
                />
              </div>
              {/* Draggable thumb */}
              <div 
                className={`absolute w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-200 ${
                  isDragging ? 'scale-125' : 'scale-100 group-hover:scale-110'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ 
                  left: `calc(${progress}% - 8px)`,
                  opacity: showControls || isDragging ? 1 : 0,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
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