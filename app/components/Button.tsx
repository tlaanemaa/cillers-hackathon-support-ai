"use client";
import { motion } from "framer-motion";

type ButtonProps = {
  label: string;
  onClick: () => void;
  color?: string;
};

const Button = ({ label, onClick, color = "#955678" }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ filter: "brightness(1.2)" }} // Lighten on hover
      whileTap={{ filter: "brightness(0.9)" }} // Darken when clicked
      transition={{ duration: 0.1 }}
      className="px-6 py-3 rounded-full transition text-xl font-semibold"
      style={{
        backgroundColor: color,
      }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default Button;
