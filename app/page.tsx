"use client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

const ChatPage = () => {
  const { resetChat, messages } = useChatStore();
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  useEffect(() => {
    const handleScroll = () => {
      const isUserAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradientStart to-background-gradientEnd text-text px-chatPadding pt-6 pb-32">
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatPage;
