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

    const refreshSealedPayload = async () => {
        if (!currentQuote.value) return;
        // The UI should NOT calculate anything. We request the sealed payload from the Backend.
        // For now, we simulate fetching the updated quote from the backend.
        currentQuote.value = await quoteService.getQuoteById(currentQuote.value.id!) as unknown as Quote;
    };

    const saveItem = async (item: Partial<QuoteItem>) => {
        const saved = await quoteService.saveQuoteItem(item) as unknown as QuoteItem;
        if (!item.id) {
            currentItems.value.push(saved);
        } else {
            const index = currentItems.value.findIndex((i: QuoteItem) => i.id === saved.id);
            if (index !== -1) currentItems.value[index] = saved;
        }
        
        await refreshSealedPayload();
        return saved;
    };

    const removeItem = async (id: string) => {
        await quoteService.deleteQuoteItem(id);
        currentItems.value = currentItems.value.filter((i: QuoteItem) => i.id !== id);
        await refreshSealedPayload();
    };

    const changeQuoteStatus = async (id: string, oldStatus: string, newStatus: string, userId: string) => {
        // Enviar la intención de transición al backend (Dumb Frontend)
        const updatedQuote = await quoteService.transitionStatus(id, newStatus, "Manual UI Change");
        
        if (currentQuote.value && currentQuote.value.id === id) {
            currentQuote.value = updatedQuote as unknown as Quote;
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
