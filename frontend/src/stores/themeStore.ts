import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system');
  const isDark = ref<boolean>(false);

  const applyTheme = (currentTheme: Theme) => {
    let resolvedIsDark = false;
    
    if (currentTheme === 'system') {
      resolvedIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      resolvedIsDark = currentTheme === 'dark';
    }

    isDark.value = resolvedIsDark;

    if (resolvedIsDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    // If system, it depends on current resolved dark. Let's just toggle between light and dark explicitly.
    if (theme.value === 'system') {
      setTheme(isDark.value ? 'light' : 'dark');
    } else {
      setTheme(theme.value === 'light' ? 'dark' : 'light');
    }
  };

  const initializeTheme = () => {
    applyTheme(theme.value);

    // Watch for system theme changes if we are on 'system'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system');
      }
    });
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme
  };
});
