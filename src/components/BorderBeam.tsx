import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 200,
  duration = 15,
  borderWidth = 2,
  colorFrom = "#E86C28",
  colorTo = "#FFB366",
  delay = 0,
}) => {
  const style = {
    '--size': size,
    '--duration': `${duration}s`,
    '--border-width': borderWidth,
    '--color-from': colorFrom,
    '--color-to': colorTo,
    '--delay': `${delay}s`,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={cn(
        'border-beam',
        'pointer-events-none absolute inset-0',
        className
      )}
    />
  );
};
