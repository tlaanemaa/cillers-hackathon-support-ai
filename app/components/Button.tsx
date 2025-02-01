"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

type ButtonProps = {
  label: string;
  onClick: () => void;
  color?: string;
  fill?: boolean;
};

const Button = ({
  label,
  onClick,
  color = "#955678",
  fill = false,
}: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ filter: "brightness(1.2)" }} // Lighten on hover
      whileTap={{ filter: "brightness(0.9)" }} // Darken when clicked
      transition={{ duration: 0.1 }}
      className={clsx(
        "px-6 py-3 rounded-full transition text-xl font-semibold text-center",
        fill && "w-full flex-1" // Apply fill mode if enabled
      )}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default Button;
