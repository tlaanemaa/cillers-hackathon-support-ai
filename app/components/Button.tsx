"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

type ButtonProps = {
  label: string | React.ReactNode;
  onClick: () => void;
  color?: string;
  fill?: boolean;
};

const Button = ({ label, onClick, color, fill = false }: ButtonProps) => {
  const style = color ? { backgroundColor: color } : {};
  return (
    <motion.button
      whileHover={{ filter: "brightness(1.2)" }} // Lighten on hover
      whileTap={{ filter: "brightness(0.9)" }} // Darken when clicked
      transition={{ duration: 0.1 }}
      className={clsx(
        "px-6 py-3 rounded-full transition text-xl font-semibold text-center bg-button",
        fill && "w-full flex-1" // Apply fill mode if enabled
      )}
      style={style}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default Button;
