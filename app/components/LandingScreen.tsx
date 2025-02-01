"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supportAgent } from "@/agent/SupportAgent";
import Button from "./Button";
import TypingIndicator from "./TypingIndicator";

const LandingScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleStartChat = () => {
    setLoading(true);
    supportAgent.init(); // AI Agent boot-up
  };

  return (
    <motion.div
      className="fixed inset-0 flex justify-center items-center bg-background-gradientStart px-6"
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="bg-input p-8 rounded-2xl shadow-lg text-center flex flex-col justify-center items-center w-full max-w-2xl h-96">
        <AnimatePresence mode="wait">
          {!loading ? (
            // Landing Page (No Animation)
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome to Your AI Assistant
              </h1>
              <p className="text-lg md:text-2xl text-gray-300 mt-4 max-w-xl">
                I&apos;m here to help! Click below to start chatting.
              </p>
              <div className="mt-8">
                <Button label="Start Chat" onClick={handleStartChat} />
              </div>
            </motion.div>
          ) : (
            // Spinner Transition (Smooth)
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <TypingIndicator />
              <p className="mt-3 text-2xl">Starting chat...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LandingScreen;
