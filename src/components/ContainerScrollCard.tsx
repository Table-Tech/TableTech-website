import React from "react";

export interface ContainerScrollCardProps {
  rotate: number;
  scale: number;
  children?: React.ReactNode;
}

export const ContainerScrollCard: React.FC<ContainerScrollCardProps> = ({ 
  rotate, 
  scale,
  children 
}) => {
  return (
    <div
      style={{
        transform: `rotateX(${rotate}deg) scale(${scale})`,
        boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[40rem] md:p-6"
    >
      <div className="size-full overflow-hidden rounded-2xl bg-gray-900 md:rounded-2xl md:p-4">
        <div className="size-full rounded-2xl overflow-hidden relative bg-gray-800">
          {/* Background image */}
          <img 
            src="/aap.webp" 
            alt="Dashboard preview"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Screen overlay for better visibility */}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Content overlay */}
          <div className="relative z-10 size-full flex items-center justify-center p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};