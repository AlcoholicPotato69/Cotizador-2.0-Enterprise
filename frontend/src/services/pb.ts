import { http } from '../api/http';
import { useAuthStore } from '../stores/authStore';
import type { QueryParams, PaginatedResponse } from './types';

export const pb = {
    authStore: {
        model: {
            get tenant() {
                const store = useAuthStore();
                return store.user?.tenant_id || 'plaza-mayor';
            }
        }
    },
    collection: (name: string) => {
        // Simple mapping for pocketbase collections to NestJS endpoints
        let endpoint = `/${name}`;
        if (name === 'espacios') endpoint = '/spaces';
        if (name === 'clientes') endpoint = '/clients';
        if (name === 'cotizaciones') endpoint = '/quotes';

        return {
            getFullList: async (options?: QueryParams): Promise<any[]> => {
                const res = await http.get(endpoint, { params: options });
                // If the NestJS API returns PaginatedResponse, we might need to extract data.
                // Assuming it returns an array for getFullList if no page/limit provided.
                return res.data?.data || res.data;
            },
            getList: async (page: number, limit: number, options?: QueryParams): Promise<PaginatedResponse<any>> => {
                const res = await http.get(endpoint, { params: { page, limit, ...options } });
                return res.data;
            },
            getOne: async (id: string, options?: any) => {
                const res = await http.get(`${endpoint}/${id}`, { params: options });
                return res.data;
            },
            update: async (id: string, data: any) => {
                const res = await http.put(`${endpoint}/${id}`, data);
                return res.data;
            },
            create: async (data: any) => {
                const res = await http.post(endpoint, data);
                return res.data;
            },
            delete: async (id: string) => {
                await http.delete(`${endpoint}/${id}`);
            }
        };
    }
};

export const getActiveUser = () => {
    const store = useAuthStore();
    return store.user;
};
