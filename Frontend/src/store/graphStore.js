import { create } from 'zustand'

export const useGraphStore = create((set) => ({
  selectedNodeId: null,
  filterType: 'all', // all | paper | cluster
  searchTerm: '',
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setFilterType: (filterType) => set({ filterType }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  clearSelection: () => set({ selectedNodeId: null }),
}))

export default useGraphStore
