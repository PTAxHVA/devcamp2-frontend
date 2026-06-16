import { create } from 'zustand'

interface BrowseFilterStore {
  role: string
  difficulty: string
  duration: string
  search: string
  setFilter: (key: keyof Omit<BrowseFilterStore, 'setFilter' | 'reset'>, value: string) => void
  reset: () => void
}

export const useBrowseStore = create<BrowseFilterStore>((set) => ({
  role: '',
  difficulty: '',
  duration: '',
  search: '',
  setFilter: (key, value) => set({ [key]: value }),
  reset: () => set({ role: '', difficulty: '', duration: '', search: '' }),
}))
