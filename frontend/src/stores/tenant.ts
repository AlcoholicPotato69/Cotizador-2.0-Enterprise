import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { http } from '../api/http';

export const useTenantStore = defineStore('tenant', () => {
    const activeTenantId = ref<string | null>(null);
    const availableTenants = ref<any[]>([]);

    const fetchTenants = async () => {
        try {
            // Fetch tenants allowed for the user
            const res = await http.get('/tenants');
            availableTenants.value = res.data;
            
            // Set default if none selected
            if (!activeTenantId.value && res.data.length > 0) {
                activeTenantId.value = res.data[0].id;
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
