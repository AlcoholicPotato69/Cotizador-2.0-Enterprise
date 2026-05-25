import { http } from '../api/http';
import type { QueryParams, PaginatedResponse } from './types';

export const documentService = {
    async getDocumentsByClient(clientId: string, params?: QueryParams): Promise<PaginatedResponse<any>> {
        const res = await http.get(`/clients/${clientId}/documents`, { params });
        return res.data;
    },

    async uploadDocument(clientId: string, file: File, provider: 'pdf' | 'image' | 'xml') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('provider', provider);
        
        // Tenant is handled via interceptor header, but if multipart/form-data requires special handling 
        // we might leave it up to the interceptor or backend to infer from token.
        
        // Let's generate hash anyway
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        formData.append('hash', hashHex);

        const res = await http.post(`/clients/${clientId}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    async downloadDocument(recordId: string, _filename: string) {
        // Assume backend has an endpoint for download
        const url = `/api/v1/documents/${recordId}/download`; 
        window.open(url, '_blank');
        return url;
    },

    async setLegalHold(documentId: string, hold: boolean) {
        const res = await http.patch(`/documents/${documentId}/legal-hold`, { legal_hold: hold });
        return res.data;
    }
};
