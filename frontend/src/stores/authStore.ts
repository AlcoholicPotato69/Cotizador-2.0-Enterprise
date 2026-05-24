import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../services/authService';
import { useTenantStore } from './tenantStore';
import { usePermissionsStore } from './permissionsStore';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);
    const isAuthenticated = ref(false);
    const token = ref<string | null>(null);

    async function login(email: string, pass: string) {
        const authData = await authService.login(email, pass);
        user.value = authData.record;
        token.value = authData.token || null; // Will capture JWT token from new auth or pocketbase
        isAuthenticated.value = true;
        
        // Sync Tenant
        const tenantStore = useTenantStore();
        if (user.value.tenant_id) {
            await tenantStore.syncWithUser(user.value);
        }

        // Sync Permissions
        const permStore = usePermissionsStore();
        permStore.syncWithUser(user.value);
    }

    function logout() {
        authService.logout();
        user.value = null;
        token.value = null;
        isAuthenticated.value = false;
        
        const tenantStore = useTenantStore();
        tenantStore.clearTenant();
        
        const permStore = usePermissionsStore();
        permStore.clearPermissions();
    }

    async function initializeSession() {
        if (authService.isValid()) {
            try {
                const authData = await authService.refreshSession();
                if (authData) {
                    user.value = authData.record;
                    token.value = authData.token || null;
                    isAuthenticated.value = true;
                    
                    const tenantStore = useTenantStore();
                    if (user.value.tenant_id) {
                        await tenantStore.syncWithUser(user.value);
                    }

                    const permStore = usePermissionsStore();
                    permStore.syncWithUser(user.value);
                }
            } catch (err) {
                console.error("Session refresh failed", err);
                logout();
            }
        }
    }

    return { user, token, isAuthenticated, login, logout, initializeSession };
});
