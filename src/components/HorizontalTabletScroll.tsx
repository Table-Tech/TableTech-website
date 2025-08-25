import React, { useRef, useEffect, useState } from "react";

interface HorizontalTabletScrollProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

const HorizontalTabletScroll: React.FC<HorizontalTabletScrollProps> = ({ 
  title, 
  subtitle,
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Check if section is in view
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      // Section is visible when it overlaps with viewport
      const inView = sectionTop < windowHeight && sectionBottom > 0;
      setIsInView(inView);
      
      // Enhanced scroll progress calculation
      if (sectionBottom > 0 && sectionTop < windowHeight) {
        // Calculate progress based on section visibility
        const scrollableDistance = sectionHeight + windowHeight;
        const scrolled = windowHeight - sectionTop;
        
        // Tablet becomes fully visible when scrolled 50% through section
        const progress = Math.max(0, Math.min(1, scrolled / (scrollableDistance * 0.6)));
        
        // Apply smooth easing
        const easedProgress = easeInOutQuart(progress);
        setScrollProgress(easedProgress);
      } else {
        setScrollProgress(0);
      }
    };

    // Throttled scroll handling for performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, []);

  // Enhanced smooth easing function
  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  // Enhanced 3D transform values for horizontal tablet
  const rotateX = 50 * (1 - scrollProgress); // Stronger initial tilt
  const rotateY = -20 * (1 - scrollProgress); // More dramatic horizontal rotation
  const rotateZ = 8 * (1 - scrollProgress); // Z-axis rotation for realism
  const scale = 0.3 + (0.7 * scrollProgress); // Scale from 30% to 100%
  const translateY = 800 * (1 - scrollProgress); // Rise from much lower
  const translateZ = -1000 * (1 - scrollProgress); // Dramatic 3D approach
  const opacity = Math.min(1, scrollProgress * 2.5); // Faster fade in

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[200vh] overflow-hidden py-20"
      style={{
        // Enhanced brown gradient background
        background: `linear-gradient(180deg, 
          #4a2c17 0%, 
          #3d2314 15%,
          #2f1a0f 30%,
          #24140b 45%,
          #1a0e08 60%,
          #120906 75%,
          #0a0504 90%,
          #000000 100%)`
      }}
    >
      {/* Enhanced ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 69, 19, 0.25) 0%, rgba(101, 67, 33, 0.15) 40%, transparent 70%)',
            filter: 'blur(100px)',
            transform: `translate(${scrollProgress * 80}px, ${scrollProgress * 50}px) scale(${1 + scrollProgress * 0.4})`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(160, 82, 45, 0.2) 0%, rgba(139, 69, 19, 0.1) 50%, transparent 70%)',
            filter: 'blur(120px)',
            transform: `translate(-${scrollProgress * 90}px, -${scrollProgress * 60}px) scale(${1 + scrollProgress * 0.5})`,
          }}
        />
        
        {/* Central brown ambient glow */}
        <div 
          className="absolute top-1/2 left-1/2 w-[1000px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(101, 67, 33, 0.15) 0%, rgba(139, 69, 19, 0.08) 30%, transparent 70%)',
            filter: 'blur(150px)',
            transform: `translate(-50%, -50%) rotate(${scrollProgress * 30}deg) scale(${1 + scrollProgress * 0.3})`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Text Content - Above the tablet */}
        <div 
          className="text-center mb-24 transform transition-all duration-1000"
          style={{
            opacity: isInView ? Math.max(0.2, 1 - scrollProgress * 0.8) : 0,
            transform: `translateY(${isInView ? scrollProgress * -40 : -50}px)`,
          }}
        >
          {title && (
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
              style={{
                textShadow: `
                  0 3px 12px rgba(0, 0, 0, 0.8),
                  0 6px 24px rgba(139, 69, 19, 0.4),
                  0 8px 32px rgba(210, 105, 30, 0.3)
                `,
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p 
              className="text-xl md:text-2xl text-amber-100/90 max-w-4xl mx-auto leading-relaxed"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Enhanced 3D Tablet Container */}
        <div 
          className="relative mx-auto"
          style={{
            perspective: '3500px',
            perspectiveOrigin: '50% 50%',
            height: '80vh',
            minHeight: '600px',
          }}
        >
          {/* Horizontal Tablet with Enhanced 3D Effects */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                rotateZ(${rotateZ}deg)
                translateY(${translateY}px) 
                translateZ(${translateZ}px) 
                scale(${scale})
              `,
              transformStyle: 'preserve-3d',
              opacity: opacity,
              transition: 'none',
              willChange: 'transform, opacity',
            }}
          >
            {/* Enhanced Dynamic Shadow */}
            <div 
              className="absolute -bottom-32 left-1/2 transform -translate-x-1/2"
              style={{
                width: '140%',
                height: '120px',
                background: `radial-gradient(ellipse, 
                  rgba(0,0,0,${0.8 * opacity}) 0%, 
                  rgba(139, 69, 19, ${0.3 * opacity}) 30%,
                  rgba(101, 67, 33, ${0.1 * opacity}) 50%,
                  transparent 80%)`,
                filter: 'blur(50px)',
                transform: `scaleX(${2 - scale * 0.5}) scaleY(${0.5 + scale * 0.3}) translateZ(-200px)`,
                transformStyle: 'preserve-3d',
              }}
            />

            {/* Tablet Frame - Enhanced Horizontal Design */}
            <div 
              className="relative"
              style={{
                width: '1200px',
                maxWidth: '95vw',
                aspectRatio: '16/10',
              }}
            >
              {/* Enhanced Outer Frame */}
              <div 
                className="relative w-full h-full rounded-[3rem] p-5"
                style={{
                  background: `linear-gradient(145deg, 
                    rgba(70, 70, 70, ${opacity}) 0%, 
                    rgba(50, 50, 50, ${opacity}) 25%,
                    rgba(35, 35, 35, ${opacity}) 50%,
                    rgba(25, 25, 25, ${opacity}) 75%,
                    rgba(15, 15, 15, ${opacity}) 100%)`,
                  boxShadow: `
                    0 ${70 * scale}px ${140 * scale}px -30px rgba(0, 0, 0, ${0.9 * opacity}),
                    0 ${40 * scale}px ${80 * scale}px -40px rgba(0, 0, 0, ${0.8 * opacity}),
                    0 ${20 * scale}px ${40 * scale}px -20px rgba(139, 69, 19, ${0.4 * opacity}),
                    inset 0 3px 8px rgba(255, 255, 255, ${0.12 * opacity}),
                    inset 0 -3px 8px rgba(0, 0, 0, ${0.9 * opacity})
                  `,
                  border: `2px solid rgba(255, 255, 255, ${0.15 * opacity})`,
                }}
              >
                {/* Enhanced Screen Bezel */}
                <div 
                  className="relative w-full h-full rounded-[2.5rem] p-4"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(35, 35, 35, ${opacity}) 0%, 
                      rgba(20, 20, 20, ${opacity}) 50%,
                      rgba(10, 10, 10, ${opacity}) 100%)`,
                    boxShadow: `
                      inset 0 4px 16px rgba(0, 0, 0, ${0.95 * opacity}),
                      inset 0 -2px 6px rgba(255, 255, 255, ${0.08 * opacity})
                    `,
                  }}
                >
                  {/* Enhanced Screen with aap.png */}
                  <div 
                    className="relative w-full h-full rounded-[2.2rem] overflow-hidden"
                    style={{
                      backgroundImage: 'url(/aap.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: `
                        inset 0 0 40px rgba(0, 0, 0, ${0.5 * opacity}),
                        inset 0 3px 12px rgba(0, 0, 0, ${0.7 * opacity}),
                        0 0 30px rgba(210, 105, 30, ${0.1 * opacity})
                      `,
                    }}
                  >
                    {/* Enhanced screen overlay */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, 
                          rgba(255,255,255,${0.03 * opacity}) 0%, 
                          transparent 25%,
                          transparent 75%,
                          rgba(0,0,0,${0.08 * opacity}) 100%)`,
                        backdropFilter: 'blur(0.3px)',
                      }}
                    />

                    {/* Enhanced Multi-layer Screen Reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(${130 + rotateY * 3}deg, 
                          transparent 15%, 
                          rgba(255,255,255,${0.08 * opacity}) 30%, 
                          rgba(255,255,255,${0.15 * opacity}) 40%, 
                          rgba(255,255,255,${0.25 * opacity}) 47%, 
                          rgba(255,255,255,${0.35 * opacity}) 50%, 
                          rgba(255,255,255,${0.25 * opacity}) 53%, 
                          rgba(255,255,255,${0.15 * opacity}) 60%, 
                          rgba(255,255,255,${0.08 * opacity}) 70%, 
                          transparent 85%)`,
                        transform: `translateZ(15px) translateX(${-rotateY * 4}px) translateY(${-rotateX * 3}px)`,
                        transformStyle: 'preserve-3d',
                        opacity: 0.6,
                      }}
                    />

                    {/* Dynamic ambient lighting */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(
                          ellipse at ${50 - rotateY * 3}% ${25 - rotateX * 0.8}%, 
                          rgba(255,255,255,${0.5 * opacity}) 0%, 
                          rgba(255,255,255,${0.2 * opacity}) 20%,
                          rgba(210,105,30,${0.1 * opacity}) 40%,
                          transparent 80%
                        )`,
                        opacity: 0.4,
                      }}
                    />

                    {/* Screen glare effect */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1/2 pointer-events-none"
                      style={{
                        background: `linear-gradient(180deg, 
                          rgba(255,255,255,${0.15 * opacity}) 0%, 
                          rgba(255,255,255,${0.05 * opacity}) 30%,
                          transparent 100%)`,
                        opacity: 0.7,
                      }}
                    />

                    {/* Content container */}
                    <div 
                      className="relative z-20 p-10 h-full flex items-center justify-center"
                      style={{
                        transform: 'translateZ(10px)',
                      }}
                    >
                      {children && (
                        <div 
                          className="w-full h-full"
                          style={{
                            opacity: opacity,
                            transform: 'translateZ(5px)',
                          }}
                        >
                          {children}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Hardware Details for Horizontal Layout */}
                
                {/* Power button */}
                <div 
                  className="absolute top-8 right-3 w-3 h-12 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, 
                      rgba(80, 80, 80, ${opacity}) 0%, 
                      rgba(50, 50, 50, ${opacity}) 50%,
                      rgba(35, 35, 35, ${opacity}) 100%)`,
                    boxShadow: `
                      inset 0 3px 6px rgba(0, 0, 0, ${0.9 * opacity}),
                      0 2px 4px rgba(255, 255, 255, ${0.1 * opacity})
                    `,
                    border: `1px solid rgba(255, 255, 255, ${0.05 * opacity})`,
                  }}
                />
                
                {/* Volume buttons */}
                <div 
                  className="absolute top-20 right-3 w-2 h-8 rounded-full mb-3"
                  style={{
                    background: `linear-gradient(180deg, 
                      rgba(70, 70, 70, ${opacity}) 0%, 
                      rgba(40, 40, 40, ${opacity}) 100%)`,
                    boxShadow: `inset 0 2px 4px rgba(0, 0, 0, ${0.9 * opacity})`,
                  }}
                />
                <div 
                  className="absolute top-32 right-3 w-2 h-8 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, 
                      rgba(70, 70, 70, ${opacity}) 0%, 
                      rgba(40, 40, 40, ${opacity}) 100%)`,
                    boxShadow: `inset 0 2px 4px rgba(0, 0, 0, ${0.9 * opacity})`,
                  }}
                />

                {/* Enhanced Home button */}
                <div 
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full"
                  style={{
                    background: `linear-gradient(145deg, 
                      rgba(60, 60, 60, ${opacity}) 0%, 
                      rgba(35, 35, 35, ${opacity}) 50%,
                      rgba(20, 20, 20, ${opacity}) 100%)`,
                    boxShadow: `
                      inset 0 3px 6px rgba(0, 0, 0, ${0.9 * opacity}),
                      inset 0 -1px 3px rgba(255, 255, 255, ${0.1 * opacity}),
                      0 2px 6px rgba(255, 255, 255, ${0.08 * opacity})
                    `,
                    border: `2px solid rgba(255, 255, 255, ${0.12 * opacity})`,
                  }}
                >
                  {/* Home button inner circle */}
                  <div 
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: `linear-gradient(145deg, 
                        rgba(25, 25, 25, ${opacity}) 0%, 
                        rgba(15, 15, 15, ${opacity}) 100%)`,
                      boxShadow: `inset 0 1px 3px rgba(0, 0, 0, ${0.8 * opacity})`,
                    }}
                  />
                </div>
                
                {/* Enhanced Speaker grilles */}
                <div className="absolute bottom-8 left-12 flex space-x-2">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: `rgba(100, 100, 100, ${opacity})`,
                        boxShadow: `
                          inset 0 1px 2px rgba(0, 0, 0, ${0.9 * opacity}),
                          0 0.5px 1px rgba(255, 255, 255, ${0.05 * opacity})
                        `,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-8 right-12 flex space-x-2">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: `rgba(100, 100, 100, ${opacity})`,
                        boxShadow: `
                          inset 0 1px 2px rgba(0, 0, 0, ${0.9 * opacity}),
                          0 0.5px 1px rgba(255, 255, 255, ${0.05 * opacity})
                        `,
                      }}
                    />
                  ))}
                </div>

                {/* Enhanced frame highlights */}
                <div 
                  className="absolute bottom-0 left-1/4 right-1/4 h-1 opacity-50 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent, 
                      rgba(255,255,255,${0.4 * opacity}), 
                      rgba(210,105,30,${0.3 * opacity}), 
                      rgba(255,255,255,${0.4 * opacity}), 
                      transparent)`,
                  }}
                />
                
                <div 
                  className="absolute top-0 left-1/3 right-1/3 h-[3px] opacity-30 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent, 
                      rgba(255,255,255,${0.5 * opacity}), 
                      transparent)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 z-40"
          style={{
            bottom: '-80px',
            opacity: Math.max(0, 1 - scrollProgress * 4),
            transform: `translateX(-50%) translateY(${scrollProgress * 80}px) scale(${1 - scrollProgress * 0.3})`,
          }}
        >
          <div className="flex flex-col items-center text-amber-200/80">
            <span 
              className="text-sm mb-4 font-medium tracking-wide"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              Scroll to reveal the tablet
            </span>
            <div 
              className="w-7 h-12 border-2 rounded-full flex justify-center relative overflow-hidden"
              style={{
                borderColor: 'rgba(210, 105, 30, 0.7)',
                background: 'rgba(139, 69, 19, 0.15)',
                boxShadow: `
                  0 0 20px rgba(210, 105, 30, 0.3),
                  inset 0 2px 4px rgba(0, 0, 0, 0.5)
                `,
              }}
            >
              <div 
                className="w-2 h-4 rounded-full mt-2"
                style={{
                  background: `linear-gradient(180deg, 
                    #D2691E 0%, 
                    #CD853F 50%,
                    #8B4513 100%)`,
                  animation: 'smoothScrollBounce 3s infinite ease-in-out',
                  boxShadow: `
                    0 0 15px rgba(210, 105, 30, 0.6),
                    inset 0 1px 2px rgba(255, 255, 255, 0.3)
                  `,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style>{`
        @keyframes smoothScrollBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(16px) scale(0.8);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
};

export default HorizontalTabletScroll;