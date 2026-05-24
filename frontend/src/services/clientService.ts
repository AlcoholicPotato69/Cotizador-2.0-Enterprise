import { http } from '../api/http';

export const clientService = {
    async getClients() {
        const res = await http.get('/clients');
        return res.data;
    },
    async getClientById(id: string) {
        const res = await http.get(`/clients/${id}`);
        return res.data;
    },
    async createClient(data: any) {
        // Tenant is automatically handled by the HTTP interceptor
        const res = await http.post('/clients', data);
        return res.data;
    },
    async updateClient(id: string, data: any) {
        const res = await http.patch(`/clients/${id}`, data);
        return res.data;
    }
};
