"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useChatStore } from "@/store/chatStore";

const ChatMessages = () => {
  const { messages, say } = useChatStore();

  return (
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
                  onClick={() => say(btn.value)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ChatMessages;
