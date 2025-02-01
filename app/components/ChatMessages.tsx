"use client";
import {
  useChatStore,
  Message as ConversationMessage,
} from "@/store/chatStore";
import Message from "./Message";

const hasContent = (message: ConversationMessage) => {
  return (message.buttons && message.buttons.length) || message.text;
};

const ChatMessages = () => {
  const { messages } = useChatStore();

  return (
    <div className="space-y-4">
      {messages.filter(hasContent).map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default ChatMessages;
