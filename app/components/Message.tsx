"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useChatStore } from "@/store/chatStore";
import Button from "./Button";

type MessageProps = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string; color?: string }[];
};

const Message = ({ id, role, text, buttons }: MessageProps) => {
  const { say } = useChatStore();

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "max-w-[80%] p-5 rounded-2xl shadow-subtle text-2xl leading-relaxed font-semibold",
        role === "user"
          ? "bg-chat-user text-text-light ml-auto"
          : "bg-chat-assistant text-text-light mr-auto"
      )}
    >
      {text}
      {buttons && (
        <div className="mt-3 flex gap-3">
          {buttons.map((btn) => (
            <Button
              key={btn.value}
              label={btn.label}
              color={btn.color}
              onClick={() => say(btn.value)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Message;
