import React from "react";

export interface ContainerScrollCardProps {
  rotate: number;
  rotateY?: number;
  rotateZ?: number;
  scale: number;
  translateY: number;
  translateZ: number;
  opacity?: number;
  isHorizontal?: boolean;
  children?: React.ReactNode;
}

export const ContainerScrollCard: React.FC<ContainerScrollCardProps> = ({ 
  rotate, 
  rotateY = 0,
  rotateZ = 0,
  scale, 
  translateY, 
  translateZ,
  opacity = 1,
  isHorizontal = true,
  children 
}) => {
  return (
    <div 
      className="relative mx-auto"
      style={{
        perspective: '3000px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          transform: `
            rotateX(${rotate}deg) 
            rotateY(${rotateY}deg) 
            rotateZ(${rotateZ}deg)
            translateY(${translateY}px) 
            translateZ(${translateZ}px) 
            scale(${scale})
          `,
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
          opacity: opacity,
          transition: 'none',
          maxWidth: isHorizontal ? '1400px' : '900px',
          width: '95%',
          margin: '0 auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* Enhanced dynamic shadow with brown tint */}
        <div 
          className="absolute -inset-24"
          style={{
            background: `radial-gradient(ellipse, 
              rgba(0, 0, 0, ${0.7 * opacity}) 0%, 
              rgba(232, 108, 40, ${0.3 * opacity}) 20%, 
              rgba(195, 86, 29, ${0.1 * opacity}) 40%, 
              transparent 70%)`,
            filter: 'blur(60px)',
            transform: `translateZ(-300px) scaleY(${0.3 + scale * 0.5}) scaleX(${1.2 + scale * 0.3})`,
            transformStyle: 'preserve-3d',
          }}
        />
        
        {/* Tablet frame with enhanced horizontal design */}
        <div 
          className="relative rounded-[2.5rem] p-4"
          style={{
            background: `linear-gradient(145deg, 
              rgba(60, 60, 60, ${opacity}) 0%, 
              rgba(40, 40, 40, ${opacity}) 30%,
              rgba(25, 25, 25, ${opacity}) 70%,
              rgba(15, 15, 15, ${opacity}) 100%)`,
            boxShadow: `
              0 ${60 * scale}px ${120 * scale}px -25px rgba(0, 0, 0, ${0.9 * opacity}),
              0 ${35 * scale}px ${70 * scale}px -35px rgba(0, 0, 0, ${0.8 * opacity}),
              0 ${15 * scale}px ${30 * scale}px -15px rgba(139, 69, 19, ${0.3 * opacity}),
              inset 0 2px 6px rgba(255, 255, 255, 0.1),
              inset 0 -2px 6px rgba(0, 0, 0, 0.8)
            `,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            aspectRatio: isHorizontal ? '16/10' : '4/5',
          }}
        >
          {/* Screen bezel with enhanced depth */}
          <div 
            className="relative w-full h-full rounded-[2rem] p-3"
            style={{
              background: `linear-gradient(135deg, 
                rgba(30, 30, 30, ${opacity}) 0%, 
                rgba(15, 15, 15, ${opacity}) 50%,
                rgba(8, 8, 8, ${opacity}) 100%)`,
              boxShadow: `
                inset 0 3px 12px rgba(0, 0, 0, ${0.9 * opacity}),
                inset 0 -1px 4px rgba(255, 255, 255, ${0.05 * opacity})
              `,
            }}
          >
            {/* Screen with aap.webp background */}
            <div 
              className="relative w-full h-full rounded-[1.7rem] overflow-hidden"
              style={{
                backgroundImage: 'url(/aap.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: `
                  inset 0 0 30px rgba(0, 0, 0, ${0.4 * opacity}),
                  inset 0 2px 8px rgba(0, 0, 0, ${0.6 * opacity})
                `,
              }}
            >
              {/* Screen overlay for better integration and brighter display */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, 
                    rgba(255,255,255,${0.08 * opacity}) 0%, 
                    rgba(255,255,255,${0.03 * opacity}) 30%,
                    rgba(255,255,255,${0.03 * opacity}) 70%,
                    rgba(0,0,0,${0.02 * opacity}) 100%)`,
                  backdropFilter: 'blur(0.2px)',
                  mixBlendMode: 'overlay',
                }}
              />
              
              {/* Enhanced screen reflection for realism */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `linear-gradient(${120 + rotateY * 2}deg, 
                    transparent 20%, 
                    rgba(255,255,255,0.1) 35%, 
                    rgba(255,255,255,0.25) 45%, 
                    rgba(255,255,255,0.3) 50%, 
                    rgba(255,255,255,0.25) 55%, 
                    rgba(255,255,255,0.1) 65%, 
                    transparent 80%)`,
                  transform: `translateZ(10px) translateX(${-rotateY * 3}px) translateY(${-rotate * 2}px)`,
                  transformStyle: 'preserve-3d',
                }}
              />
              
              {/* Dynamic ambient light based on rotation - enhanced brightness */}
              <div 
                className="absolute inset-0 opacity-35 pointer-events-none"
                style={{
                  background: `radial-gradient(
                    ellipse at ${50 - rotateY * 2}% ${30 - rotate * 0.5}%, 
                    rgba(255,255,255,0.6) 0%, 
                    rgba(255,255,255,0.2) 30%,
                    rgba(255,255,255,0.05) 60%,
                    transparent 80%
                  )`,
                  mixBlendMode: 'screen',
                }}
              />
              
              {/* Content container */}
              <div className="relative z-10 p-8 h-full flex items-center justify-center">
                {children && (
                  <div 
                    className="w-full h-full"
                    style={{
                      opacity: opacity,
                      transform: `translateZ(5px)`,
                    }}
                  >
                    {children}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tablet hardware details for horizontal layout */}
          {isHorizontal && (
            <>
              {/* Power button */}
              <div 
                className="absolute top-6 right-2 w-2 h-8 rounded-full"
                style={{
                  background: `linear-gradient(180deg, 
                    rgba(60, 60, 60, ${opacity}) 0%, 
                    rgba(30, 30, 30, ${opacity}) 100%)`,
                  boxShadow: `
                    inset 0 2px 4px rgba(0, 0, 0, ${0.8 * opacity}),
                    0 1px 2px rgba(255, 255, 255, ${0.1 * opacity})
                  `,
                }}
              />
              
              {/* Volume buttons */}
              <div 
                className="absolute top-16 right-2 w-1.5 h-6 rounded-full"
                style={{
                  background: `linear-gradient(180deg, 
                    rgba(50, 50, 50, ${opacity}) 0%, 
                    rgba(25, 25, 25, ${opacity}) 100%)`,
                  boxShadow: `inset 0 1px 3px rgba(0, 0, 0, ${0.8 * opacity})`,
                }}
              />
              <div 
                className="absolute top-24 right-2 w-1.5 h-6 rounded-full"
                style={{
                  background: `linear-gradient(180deg, 
                    rgba(50, 50, 50, ${opacity}) 0%, 
                    rgba(25, 25, 25, ${opacity}) 100%)`,
                  boxShadow: `inset 0 1px 3px rgba(0, 0, 0, ${0.8 * opacity})`,
                }}
              />

              {/* Home button (for horizontal iPad style) */}
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full"
                style={{
                  background: `linear-gradient(145deg, 
                    rgba(40, 40, 40, ${opacity}) 0%, 
                    rgba(20, 20, 20, ${opacity}) 100%)`,
                  boxShadow: `
                    inset 0 2px 4px rgba(0, 0, 0, ${0.8 * opacity}),
                    0 1px 3px rgba(255, 255, 255, ${0.05 * opacity})
                  `,
                  border: `1px solid rgba(255, 255, 255, ${0.1 * opacity})`,
                }}
              />
              
              {/* Speaker grilles */}
              <div className="absolute bottom-6 left-8 flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: `rgba(80, 80, 80, ${opacity})`,
                      boxShadow: `inset 0 1px 1px rgba(0, 0, 0, ${0.8 * opacity})`,
                    }}
                  />
                ))}
              </div>
              <div className="absolute bottom-6 right-8 flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: `rgba(80, 80, 80, ${opacity})`,
                      boxShadow: `inset 0 1px 1px rgba(0, 0, 0, ${0.8 * opacity})`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Enhanced bottom edge highlight */}
          <div 
            className="absolute bottom-0 left-1/4 right-1/4 h-[3px] opacity-40 rounded-full"
            style={{
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255,255,255,${0.3 * opacity}), 
                rgba(210,105,30,${0.2 * opacity}), 
                rgba(255,255,255,${0.3 * opacity}), 
                transparent)`,
            }}
          />
          
          {/* Top edge subtle highlight */}
          <div 
            className="absolute top-0 left-1/3 right-1/3 h-[2px] opacity-20 rounded-full"
            style={{
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255,255,255,${0.4 * opacity}), 
                transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};