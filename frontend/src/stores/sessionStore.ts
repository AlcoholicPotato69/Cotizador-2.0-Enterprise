import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

export const useSessionStore = defineStore('session', () => {
    const authStore = useAuthStore();
    const lastActivity = ref<number>(Date.now());

    function updateActivity() {
        lastActivity.value = Date.now();
    }

    function checkSessionTimeout() {
        // Implement 15 min idle timeout for Zero Trust
        const timeout = 15 * 60 * 1000;
        if (Date.now() - lastActivity.value > timeout) {
            authStore.logout();
        }
    }

    return { lastActivity, updateActivity, checkSessionTimeout };
});
