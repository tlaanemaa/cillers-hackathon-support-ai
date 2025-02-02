import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: { label: string; value: string; color?: string }[];
};

type ChatStore = {
  chatOn: boolean;
  microphoneOn: boolean;
  messages: Message[];
  upsertMessage: (message: Message) => void;
  setMessageText: (id: string, text: string) => void;
  appendMessageText: (id: string, text: string) => void;
  resetChat: () => void;
  setChatOn: (chatOn: boolean) => void;
  setMicrophoneOn: (microphoneOn: boolean) => void;
};

/** Zustand Store */
export const useChatStore = create<ChatStore>((set) => ({
  chatOn: true,
  messages: [],
  microphoneOn: true,

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
      messages: [],
    }),

  setChatOn: (chatOn) => set({ chatOn }),
  setMicrophoneOn: (microphoneOn) => set({ microphoneOn }),
}));

export const chatStore = () => useChatStore.getState();
