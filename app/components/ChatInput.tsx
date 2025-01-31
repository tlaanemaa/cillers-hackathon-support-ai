"use client";
import { useState } from "react";
import { useChatStore } from "@/store/chatStore";

const ChatInput = () => {
  const { say } = useChatStore();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    say(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 left-0 w-full px-chatPadding flex justify-center">
      <div className="flex w-full max-w-3xl bg-input p-3 shadow-stronger rounded-full items-center">
        <input
          type="text"
          className="flex-1 min-w-0 px-6 py-3 bg-transparent text-2xl text-white outline-none placeholder-text-muted font-semibold"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="flex-shrink-0 px-6 py-3 bg-button text-white rounded-full hover:bg-button-hover transition shadow-subtle text-2xl font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
