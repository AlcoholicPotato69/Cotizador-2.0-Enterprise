import { defineStore } from 'pinia';
import { ref } from 'vue';
import { taxService } from '../services/taxService';

export interface TaxConfiguration {
    id?: string;
    taxName: string;
    taxRate: number; // Decimal (ej. 0.1600)
    validFrom: string; // ISO String
    validUntil?: string | null;
    isDefault: boolean;
}

export const useTaxStore = defineStore('tax', () => {
    const taxes = ref<TaxConfiguration[]>([]);
    const loading = ref(false);

    const fetchTaxes = async () => {
        loading.value = true;
        try {
            taxes.value = await taxService.getAll();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching taxes:', error.message);
            } else {
                console.error('Error fetching taxes:', error);
            }
            taxes.value = [];
        } finally {
            loading.value = false;
        }
    };

    const createTax = async (data: TaxConfiguration) => {
        const result = await taxService.create(data);
        await fetchTaxes();
        return result;
    };

    const updateTax = async (id: string, data: TaxConfiguration) => {
        const result = await taxService.update(id, data);
        await fetchTaxes();
        return result;
    };

    const deleteTax = async (id: string) => {
        await taxService.remove(id);
        await fetchTaxes();
    };

    return {
        taxes,
        loading,
        fetchTaxes,
        createTax,
        updateTax,
        deleteTax
    };
});
