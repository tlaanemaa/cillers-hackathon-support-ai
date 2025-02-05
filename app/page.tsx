"use client";
import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAutoScroll } from "./hooks/useAutoScroll";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import LandingScreen from "./components/LandingScreen";
import { AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const { resetChat, messages, chatOn } = useChatStore();

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  useAutoScroll([messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradientStart to-background-gradientEnd text-text px-chatPadding pt-6 pb-32">
      <AnimatePresence mode="wait">
        {!chatOn && <LandingScreen key="landing" />}
      </AnimatePresence>
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatPage;
