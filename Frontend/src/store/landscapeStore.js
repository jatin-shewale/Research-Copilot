import { create } from 'zustand'

export const useLandscapeStore = create((set) => ({
  activeClusterId: null,
  setActiveClusterId: (id) => set({ activeClusterId: id }),
}))

export default useLandscapeStore
