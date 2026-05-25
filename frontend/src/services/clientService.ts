import { http } from '../api/http';
import type { QueryParams, PaginatedResponse } from './types';

export interface Client {
    id: string;
    razon_social: string;
    rfc: string;
    contacto: string;
    status_validacion: string;
    created?: string;
}

export interface ClientPayload {
    razon_social?: string;
    rfc?: string;
    contacto?: string;
    status_validacion?: string;
    [key: string]: any;
}

export const clientService = {
    async getClients(params?: QueryParams): Promise<PaginatedResponse<Client>> {
        const res = await http.get('/clients', { params });
        return res.data;
    },
    async getClientById(id: string): Promise<Client> {
        const res = await http.get(`/clients/${id}`);
        return res.data;
    },
    async createClient(data: ClientPayload): Promise<Client> {
        // Tenant is automatically handled by the HTTP interceptor
        const res = await http.post('/clients', data);
        return res.data;
    },
    async updateClient(id: string, data: ClientPayload): Promise<Client> {
        const res = await http.patch(`/clients/${id}`, data);
        return res.data;
    }
};
