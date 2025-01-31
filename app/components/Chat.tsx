"use client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { motion } from "framer-motion";
import clsx from "clsx";

const Chat = () => {
  const { messages, addMessage, resetChat } = useChatStore();
  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  // Track whether user is at the bottom
  useEffect(() => {
    const handleScroll = () => {
      const isUserAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      setIsAtBottom(isUserAtBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addMessage({ role: "user", text });
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        text: "Would you like more details?",
        buttons: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradientStart to-background-gradientEnd text-text px-chatPadding pt-6 pb-32">
      {/* Messages - Part of Page Flow */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "max-w-[80%] p-5 rounded-2xl shadow-subtle text-2xl leading-relaxed font-semibold",
              msg.role === "user"
                ? "bg-chat-user text-text-light ml-auto"
                : "bg-chat-assistant text-text-light mr-auto"
            )}
          >
            {msg.text}
            {msg.buttons && (
              <div className="mt-3 flex gap-3">
                {msg.buttons.map((btn) => (
                  <button
                    key={btn.value}
                    className="px-6 py-3 bg-button text-white rounded-full hover:bg-button-hover transition shadow-subtle text-xl font-semibold"
                    onClick={() => handleSend(btn.value)}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fixed Input Box */}
      <div className="fixed bottom-6 left-0 w-full px-chatPadding flex justify-center">
        <div className="flex w-full max-w-3xl bg-input p-3 shadow-stronger rounded-full items-center">
          <input
            type="text"
            className="flex-1 px-6 py-3 bg-transparent text-2xl text-white outline-none placeholder-text-muted font-semibold"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          />
          <button
            onClick={() => handleSend(input)}
            className="px-6 py-3 bg-button text-white rounded-full hover:bg-button-hover transition shadow-subtle text-2xl font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
