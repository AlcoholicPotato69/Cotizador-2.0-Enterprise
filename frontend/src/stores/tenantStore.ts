import { defineStore } from 'pinia';
import { ref } from 'vue';
import { tenantService, type Tenant } from '../services/tenantService';
import type { User } from '../types/user';

export const useTenantStore = defineStore('tenant', () => {
    const activeTenant = ref<Tenant | null>(null);
    const activeTenantSlug = ref<'plaza-mayor' | 'casa-piedra' | null>(null);

    async function syncWithUser(user: User | null) {
        if (!user || !user.tenant_id) {
            clearTenant();
            return;
        }
        const tenant = await tenantService.getTenantById(user.tenant_id);
        if (tenant) {
            activeTenant.value = tenant;
            activeTenantSlug.value = tenant.name.toLowerCase().includes('plaza') ? 'plaza-mayor' : 'casa-piedra';
            document.documentElement.setAttribute('data-tenant', activeTenantSlug.value);
        }
    }

    function clearTenant() {
        activeTenant.value = null;
        activeTenantSlug.value = null;
        document.documentElement.removeAttribute('data-tenant');
    }

    return { activeTenant, activeTenantSlug, syncWithUser, clearTenant };
});
