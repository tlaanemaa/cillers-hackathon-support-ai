"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { supportAgent } from "@/agent/SupportAgent";
import Button from "./Button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingIndicator from "./TypingIndicator";

type MessageProps = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string; color?: string }[];
};

const Message = ({ id, role, text, buttons }: MessageProps) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "max-w-[80%] w-fit p-5 rounded-2xl shadow-subtle text-2xl leading-relaxed font-semibold flex flex-col",
        role === "user" ? "bg-chat-user ml-auto" : "bg-chat-assistant mr-auto"
      )}
    >
      {/* Render Markdown */}
      <div className="flex-1 markdown">
        {text === "..." ? (
          <TypingIndicator />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        )}
      </div>

      {buttons && (
        <div className="mt-3 flex justify-between gap-3">
          {buttons.map((btn) => (
            <Button
              key={btn.value}
              label={btn.label}
              color={btn.color}
              onClick={() => supportAgent.sayTo(btn.value)}
              fill
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Message;
