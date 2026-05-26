import { http } from '../api/http';
import type { PaginatedResponse, QueryParams } from './types';

export interface Contract {
    id: string;
    quoteId: string;
    clientId: string;
    currencyCode: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export const contractService = {
    async getContracts(params?: QueryParams): Promise<PaginatedResponse<Contract> | Contract[]> {
        const res = await http.get('/contracts', { params });
        return res.data;
    },
    
    async getContractById(id: string): Promise<Contract> {
        const res = await http.get(`/contracts/${id}`);
        return res.data;
    },
    
    async createContract(data: Partial<Contract>): Promise<Contract> {
        const res = await http.post('/contracts', data);
        return res.data.data || res.data;
    },
    
    async transitionStatus(id: string, status: string, reason?: string): Promise<Contract> {
        const res = await http.put(`/contracts/${id}/status`, { status, reason });
        return res.data.data || res.data;
    },
    
    async getContractHistory(id: string): Promise<any[]> {
        const contract = await this.getContractById(id);
        return contract?.history || [];
    }
};
