import React from "react";

export interface ContainerScrollTitleProps {
  translate: number;
  children?: React.ReactNode;
}

export const ContainerScrollTitle: React.FC<ContainerScrollTitleProps> = ({
  translate,
  children
}) => {
  return (
    <div
      className="mx-auto max-w-5xl text-center"
      style={{
        transform: `translateY(${translate}px)`
      }}
    >
      {children}
    </div>
  );
};