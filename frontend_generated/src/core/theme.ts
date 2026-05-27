import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  initialize: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => {
        set({ mode });
        get().initialize();
      },
      initialize: () => {
        const { mode } = get();
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (mode === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(mode);
        }
      },
    }),
    {
      name: 'c2-theme-storage',
    }
  )
);
