import { http } from '../api/http';

export const tenantService = {
    async getTenantById(id: string) {
        if (!id) return null;
        try {
            const res = await http.get(`/tenants/${id}`);
            return res.data;
        } catch (err) {
            console.error("Error fetching tenant", err);
            return null;
        }
    }
};
