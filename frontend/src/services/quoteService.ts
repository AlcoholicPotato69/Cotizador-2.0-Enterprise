import { http } from '../api/http';

export interface Quote {
    id?: string;
    tenant_id: string;
    client_id: string;
    created_by?: string;
    folio?: string;
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'expired' | 'converted';
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
    valid_until?: string;
    notes?: string;
    current_version?: number;
    created?: string;
    updated?: string;
}

export interface QuoteItem {
    id?: string;
    quote_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    type: 'space' | 'service' | 'product' | 'discount';
}

export const quoteService = {
    async getQuotes() {
        const res = await http.get('/quotes');
        return res.data;
    },

    async getQuoteById(id: string) {
        const res = await http.get(`/quotes/${id}`);
        return res.data;
    },

    async createQuote(quote: Partial<Quote>) {
        const res = await http.post('/quotes', quote);
        return res.data;
    },

    async updateQuote(id: string, updates: Partial<Quote>, bumpVersion: boolean = false, changeNotes: string = "") {
        const headers: Record<string, string> = {};
        if (bumpVersion) {
            headers['X-Bump-Version'] = 'true';
            headers['X-Change-Notes'] = changeNotes;
        }
        const res = await http.patch(`/quotes/${id}`, updates, { headers });
        return res.data;
    },

    async getQuoteItems(quoteId: string) {
        const res = await http.get(`/quotes/${quoteId}/items`);
        return res.data;
    },

    async saveQuoteItem(item: Partial<QuoteItem>) {
        if (item.id) {
            const res = await http.patch(`/quotes/${item.quote_id}/items/${item.id}`, item);
            return res.data;
        } else {
            const res = await http.post(`/quotes/${item.quote_id}/items`, item);
            return res.data;
        }
    },

    async deleteQuoteItem(itemId: string, quoteId?: string) {
        // Assume backend requires quoteId to access items, we pass it or the URL is flattened
        const url = quoteId ? `/quotes/${quoteId}/items/${itemId}` : `/quote-items/${itemId}`;
        const res = await http.delete(url);
        return res.data;
    },

    async getQuoteVersions(quoteId: string) {
        const res = await http.get(`/quotes/${quoteId}/versions`);
        return res.data;
    },

    async getQuoteHistory(quoteId: string) {
        const res = await http.get(`/quotes/${quoteId}/history`);
        return res.data;
    },

    async transitionStatus(quoteId: string, newStatus: string, reason: string = "") {
        const res = await http.post(`/quotes/${quoteId}/transition`, { newStatus, reason });
        return res.data;
    }
};
