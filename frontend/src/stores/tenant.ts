import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { pb } from '../services/pb';

export const useTenantStore = defineStore('tenant', () => {
    const activeTenantId = ref<string | null>(null);
    const availableTenants = ref<any[]>([]);

    const fetchTenants = async () => {
        if (!pb.authStore.isValid) return;
        try {
            // Fetch tenants allowed for the user
            const records = await pb.collection('tenants').getFullList();
            availableTenants.value = records;
            
            // Set default if none selected
            if (!activeTenantId.value && records.length > 0) {
                activeTenantId.value = records[0].id;
            }
        } catch (e) {
            console.error('Error fetching tenants', e);
        }
    };

    const setActiveTenant = (id: string) => {
        if (availableTenants.value.find(t => t.id === id)) {
            activeTenantId.value = id;
        }
    };

    const activeTenant = computed(() => {
        return availableTenants.value.find(t => t.id === activeTenantId.value) || null;
    });

    const isPlazaMayor = computed(() => activeTenant.value?.slug === 'plaza_mayor');
    const isCasaDePiedra = computed(() => activeTenant.value?.slug === 'casa_de_piedra');

    return {
        activeTenantId,
        availableTenants,
        activeTenant,
        isPlazaMayor,
        isCasaDePiedra,
        fetchTenants,
        setActiveTenant
    };
});
