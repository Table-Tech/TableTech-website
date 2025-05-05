import React from "react";
import "../styles/glitchSparkLine.css"; // Vergeet deze CSS niet toe te voegen

export const GlitchSparkLine: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-1 z-50 pointer-events-none">
      <div className="glitch-line">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`spark spark-${i}`} />
        ))}
      </div>
    </div>
  );
};
