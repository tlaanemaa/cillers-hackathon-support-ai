"use client";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { supportAgent } from "@/agent/SupportAgent";
import Button from "./Button";
import { motion } from "framer-motion";
import { IoMic, IoMicOff } from "react-icons/io5"; // Mic Icons

const ChatInput = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { chatOn, microphoneOn } = useChatStore();

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

    // Keep focus on input after sending a message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <motion.div
      initial={{ y: 150 }}
      animate={{ y: chatOn ? 0 : 150 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 left-0 w-full px-chatPadding flex justify-center"
    >
      <div className="flex w-full max-w-3xl bg-input p-3 shadow-stronger rounded-full items-stretch gap-1">
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 px-6 bg-transparent text-2xl text-white outline-none placeholder-text-muted font-semibold"
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
      </div>
    </motion.div>
  );
};

export default ChatInput;
