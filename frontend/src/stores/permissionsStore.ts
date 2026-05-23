import { defineStore } from 'pinia';
import { ref } from 'vue';
import { rbacService } from '../services/rbacService';

export const usePermissionsStore = defineStore('permissions', () => {
    const permissions = ref<string[]>([]);

    function syncWithUser(user: any) {
        if (!user) {
            clearPermissions();
            return;
        }
        permissions.value = rbacService.getUserPermissions(user);
    }

    function clearPermissions() {
        permissions.value = [];
    }

    function can(permission: string): boolean {
        return permissions.value.includes(permission);
    }

    return { permissions, syncWithUser, clearPermissions, can };
});
