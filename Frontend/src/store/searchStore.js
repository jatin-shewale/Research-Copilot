import { create } from 'zustand'

/**
 * Tracks the active (or most recent) research pipeline run.
 * Shared across Search, Landscape, Knowledge Graph, Reading Map,
 * Timeline and Chat pages so a single search powers every view.
 */
export const useSearchStore = create((set, get) => ({
  searchId: null,
  query: '',
  status: 'idle', // idle | processing | completed | failed
  results: null, // full backend payload once completed
  error: null,
  history: [],

  setQuery: (query) => set({ query }),

  startSearch: ({ searchId, query }) =>
    set({ searchId, query, status: 'processing', results: null, error: null }),

  setProcessing: () => set({ status: 'processing' }),

  setCompleted: (results) => set({ status: 'completed', results, error: null }),

  setFailed: (error) => set({ status: 'failed', error }),

  setHistory: (history) => set({ history }),

  reset: () => set({ searchId: null, query: '', status: 'idle', results: null, error: null }),

  hasActiveSearch: () => Boolean(get().searchId),
}))

export default useSearchStore
