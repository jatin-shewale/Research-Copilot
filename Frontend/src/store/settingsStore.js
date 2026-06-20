import { create } from 'zustand'

const STORAGE_KEY = 'rc_settings'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupted storage */
  }
  return { theme: 'light', denseMode: false, animationsEnabled: true }
}

export const useSettingsStore = create((set, get) => ({
  ...loadInitial(),
  updateSettings: (partial) => {
    const next = { ...get(), ...partial }
    const { theme, denseMode, animationsEnabled } = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, denseMode, animationsEnabled }))
    set(partial)
  },
}))

export default useSettingsStore
