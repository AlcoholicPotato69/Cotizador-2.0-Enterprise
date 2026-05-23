import { pb } from './pb';

export const clientService = {
    async getClients() {
        return await pb.collection('clientes').getFullList({
            sort: '-created',
        });
    },
    async getClientById(id: string) {
        return await pb.collection('clientes').getOne(id);
    },
    async createClient(data: any) {
        // Ensure tenant is attached
        if (!data.tenant_id && pb.authStore.model?.tenant_id) {
            data.tenant_id = pb.authStore.model.tenant_id;
        }
        return await pb.collection('clientes').create(data);
    },
    async updateClient(id: string, data: any) {
        return await pb.collection('clientes').update(id, data);
    }
};
