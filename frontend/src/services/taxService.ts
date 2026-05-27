import { http } from '../api/http';
import type { TaxConfiguration } from '../stores/taxStore';

export const taxService = {
    async getAll(): Promise<TaxConfiguration[]> {
        const res = await http.get('/taxes');
        return res.data?.data || res.data || [];
    },
    async create(data: TaxConfiguration): Promise<TaxConfiguration> {
        const res = await http.post('/taxes', data);
        return res.data;
    },
    async update(id: string, data: TaxConfiguration): Promise<TaxConfiguration> {
        const res = await http.put(`/taxes/${id}`, data);
        return res.data;
    },
    async remove(id: string): Promise<void> {
        await http.delete(`/taxes/${id}`);
    }
};
