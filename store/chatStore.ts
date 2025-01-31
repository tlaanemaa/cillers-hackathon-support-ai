import { create } from "zustand";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string }[];
};

type ChatStore = {
  messages: Message[];
  say: (text: string) => void;
  resetChat: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

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
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
          },
        ],
      }));
    }, 500);
  },

  resetChat: () => set({ messages: [] }),
}));
