import { pb } from './pb';

/**
 * Document Foundation Layer
 * Handles uploading, downloading, and tracking documents securely using PocketBase.
 * Implements the Provider Pattern implicitly by supporting different file types as providers.
 */
export const documentService = {
    async getDocumentsByClient(clientId: string) {
        return await pb.collection('documents').getFullList({
            filter: `client_id = "${clientId}"`,
            sort: '-created'
        });
    },

    async uploadDocument(clientId: string, file: File, provider: 'pdf' | 'image' | 'xml') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('client_id', clientId);
        formData.append('provider', provider);
        formData.append('status', 'valid'); // Default for now
        
        // Ensure tenant is attached
        if (pb.authStore.model?.tenant_id) {
            formData.append('tenant_id', pb.authStore.model.tenant_id);
        }

        // Generate robust crypto hash using Web Crypto API
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        formData.append('hash', hashHex);
        formData.append('legal_hold', 'false');

        return await pb.collection('documents').create(formData);
    },

    async downloadDocument(recordId: string, filename: string) {
        const url = pb.files.getURL({ id: recordId, collectionId: 'documents', collectionName: 'documents' } as any, filename);
        // Utility to download
        window.open(url, '_blank');
        return url;
    },

    async setLegalHold(documentId: string, hold: boolean) {
        return await pb.collection('documents').update(documentId, { legal_hold: hold });
    }
};
