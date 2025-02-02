"use client";
import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="inline-flex items-center gap-1 relative">
      {/* Invisible letter to maintain text height */}
      <span className="opacity-0 absolute">M</span>

      {/* Animated dots */}
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-text rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
