import { defineStore } from 'pinia';
import { ref } from 'vue';
import { tenantService } from '../services/tenantService';

export const useTenantStore = defineStore('tenant', () => {
    const activeTenant = ref<any>(null); // Real Tenant data
    const activeTenantSlug = ref<'pm' | 'cp' | null>(null);

    async function syncWithUser(user: any) {
        if (!user || !user.tenant_id) {
            clearTenant();
            return;
        }
        const tenant = await tenantService.getTenantById(user.tenant_id);
        if (tenant) {
            activeTenant.value = tenant;
            // Map tenant.name to slug logic or if tenant.slug exists
            activeTenantSlug.value = tenant.name.toLowerCase().includes('plaza') ? 'pm' : 'cp';
            
            // Set body class for Theme Engine
            document.body.classList.remove('tenant-pm', 'tenant-cp');
            document.body.classList.add(`tenant-${activeTenantSlug.value}`);
        }
    }

    function clearTenant() {
        activeTenant.value = null;
        activeTenantSlug.value = null;
        document.body.classList.remove('tenant-pm', 'tenant-cp');
    }

    return { activeTenant, activeTenantSlug, syncWithUser, clearTenant };
});
