/**
 * @module authStore
 * @description Pinia store for managing application authentication state, session lifecycles, and auto-logout mechanics.
 * Integrates directly with `authService`, `tenantStore`, and `permissionsStore` to ensure synchronized context upon login/logout.
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../services/authService';
import { useTenantStore } from './tenantStore';
import { usePermissionsStore } from './permissionsStore';
import { useThemeStore } from './themeStore';
import type { User } from '../types/user';
import { secureStorage } from '../utils/secureStorage';

export const useAuthStore = defineStore('auth', () => {
    let storedUser: User | null = null;
    let storedToken: string | null = null;
    try {
        const u = secureStorage.get('auth_user');
        const parsedUser = u ? (typeof u === 'string' ? JSON.parse(u) : u) : null;
        storedUser = parsedUser && typeof parsedUser === 'object' ? (parsedUser as User) : null;
        const parsedToken = secureStorage.get('auth_token');
        storedToken = typeof parsedToken === 'string' ? parsedToken : null;
    } catch {}
    
    /** @type {import('vue').Ref<User | null>} The currently authenticated user */
    const user = ref<User | null>(storedUser);
    
    /** @type {import('vue').Ref<boolean>} Indicates if a user is currently authenticated */
    const isAuthenticated = ref(!!storedToken);
    
    /** @type {import('vue').Ref<string | null>} The active JWT/Auth token */
    const token = ref<string | null>(storedToken);

    let inactivityTimer: number | null = null;
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

    /**
     * Resets the inactivity timer to prevent auto-logout.
     * If the inactivity limit is reached, forces a logout and redirects to `/login`.
     */
    function resetInactivityTimer() {
        if (inactivityTimer) window.clearTimeout(inactivityTimer);
        if (isAuthenticated.value) {
            inactivityTimer = window.setTimeout(() => {
                console.warn('Auto-logout due to inactivity');
                logout();
                window.location.href = '/login';
            }, INACTIVITY_LIMIT);
        }
    }

    /**
     * Sets up global DOM event listeners to detect user activity and reset the inactivity timer.
     */
    function setupActivityListeners() {
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(event => {
            window.addEventListener(event, resetInactivityTimer);
        });
        resetInactivityTimer();
    }

    /**
     * Removes global DOM event listeners used for activity tracking and clears the timer.
     */
    function removeActivityListeners() {
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach(event => {
            window.removeEventListener(event, resetInactivityTimer);
        });
        if (inactivityTimer) window.clearTimeout(inactivityTimer);
    }

    /**
     * Authenticates a user using email and password, initializes the session, and syncs related stores.
     * 
     * @param {string} email - The user's email address
     * @param {string} pass - The user's password
     * @returns {Promise<void>}
     */
    async function login(email: string, pass: string) {
        const authData = await authService.login(email, pass);
        user.value = authData.record;
        token.value = authData.token || null; 
        isAuthenticated.value = true;
        
        secureStorage.set('auth_user', JSON.stringify(user.value));
        if (token.value) secureStorage.set('auth_token', token.value);
        
        setupActivityListeners();

        const themeStore = useThemeStore();
        themeStore.initializeTheme();
        
        // Sync Tenant
        const tenantStore = useTenantStore();
        if (user.value && user.value.tenant_id) {
            await tenantStore.syncWithUser(user.value);
        }

        // Sync Permissions
        const permStore = usePermissionsStore();
        if (user.value) {
            permStore.syncWithUser(user.value);
        }
    }

    /**
     * Terminates the current session, clears stored credentials, and purges related store states.
     */
    function logout() {
        authService.logout();
        user.value = null;
        token.value = null;
        isAuthenticated.value = false;
        
        secureStorage.remove('auth_user');
        secureStorage.remove('auth_token');
        
        removeActivityListeners();
        
        const tenantStore = useTenantStore();
        tenantStore.clearTenant();
        
        const permStore = usePermissionsStore();
        permStore.clearPermissions();
    }

    /**
     * Attempts to silently refresh an existing valid session upon application load.
     * Updates stores and initializes activity tracking if successful.
     * 
     * @returns {Promise<void>}
     */
    async function initializeSession() {
        if (authService.isValid()) {
            try {
                const authData = await authService.refreshSession();
                if (authData) {
                    user.value = authData.record;
                    token.value = authData.token || null;
                    isAuthenticated.value = true;
                    
                    secureStorage.set('auth_user', JSON.stringify(user.value));
                    if (token.value) secureStorage.set('auth_token', token.value);
                    
                    setupActivityListeners();

                    const themeStore = useThemeStore();
                    themeStore.initializeTheme();
                    
                    const tenantStore = useTenantStore();
                    if (user.value && user.value.tenant_id) {
                        await tenantStore.syncWithUser(user.value);
                    }

                    const permStore = usePermissionsStore();
                    if (user.value) {
                        permStore.syncWithUser(user.value);
                    }
                }
            } catch (err) {
                console.error("Session refresh failed", err);
                logout();
            }
        }
    }

    return { user, token, isAuthenticated, login, logout, initializeSession };
});
