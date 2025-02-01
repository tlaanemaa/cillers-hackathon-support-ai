import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string; color?: string }[];
};

type ChatStore = {
  messages: Message[];
  upsertMessage: (message: Message) => void;
  setMessageText: (id: string, text: string) => void;
  appendMessageText: (id: string, text: string) => void;
  resetChat: () => void;
};

/** Zustand Store */
export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  upsertMessage(msg) {
    set((state) => {
      for (let i = 0; i < state.messages.length; i++) {
        if (state.messages[i].id === msg.id) {
          state.messages[i] = { ...state.messages[i], ...msg };
          return state;
        }
      }

      return {
        messages: [...state.messages, msg],
      };
    });
  },

  setMessageText(id, text) {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, text } : msg
      ),
    }));
  },

  appendMessageText(id, text) {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, text: msg.text + text } : msg
      ),
    }));
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
export const upsertMessage = (msg: Message) =>
  useChatStore.getState().upsertMessage(msg);

export const setMessageText = (id: string, text: string) =>
  useChatStore.getState().setMessageText(id, text);

export const appendToMessage = (id: string, text: string) =>
  useChatStore.getState().appendMessageText(id, text);

export const resetChat = () => useChatStore.getState().resetChat();
