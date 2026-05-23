import { defineStore } from 'pinia';
import { ref } from 'vue';
import { clientService } from '../services/clientService';

export const useClientStore = defineStore('client', () => {
    const clients = ref<any[]>([]);
    const currentClient = ref<any>(null);
    const loading = ref(false);

    async function fetchClients() {
        loading.value = true;
        try {
            const records = await clientService.getClients();
            clients.value = records.map(r => ({
                id: r.id,
                type: 'moral', 
                rfc: r.rfc,
                name: r.razon_social,
                status: r.status_validacion,
                createdAt: r.created
            }));
        } catch (err) {
            console.error("Error fetching clients:", err);
            clients.value = [];
        } finally {
            loading.value = false;
        }
    }

    async function fetchClientById(id: string) {
        loading.value = true;
        try {
            const record = await clientService.getClientById(id);
            currentClient.value = { 
                id: record.id, 
                type: 'moral', 
                rfc: record.rfc, 
                name: record.razon_social, 
                status: record.status_validacion, 
                email: record.contacto, 
                phone: '' 
            };
        } catch (err) {
            console.error("Error fetching client by id:", err);
            currentClient.value = null;
        } finally {
            loading.value = false;
        }
    }

    async function saveClient(clientData: any) {
        loading.value = true;
        try {
            const payload = {
                razon_social: clientData.name,
                rfc: clientData.rfc,
                contacto: clientData.email || '',
                status_validacion: 'pendiente'
            };
            const record = await clientService.createClient(payload);
            await fetchClients(); // Refresh list
            return record;
        } catch (err) {
            console.error("Error saving client:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { clients, currentClient, loading, fetchClients, fetchClientById, saveClient };
});