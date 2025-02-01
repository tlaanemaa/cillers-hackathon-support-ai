"use client";
import { useChatStore } from "@/store/chatStore";
import Message from "./Message";

const ChatMessages = () => {
  const { messages } = useChatStore();

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default ChatMessages;
