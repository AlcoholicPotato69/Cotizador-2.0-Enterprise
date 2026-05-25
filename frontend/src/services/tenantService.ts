import { http } from '../api/http';

export interface Tenant {
    id: string;
    name: string;
    domain?: string;
    config?: Record<string, any>;
}

export const tenantService = {
    async getTenantById(id: string): Promise<Tenant | null> {
        if (!id) return null;
        try {
            const res = await http.get(`/tenants/${id}`);
            return res.data.data || res.data;
        } catch (err) {
            console.error("Error fetching tenant", err);
            return null;
        }
    }
};
