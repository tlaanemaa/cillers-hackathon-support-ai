"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supportAgent } from "@/agent/SupportAgent";
import { useChatStore } from "@/store/chatStore";
import Button from "./Button";
import TypingIndicator from "./TypingIndicator";
import CameraStream from "./CameraStream";
import { useCamera } from "../hooks/useCamera";

const LandingScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setHandleCamera } = useChatStore();
  const {showCamera, handleCameraToggle, handleCameraResult } = useCamera();

  const handleStartChat = async (type?: "voice"): Promise<void> => {
    setLoading(true);
    await supportAgent.init(type === "voice"); // AI Agent boot-up
  };
  
  useEffect(() => {   // Make camera function available to other components
    setHandleCamera(handleCameraToggle);
  }, [setHandleCamera, handleCameraToggle]);

  
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
                I&apos;m here to help! How do you want to communicate with me?
              </p>
              <div className="flex justify-evenly mt-8">
                <Button label="I want to write" onClick={handleStartChat} />
                <Button
                  label="I want to talk" onClick={() => handleStartChat("voice")} />
                <Button label="Use camera" onClick={handleCameraToggle} />
              </div>
              {showCamera && <CameraStream onResult={handleCameraResult} />}
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
