import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'system' | 'light' | 'dark' | 'matte';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getSystemTheme: () => 'light' | 'dark';
  getEffectiveTheme: () => 'light' | 'dark' | 'matte';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme, get().getSystemTheme());
      },
      getSystemTheme: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      },
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return get().getSystemTheme();
        }
        return theme as 'light' | 'dark' | 'matte';
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme, state.getSystemTheme());
        }
      },
    }
  )
);

function applyTheme(theme: Theme, systemTheme: 'light' | 'dark') {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('light', 'dark', 'matte');
  
  // Apply appropriate theme
  if (theme === 'system') {
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Initialize theme on module load
if (typeof window !== 'undefined') {
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const store = useThemeStore.getState();
    if (store.theme === 'system') {
      applyTheme('system', store.getSystemTheme());
    }
  });
  
  // Apply initial theme
  const store = useThemeStore.getState();
  applyTheme(store.theme, store.getSystemTheme());
}