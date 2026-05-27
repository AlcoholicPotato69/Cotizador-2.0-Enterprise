import { defineStore } from 'pinia';
import { ref } from 'vue';
import { contractService, type Contract } from '../services/contractService';

export const useContractStore = defineStore('contract', () => {
    const contracts = ref<Contract[]>([]);
    const currentContract = ref<Contract | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchContracts = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await contractService.getContracts();
            // Handle both paginated and direct array responses
            contracts.value = Array.isArray(res) ? res : (res as any).data || [];
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            loading.value = false;
        }
    };

    const fetchContract = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            currentContract.value = await contractService.getContractById(id);
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : String(err);
        } finally {
            loading.value = false;
        }
    };

    const addContract = async (contract: Partial<Contract>) => {
        const newContract = await contractService.createContract(contract);
        contracts.value = [newContract, ...contracts.value];
        return newContract;
    };

    const changeContractStatus = async (id: string, newStatus: string, reason?: string) => {
        const updated = await contractService.transitionStatus(id, newStatus, reason);
        if (currentContract.value?.id === id) {
            currentContract.value = updated;
        }
        const index = contracts.value.findIndex(c => c.id === id);
        if (index !== -1) {
            contracts.value[index] = updated;
        }
        return updated;
    };

    return {
        contracts,
        currentContract,
        loading,
        error,
        fetchContracts,
        fetchContract,
        addContract,
        changeContractStatus
    };
});
