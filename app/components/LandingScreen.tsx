"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supportAgent } from "@/agent/SupportAgent";
import { useChatStore } from "@/store/chatStore";
import Button from "./Button";
import TypingIndicator from "./TypingIndicator";
import CameraStream from "./CameraStream";

const LandingScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // <boolean>   (added by me)
  const [showCamera, setShowCamera] = useState(false);
  const { setHandleCamera } = useChatStore(); // <boolean>   (added by me)

  const handleStartChat = async (type?: "voice"): Promise<void> => { // : Promise<void>   (added by me)
    setLoading(true);
    await supportAgent.init(type === "voice"); // AI Agent boot-up
  };

  const handleStartCamera = useCallback(() => { // useCallback as per eslint rule   (added by me)
    setShowCamera(prev => !prev);  // Toggle camera state
  }, []);

  
  useEffect(() => {   // Make camera function available to other components
    setHandleCamera(handleStartCamera);
  }, [setHandleCamera, handleStartCamera]);

  const handleCameraResult = async (result: string) => {
    setLoading(true);

    if (!result || result.trim() === "") {
      console.log("OCR did not detect any text from camera");
      setLoading(false);
      return;
    }

    console.log("OCR detected text from camera: ", result);

    try {
      await supportAgent.safeTextSend(`I have this text from an image: ${result}`);
      console.log("Message sent successfully to AI agent");
    } catch (error) {
      console.error('Error processing camera result:', error);
    } finally {
      setLoading(false);
      setShowCamera(false);
    }
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
                I&apos;m here to help! How do you want to communicate with me?
              </p>
              <div className="flex justify-evenly mt-8">
                <Button label="I want to write" onClick={handleStartChat} />
                <Button
                  label="I want to talk" onClick={() => handleStartChat("voice")} />
                <Button label="Use camera" onClick={handleStartCamera} />
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
