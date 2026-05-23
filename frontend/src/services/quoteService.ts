import { pb } from '../services/pb';

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
        return await pb.collection('quotes').getFullList({ sort: '-created' });
    },

    async getQuoteById(id: string) {
        return await pb.collection('quotes').getOne(id);
    },

    async createQuote(quote: Partial<Quote>) {
        return await pb.collection('quotes').create(quote);
    },

    async updateQuote(id: string, updates: Partial<Quote>, bumpVersion: boolean = false, changeNotes: string = "") {
        const headers: Record<string, string> = {};
        if (bumpVersion) {
            headers['X-Bump-Version'] = 'true';
            headers['X-Change-Notes'] = changeNotes;
        }
        return await pb.collection('quotes').update(id, updates, { headers });
    },

    async getQuoteItems(quoteId: string) {
        return await pb.collection('quote_items').getFullList({
            filter: `quote_id = "${quoteId}"`,
            sort: 'created'
        });
    },

    async saveQuoteItem(item: Partial<QuoteItem>) {
        if (item.id) {
            return await pb.collection('quote_items').update(item.id, item);
        } else {
            return await pb.collection('quote_items').create(item);
        }
    },

    async deleteQuoteItem(itemId: string) {
        return await pb.collection('quote_items').delete(itemId);
    },

    async getQuoteVersions(quoteId: string) {
        return await pb.collection('quote_versions').getFullList({
            filter: `quote_id = "${quoteId}"`,
            sort: '-version_number'
        });
    },

    async getQuoteHistory(quoteId: string) {
        return await pb.collection('quote_status_history').getFullList({
            filter: `quote_id = "${quoteId}"`,
            sort: '-created'
        });
    },

    async createQuoteHistory(historyData: any) {
        return await pb.collection('quote_status_history').create(historyData);
    }
};
