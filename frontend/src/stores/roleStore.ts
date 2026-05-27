import { defineStore } from 'pinia';
import { ref } from 'vue';
import { roleService, type Role } from '../services/roleService';

export const useRoleStore = defineStore('role', () => {
    const roles = ref<Role[]>([]);
    const loading = ref(false);
    const saving = ref(false);

    async function fetchRoles() {
        loading.value = true;
        try {
            roles.value = await roleService.getRoles();
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function createRole(payload: Partial<Role>) {
        saving.value = true;
        try {
            await roleService.createRole(payload);
            await fetchRoles(); // Refresh the list
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        } finally {
            saving.value = false;
        }
    }

    return {
        roles,
        loading,
        saving,
        fetchRoles,
        createRole
    };
});
