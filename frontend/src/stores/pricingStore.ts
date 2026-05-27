import { defineStore } from 'pinia';
import { ref } from 'vue';
import { pricingService, type PricingRule } from '../services/pricingService';
import { useTenantStore } from './tenantStore';
import { useNotificationStore } from './notificationStore';

export const usePricingStore = defineStore('pricing', () => {
    const rules = ref<PricingRule[]>([]);
    const loading = ref(false);

    const tenantStore = useTenantStore();
    const notificationStore = useNotificationStore();

    const fetchRules = async () => {
        if (!tenantStore.activeTenant?.id) return;
        loading.value = true;
        try {
            rules.value = await pricingService.getActiveRules(tenantStore.activeTenant.id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching pricing rules:', error.message);
            } else {
                console.error('Error fetching pricing rules:', error);
            }
            rules.value = [];
        } finally {
            loading.value = false;
        }
    };

    const archiveRule = async (id: string) => {
        try {
            await pricingService.archiveRule(id);
            notificationStore.addNotification({ type: 'success', message: 'Regla archivada', domainEvent: 'UPDATE_SUCCESS' });
            await fetchRules();
        } catch (error: unknown) {
            notificationStore.addNotification({ type: 'error', message: 'Error archivando', domainEvent: 'UPDATE_ERROR' });
        }
    };

    return {
        rules,
        loading,
        fetchRules,
        archiveRule
    };
});
