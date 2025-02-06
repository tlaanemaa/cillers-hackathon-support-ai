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
  const { messages, chatOn } = useChatStore();

  return (
    <div className="space-y-4 max-w-[800px] mx-auto">
      {chatOn &&
        messages
          .filter(hasContent)
          .map((msg) => <Message key={msg.id} {...msg} />)}
    </div>
  );
};

export default ChatMessages;
