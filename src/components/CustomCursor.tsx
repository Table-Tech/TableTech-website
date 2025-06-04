import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CustomCursorProps {
  hover: boolean;
  visible: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ hover, visible }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{ x: position.x, y: position.y }}
    >
      <motion.div
        animate={{ scale: hover ? 1.8 : 1, opacity: hover ? 0.8 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-4 h-4 rounded-full border-2 border-white mix-blend-difference"
      />
    </motion.div>
  );
};
