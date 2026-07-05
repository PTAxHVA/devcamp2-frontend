import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'vora:theme'

/** daisyUI + our token overrides both key off `data-theme` on <html>. */
const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

const readStoredTheme = (): Theme =>
  localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
    set({ theme })
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}))

// The inline boot script in index.html sets data-theme before first paint (no
// flash); re-assert it here so a hot reload / direct store import can't drift.
applyTheme(useThemeStore.getState().theme)
