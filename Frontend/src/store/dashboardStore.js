import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  recentSearches: [],
  setRecentSearches: (recentSearches) => set({ recentSearches }),
}))

export default useDashboardStore
