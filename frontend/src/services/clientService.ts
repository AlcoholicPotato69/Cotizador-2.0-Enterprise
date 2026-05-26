import { http } from '../api/http';

export interface Client {
    id: string;
    tenantId: string;
    name: string;
    email?: string;
    phone?: string;
    rfc?: string;
    status: string;
    bankReference?: string;
    isTaxValidated: boolean;
    isContractBlocked: boolean;
    isInvoiceBlocked: boolean;
    isPaymentBlocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ClientEligibilityTransactionType =
  | 'QUOTE_CREATION'
  | 'CONTRACT_GENERATION'
  | 'INVOICE_GENERATION'
  | 'PAYMENT_PROCESSING';

export interface ClientEligibilityResult {
    clientId: string;
    transactionType: ClientEligibilityTransactionType;
    eligible: boolean;
    reasons: string[];
}

export const clientService = {
    async getAll(): Promise<Client[]> {
        const res = await http.get('/clients');
        return res.data.data || res.data;
    },
    async getById(id: string): Promise<Client> {
        const res = await http.get(`/clients/${id}`);
        return res.data.data || res.data;
    },
    async create(data: Partial<Client>): Promise<Client> {
        const res = await http.post('/clients', data);
        return res.data.data || res.data;
    },
    async update(id: string, data: Partial<Client>): Promise<Client> {
        const res = await http.put(`/clients/${id}`, data);
        return res.data.data || res.data;
    },
    async remove(id: string): Promise<void> {
        await http.delete(`/clients/${id}`);
    },
    async evaluateEligibility(
        clientId: string,
        transactionType: ClientEligibilityTransactionType,
    ): Promise<ClientEligibilityResult> {
        const res = await http.get(
            `/clients/${clientId}/eligibility/${transactionType}`,
        );
        return res.data.data || res.data;
    }
};
