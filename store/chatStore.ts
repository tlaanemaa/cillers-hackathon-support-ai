import { create } from "zustand";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string }[];
};

type ChatStore = {
  messages: Message[];
  addMessage: (msg: Omit<Message, "id">) => void;
  resetChat: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { id: crypto.randomUUID(), ...msg }],
    })),
  resetChat: () => set({ messages: [] }),
}));