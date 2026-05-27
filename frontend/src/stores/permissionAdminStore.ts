import { defineStore } from 'pinia';
import { ref } from 'vue';
import { permissionAdminService, type Permission } from '../services/permissionAdminService';

export const usePermissionAdminStore = defineStore('permissionAdmin', () => {
    const permissions = ref<Permission[]>([]);
    const loading = ref(false);

    async function fetchPermissions() {
        loading.value = true;
        try {
            permissions.value = await permissionAdminService.getAllPermissions();
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        permissions,
        loading,
        fetchPermissions
    };
});
