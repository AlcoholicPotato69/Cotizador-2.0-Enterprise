import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface AppNotification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    domainEvent: string;
    timestamp: number;
}

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<AppNotification[]>([]);

    function addNotification(notification: Omit<AppNotification, 'id' | 'timestamp'>) {
        notifications.value.unshift({
            ...notification,
            id: crypto.randomUUID(),
            timestamp: Date.now()
        });
    }

    function markAsRead(id: string) {
        notifications.value = notifications.value.filter(n => n.id !== id);
    }

    return { notifications, addNotification, markAsRead };
});
