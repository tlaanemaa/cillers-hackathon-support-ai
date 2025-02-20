"use client";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { supportAgent } from "@/agent/SupportAgent";
import { useCamera } from "../hooks/useCamera";
import Button from "./Button";
import CameraStream from "./CameraStream";
import { motion } from "framer-motion";
import { IoMic, IoMicOff } from "react-icons/io5"; // Mic Icons
import { IoCamera, IoVideocamOff } from 'react-icons/io5'; // Camera Icons (added by me)

const ChatInput = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { chatOn, microphoneOn } = useChatStore();
  const { showCamera, handleCameraToggle, handleCameraResult } = useCamera();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Auto-focus on page load
    }

    const handleTypingIntent = () => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus(); // Focus input on any key press
      }
    };

    window.addEventListener("keydown", handleTypingIntent);
    return () => window.removeEventListener("keydown", handleTypingIntent);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    supportAgent.sayTo(input);
    setInput("");

    
    setTimeout(() => {
      inputRef.current?.focus();  // Keep focus on input after sending a message
    }, 0);
  };

  return (
    <motion.div
      initial={{ y: 150 }}
      animate={{ y: chatOn ? 0 : 150 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 left-0 w-full px-chatPadding flex justify-center"
    >
      <div className="flex flex-col w-full max-w-3xl">
        {/* Camera Stream Container - only renders when camera is active */}
        {showCamera && (
          <div className="mb-4">
            <CameraStream onResult={handleCameraResult} />
          </div>
        )}

        <div className="flex w-full max-w-3xl bg-input p-3 shadow-stronger rounded-full items-stretch gap-1">
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-6 bg-transparent text-2xl text-text outline-none placeholder-text-muted font-medium"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Send Button */}
          <Button label="Send" onClick={handleSend} />

          {/* Mute Button Styled Like the Send Button */}
          <Button
            label={microphoneOn ? <IoMic /> : <IoMicOff />}
            onClick={() => supportAgent.toggleMicrophone()}
          />

          {/* Camera Toggle Button */}
          <Button
           label={showCamera ? <IoCamera /> : <IoVideocamOff />}
            onClick={handleCameraToggle}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInput;
