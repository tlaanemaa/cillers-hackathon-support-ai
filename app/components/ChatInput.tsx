"use client";
import { useEffect, useRef, useState } from "react";
import { supportAgent } from "@/agent/SupportAgent";
import Button from "./Button";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="fixed bottom-6 left-0 w-full px-chatPadding flex justify-center">
      <div className="flex w-full max-w-3xl bg-input p-3 shadow-stronger rounded-full items-center">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 px-6 py-3 bg-transparent text-2xl text-white outline-none placeholder-text-muted font-semibold"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button label="Send" onClick={handleSend} />
      </div>
    </div>
  );
};

export default ChatInput;
