import { defineStore } from 'pinia';
import { ref } from 'vue';
import { quoteService, type Quote, type QuoteItem } from '../services/quoteService';

export const useQuoteStore = defineStore('quote', () => {
    const quotes = ref<Quote[]>([]);
    const currentQuote = ref<Quote | null>(null);
    const currentItems = ref<QuoteItem[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchQuotes = async () => {
        loading.value = true;
        error.value = null;
        try {
            quotes.value = await quoteService.getQuotes() as unknown as Quote[];
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const fetchQuote = async (id: string) => {
        loading.value = true;
        try {
            currentQuote.value = await quoteService.getQuoteById(id) as unknown as Quote;
            currentItems.value = await quoteService.getQuoteItems(id) as unknown as QuoteItem[];
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const addQuote = async (quote: Partial<Quote>) => {
        const newQuote = await quoteService.createQuote(quote) as unknown as Quote;
        quotes.value = [newQuote, ...quotes.value];
        return newQuote;
    };

    const recalculateTotals = async () => {
        if (!currentQuote.value) return;
        
        let subtotal = 0;
        let discount = 0;
        
        currentItems.value.forEach((item: QuoteItem) => {
            if (item.type === 'discount') {
                discount += (item.total_price || 0);
            } else {
                subtotal += (item.total_price || 0);
            }
        });
        
        const taxableAmount = subtotal - discount;
        const tax = taxableAmount * 0.16; // Mexican VAT 16%
        const total = taxableAmount + tax;
        
        // Round to 2 decimals
        const subtotalRounded = Math.round(subtotal * 100) / 100;
        const taxRounded = Math.round(tax * 100) / 100;
        const totalRounded = Math.round(total * 100) / 100;
        
        await quoteService.updateQuote(currentQuote.value.id!, {
            subtotal: subtotalRounded,
            tax_amount: taxRounded,
            total_amount: totalRounded
        });
        
        currentQuote.value.subtotal = subtotalRounded;
        currentQuote.value.tax_amount = taxRounded;
        currentQuote.value.total_amount = totalRounded;
    };

    const saveItem = async (item: Partial<QuoteItem>) => {
        const saved = await quoteService.saveQuoteItem(item) as unknown as QuoteItem;
        if (!item.id) {
            currentItems.value.push(saved);
        } else {
            const index = currentItems.value.findIndex((i: QuoteItem) => i.id === saved.id);
            if (index !== -1) currentItems.value[index] = saved;
        }
        
        await recalculateTotals();
        return saved;
    };

    const removeItem = async (id: string) => {
        await quoteService.deleteQuoteItem(id);
        currentItems.value = currentItems.value.filter((i: QuoteItem) => i.id !== id);
        await recalculateTotals();
    };

    const changeQuoteStatus = async (id: string, oldStatus: string, newStatus: string, userId: string) => {
        await quoteService.updateQuote(id, { status: newStatus as any });
        
        await quoteService.createQuoteHistory({
            quote_id: id,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: userId,
            reason: "Manual UI Change"
        });
        
        if (currentQuote.value && currentQuote.value.id === id) {
            currentQuote.value.status = newStatus as any;
        }
    };

    return {
        quotes,
        currentQuote,
        currentItems,
        loading,
        error,
        fetchQuotes,
        fetchQuote,
        addQuote,
        saveItem,
        removeItem,
        changeQuoteStatus
    };
});
