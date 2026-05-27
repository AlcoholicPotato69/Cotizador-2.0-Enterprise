import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userService, type UserInviteDto } from '../services/userService';
import type { User } from '../types/user';

export const useUserStore = defineStore('user', () => {
    const users = ref<User[]>([]);
    const roleOptions = ref<any[]>([]);
    const loading = ref(false);
    const saving = ref(false);

    async function fetchUsers() {
        loading.value = true;
        try {
            users.value = await userService.getUsers();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchRoles() {
        try {
            const data = await userService.getRoles();
            roleOptions.value = data.map((r: any) => ({ label: r.name, value: r.name.toLowerCase() }));
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    }

    async function inviteUser(payload: UserInviteDto) {
        saving.value = true;
        try {
            await userService.inviteUser(payload);
            await fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error inviting user:', error);
            throw error;
        } finally {
            saving.value = false;
        }
    }

    return {
        users,
        roleOptions,
        loading,
        saving,
        fetchUsers,
        fetchRoles,
        inviteUser
    };
});
