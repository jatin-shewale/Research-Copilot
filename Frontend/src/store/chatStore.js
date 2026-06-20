import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  messagesBySearch: {}, // { [searchId]: [{ role, content, citations, confidence, ts }] }

  getMessages: (searchId) => get().messagesBySearch[searchId] || [],

  addMessage: (searchId, message) =>
    set((state) => ({
      messagesBySearch: {
        ...state.messagesBySearch,
        [searchId]: [...(state.messagesBySearch[searchId] || []), message],
      },
    })),

  setTyping: (typing) => set({ isTyping: typing }),
  isTyping: false,

  clearMessages: (searchId) =>
    set((state) => ({
      messagesBySearch: { ...state.messagesBySearch, [searchId]: [] },
    })),
}))

export default useChatStore
