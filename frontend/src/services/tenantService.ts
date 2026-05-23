import { pb } from './pb';

export const tenantService = {
    async getTenantById(id: string) {
        if (!id) return null;
        try {
            return await pb.collection('tenants').getOne(id);
        } catch (err) {
            console.error("Error fetching tenant", err);
            return null;
        }
    }
};
