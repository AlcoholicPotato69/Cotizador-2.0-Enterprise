import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { authService } from '../services/authService';
import { secureStorage } from '../utils/secureStorage';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
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

let isRefreshing = false;
type QueuePromise = {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
};
let failedQueue: QueuePromise[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

http.interceptors.response.use(
    (response) => {
        const payload = response.data;
        if (
            payload &&
            typeof payload === 'object' &&
            'statusCode' in payload &&
            'data' in payload
        ) {
            response.data = (payload as { data: unknown }).data;
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            if (originalRequest.url?.includes('/auth/login')) {
                return Promise.reject(error);
            }

            if (originalRequest.url?.includes('/auth/profile')) {
                const authStore = useAuthStore();
                authStore.logout();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (!originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function(resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return http(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const session = await authService.refreshSession();
                    const newToken = session.token;
                    
                    const authStore = useAuthStore();
                    authStore.token = newToken;
                    if (session.record) {
                        authStore.user = session.record;
                        secureStorage.set('auth_user', JSON.stringify(session.record));
                    }
                    if (newToken) {
                        secureStorage.set('auth_token', newToken);
                    }

                    processQueue(null, newToken);
                    isRefreshing = false;

                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return http(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;
                    
                    const authStore = useAuthStore();
                    authStore.logout();
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            }

            // Fallback if _retry is already true but it fails again
            const authStore = useAuthStore();
            authStore.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
