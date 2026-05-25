/**
 * @module quoteStore
 * @description Pinia store for managing quotes and quote items.
 * Adheres to the 'Dumb Frontend' pattern: calculations and state transitions are deferred to the backend.
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { quoteService, type Quote, type QuoteItem } from '../services/quoteService';

export const useQuoteStore = defineStore('quote', () => {
    /** @type {import('vue').Ref<Quote[]>} The list of loaded quotes */
    const quotes = ref<Quote[]>([]);
    
    /** @type {import('vue').Ref<Quote | null>} The currently selected quote detailed view */
    const currentQuote = ref<Quote | null>(null);
    
    /** @type {import('vue').Ref<QuoteItem[]>} The items belonging to the current quote */
    const currentItems = ref<QuoteItem[]>([]);
    
    /** @type {import('vue').Ref<boolean>} Indicates if a network request is in progress */
    const loading = ref(false);
    
    /** @type {import('vue').Ref<string | null>} Stores the last error message, if any */
    const error = ref<string | null>(null);

    /**
     * Fetches all quotes from the backend and updates the store state.
     * @returns {Promise<void>}
     */
    const fetchQuotes = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await quoteService.getQuotes();
            quotes.value = res.data;
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetches a specific quote by its ID, along with its associated items.
     * 
     * @param {string} id - The ID of the quote to fetch
     * @returns {Promise<void>}
     */
    const fetchQuote = async (id: string) => {
        loading.value = true;
        try {
            currentQuote.value = await quoteService.getQuoteById(id);
            currentItems.value = await quoteService.getQuoteItems(id);
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Creates a new quote and adds it to the state list.
     * 
     * @param {Partial<Quote>} quote - The partial quote object to create
     * @returns {Promise<Quote>} The newly created quote
     */
    const addQuote = async (quote: Partial<Quote>) => {
        const newQuote = await quoteService.createQuote(quote);
        quotes.value = [newQuote, ...quotes.value];
        return newQuote;
    };

    /**
     * Refreshes the `currentQuote` from the backend to obtain the newly calculated sealed payload.
     * Adheres to the Dumb Frontend constraint: The UI should NOT calculate anything.
     * 
     * @private
     * @returns {Promise<void>}
     */
    const refreshSealedPayload = async () => {
        if (!currentQuote.value) return;
        // The UI should NOT calculate anything. We request the sealed payload from the Backend.
        // For now, we simulate fetching the updated quote from the backend.
        currentQuote.value = await quoteService.getQuoteById(currentQuote.value.id!);
    };

    /**
     * Saves a new or existing quote item to the backend and triggers a payload refresh.
     * 
     * @param {Partial<QuoteItem>} item - The item to save
     * @returns {Promise<QuoteItem>} The saved item returned by the backend
     */
    const saveItem = async (item: Partial<QuoteItem>) => {
        const saved = await quoteService.saveQuoteItem(item);
        if (!item.id) {
            currentItems.value.push(saved);
        } else {
            const index = currentItems.value.findIndex((i: QuoteItem) => i.id === saved.id);
            if (index !== -1) currentItems.value[index] = saved;
        }
        
        await refreshSealedPayload();
        return saved;
    };

    /**
     * Removes an item from the current quote and updates the backend.
     * 
     * @param {string} id - The ID of the quote item to remove
     * @returns {Promise<void>}
     */
    const removeItem = async (id: string) => {
        await quoteService.deleteQuoteItem(id);
        currentItems.value = currentItems.value.filter((i: QuoteItem) => i.id !== id);
        await refreshSealedPayload();
    };

    /**
     * Requests a transition in the quote's status from the backend state machine.
     * 
     * @param {string} id - The quote ID
     * @param {string} _oldStatus - The current status (unused by the backend but kept for signature)
     * @param {string} newStatus - The targeted new status
     * @param {string} _userId - The ID of the user requesting the change
     * @returns {Promise<void>}
     */
    const changeQuoteStatus = async (id: string, _oldStatus: string, newStatus: string, _userId: string) => {
        // Enviar la intención de transición al backend (Dumb Frontend)
        const updatedQuote = await quoteService.transitionStatus(id, newStatus, "Manual UI Change");
        
        if (currentQuote.value && currentQuote.value.id === id) {
            currentQuote.value = updatedQuote;
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
