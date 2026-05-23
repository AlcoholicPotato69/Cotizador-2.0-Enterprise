const fs = require('fs');
const path = require('path');

const storesDir = path.join(__dirname, 'frontend', 'src', 'stores');

if (!fs.existsSync(storesDir)) {
    fs.mkdirSync(storesDir, { recursive: true });
}

const stores = {
    'authStore.ts': `import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null);
    const isAuthenticated = ref(false);

    function setAuth(userData: any) {
        user.value = userData;
        isAuthenticated.value = true;
    }

    function logout() {
        user.value = null;
        isAuthenticated.value = false;
        // PocketBase authStore clear logic will go here
    }

    return { user, isAuthenticated, setAuth, logout };
});
`,
    'sessionStore.ts': `import { defineStore } from 'pinia';
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
`,
    'tenantStore.ts': `import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Tenant = 'pm' | 'cp';

export const useTenantStore = defineStore('tenant', () => {
    const activeTenant = ref<Tenant>('pm'); // Default Plaza Mayor

    function setTenant(tenant: Tenant) {
        activeTenant.value = tenant;
        // Inyectar clase en document.body para Theme Engine
        document.body.classList.remove('tenant-pm', 'tenant-cp');
        document.body.classList.add(\`tenant-\${tenant}\`);
    }

    return { activeTenant, setTenant };
});
`,
    'permissionsStore.ts': `import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePermissionsStore = defineStore('permissions', () => {
    const permissions = ref<string[]>([]);

    function setPermissions(perms: string[]) {
        permissions.value = perms;
    }

    function can(permission: string): boolean {
        // DENY > ALLOW > ROLE logic is handled by Effective Permissions Engine in backend
        // Here we just check the resolved permissions array
        return permissions.value.includes(permission);
    }

    return { permissions, setPermissions, can };
});
`,
    'themeStore.ts': `import { defineStore } from 'pinia';
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
`,
    'notificationStore.ts': `import { defineStore } from 'pinia';
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
`
};

for (const [filename, content] of Object.entries(stores)) {
    fs.writeFileSync(path.join(storesDir, filename), content, 'utf8');
    console.log(\`Created \${filename}\`);
}
console.log('Foundation stores generated successfully.');
