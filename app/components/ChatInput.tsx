"use client";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import Button from "./Button";

const ChatInput = () => {
  const { say } = useChatStore();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Auto-focus only on initial page load
    }
  }, []); // Runs only on mount

  const handleSend = () => {
    if (!input.trim()) return;
    say(input);
    setInput("");
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
        <Button label="Send" onClick={handleSend} color="#8a79ff" />
      </div>
    </div>
  );
};

export default ChatInput;
