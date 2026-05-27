import { http } from '../api/http';
import type { PaginatedResponse, QueryParams } from './types';

export interface Agreement {
    id: string;
    contractId: string;
    clientName: string;
    type: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export const agreementService = {
    async getAgreements(params?: QueryParams): Promise<PaginatedResponse<Agreement> | Agreement[]> {
        const res = await http.get('/agreements', { params });
        return res.data;
    },
    
    async getAgreementById(id: string): Promise<Agreement> {
        const res = await http.get(`/agreements/${id}`);
        return res.data;
    },
    
    async createAgreement(data: Partial<Agreement>): Promise<Agreement> {
        const res = await http.post('/agreements', data);
        return res.data;
    },
    
    async transitionStatus(id: string, action: string, payload: any = {}): Promise<Agreement> {
        // generic mapper
        switch (action) {
            case 'submit-review': return (await http.put(`/agreements/${id}/submit-review`)).data;
            case 'approve': return (await http.put(`/agreements/${id}/approve`)).data;
            case 'generate-letter': return (await http.put(`/agreements/${id}/generate-letter`, payload)).data;
            case 'pending-signature': return (await http.put(`/agreements/${id}/pending-signature`)).data;
            case 'sign': return (await http.put(`/agreements/${id}/sign`, payload)).data;
            default: throw new Error(`Unknown action ${action}`);
        }
    },
    
    async getAgreementHistory(id: string): Promise<any[]> {
        const res = await http.get(`/agreements/${id}/history`);
        return res.data;
    }
};
