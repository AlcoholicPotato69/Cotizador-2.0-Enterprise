/**
 * @module permissionsStore
 * @description Pinia store for managing role-based access control (RBAC) permissions.
 * Integrates with `rbacService` to derive granular UI permissions directly from the user's roles.
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { rbacService } from '../services/rbacService';
import type { User } from '../types/user';

export const usePermissionsStore = defineStore('permissions', () => {
    /** @type {import('vue').Ref<string[]>} Array of evaluated permission strings available to the active user */
    const permissions = ref<string[]>([]);

    /**
     * Synchronizes local permission state with the given user's roles.
     * Evaluates the RBAC matrix via `rbacService` and updates the available permissions array.
     * 
     * @param {User | null} user - The user object containing role configurations, or null to clear permissions
     */
    function syncWithUser(user: User | null) {
        if (!user) {
            clearPermissions();
            return;
        }
        const perms = rbacService.getUserPermissions(user);
        // Prevent payload injection: ensure permissions is strictly an array of strings
        permissions.value = Array.isArray(perms) ? perms.filter(p => typeof p === 'string') : [];
    }

    /**
     * Purges all loaded permissions. Usually called upon logout.
     */
    function clearPermissions() {
        permissions.value = [];
    }

    /**
     * Checks if the currently loaded permissions include the requested capability.
     * 
     * @param {string} permission - The specific permission string to verify (e.g. 'quotes:read')
     * @returns {boolean} True if the permission exists, false otherwise
     */
    function can(permission: string): boolean {
        return permissions.value.includes(permission);
    }

    /**
     * Alias for `can`. 
     * @param {string} permission - The specific permission string to verify
     * @returns {boolean}
     */
    const hasPermission = can;

    return { permissions, syncWithUser, clearPermissions, can, hasPermission };
});
