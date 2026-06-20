import { create } from 'zustand'

interface BrowseState {
  role: string
  difficulty: string
  duration: string
  search: string
  setFilter: (key: keyof Omit<BrowseState, 'setFilter' | 'reset'>, value: string) => void
  reset: () => void
}

export const useBrowseStore = create<BrowseState>((set) => ({
  role: '',
  difficulty: '',
  duration: '',
  search: '',
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  reset: () => set({ role: '', difficulty: '', duration: '', search: '' }),
}))
