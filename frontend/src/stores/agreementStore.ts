import { defineStore } from 'pinia';
import { ref } from 'vue';
import { agreementService, type Agreement } from '../services/agreementService';

export const useAgreementStore = defineStore('agreement', () => {
    const agreements = ref<Agreement[]>([]);
    const currentAgreement = ref<Agreement | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAgreements = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await agreementService.getAgreements();
            agreements.value = Array.isArray(res) ? res : (res as any).data || [];
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            loading.value = false;
        }
    };

    const fetchAgreement = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            currentAgreement.value = await agreementService.getAgreementById(id);
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            loading.value = false;
        }
    };

    const addAgreement = async (agreement: Partial<Agreement>) => {
        const newAgreement = await agreementService.createAgreement(agreement);
        agreements.value = [newAgreement, ...agreements.value];
        return newAgreement;
    };

    const changeAgreementStatus = async (id: string, newStatus: string, reason?: string) => {
        const updated = await agreementService.transitionStatus(id, newStatus, reason);
        if (currentAgreement.value?.id === id) {
            currentAgreement.value = updated;
        }
        const index = agreements.value.findIndex(a => a.id === id);
        if (index !== -1) {
            agreements.value[index] = updated;
        }
        return updated;
    };

    return {
        agreements,
        currentAgreement,
        loading,
        error,
        fetchAgreements,
        fetchAgreement,
        addAgreement,
        changeAgreementStatus
    };
});
