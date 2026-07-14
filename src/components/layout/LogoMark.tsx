"use client";

import { motion } from "framer-motion";

// Reebelo-style 8-petal asterisk/flower mark, rendered in near-black.
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 32 32"
      className={className}
      whileHover={{ rotate: 90 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      aria-hidden
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="16"
          cy="6.2"
          rx="3.1"
          ry="6"
          fill="currentColor"
          transform={`rotate(${i * 45} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="3.4" fill="#fff" />
    </motion.svg>
  );
}
