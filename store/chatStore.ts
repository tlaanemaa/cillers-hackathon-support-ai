import { create } from "zustand";

type Message = {
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
            { label: "Enable Voice Chat", value: "enable-voice", color: "#ff85a2" },
          ],
        },
      ],
    }),
}));