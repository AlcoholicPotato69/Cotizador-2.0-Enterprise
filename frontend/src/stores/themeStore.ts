import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
    const mode = ref<ThemeMode>('light');

    function toggleMode() {
        mode.value = mode.value === 'light' ? 'dark' : 'light';
        if (mode.value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    return { mode, toggleMode };
});
