import { create } from "zustand";
import { SupportAgent } from "@/agent/SupportAgent";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string; color?: string }[];
};

type ChatStore = {
  messages: Message[];
  say: (text: string) => void;
  resetChat: () => void;
};

/** Zustand Store */
export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Hello! How can I help you?",
      buttons: [
        { label: "Enable Voice Chat", value: "enable-voice", color: "#ff85a2" },
      ],
    },
  ],

  say: (text) => {
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role: "user", text },
      ],
    }));

    // Simulated AI response
    setTimeout(() => {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: "Would you like more details?",
            buttons: [
              { label: "Yes", value: "yes", color: "#8a79ff" },
              { label: "No", value: "no", color: "#ff9bb5" },
            ],
          },
        ],
      }));
    }, 500);
  },

  resetChat: () =>
    set({
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Hello! How can I help you?",
          buttons: [
            {
              label: "Enable Voice Chat",
              value: "enable-voice",
              color: "#ff85a2",
            },
          ],
        },
      ],
    }),
}));

/** Standalone functions for external use */
export const createMessage = (msg: Message): string => {
  useChatStore.setState((state) => {
    const exists = state.messages.some((m) => m.id === msg.id);
    if (exists) return state; // If message exists, do nothing

    return {
      messages: [...state.messages, msg],
    };
  });

  return msg.id;
};

export const setMessageText = (id: string, text: string) => {
  useChatStore.setState((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, text } : msg
    ),
  }));
};

export const appendToMessage = (id: string, text: string) => {
  useChatStore.setState((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, text: msg.text + text } : msg
    ),
  }));
};

/** Make AI agent globally accessible */
if (typeof window !== "undefined") {
  (window as any).agent = new SupportAgent();
}
