import { defineStore } from 'pinia';
import { ref } from 'vue';
import { clientService } from '../services/clientService';
import type { Client } from '../services/clientService';

export const useClientStore = defineStore('client', () => {
    const clients = ref<Client[]>([]);
    const currentClient = ref<Client | null>(null);
    const loading = ref(false);

    async function fetchClients() {
        loading.value = true;
        try {
            clients.value = await clientService.getAll();
        } catch (err) {
            console.error("Error fetching clients:", err instanceof Error ? err.message : 'Unknown error');
            clients.value = [];
        } finally {
            loading.value = false;
        }
    }

    async function fetchClientById(id: string) {
        loading.value = true;
        try {
            currentClient.value = await clientService.getById(id);
        } catch (err) {
            console.error("Error fetching client by id:", err instanceof Error ? err.message : 'Unknown error');
            currentClient.value = null;
        } finally {
            loading.value = false;
        }
    }

    async function saveClient(clientData: Partial<Client>) {
        loading.value = true;
        try {
            const record = await clientService.create(clientData);
            await fetchClients(); // Refresh list
            return record;
        } catch (err) {
            console.error("Error saving client:", err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { clients, currentClient, loading, fetchClients, fetchClientById, saveClient };
});