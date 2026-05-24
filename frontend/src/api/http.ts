import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    // We cannot use Pinia stores directly at the top level, they must be used inside functions/components
    // after pinia is initialized.
    const authStore = useAuthStore();
    const tenantStore = useTenantStore();

    if (authStore.token) {
        config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    if (tenantStore.activeTenant?.id) {
        config.headers['x-tenant-id'] = tenantStore.activeTenant.id;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const authStore = useAuthStore();
            authStore.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
