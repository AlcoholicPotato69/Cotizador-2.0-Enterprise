import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { tenantService, type Tenant } from '../services/tenantService';
import type { User } from '../types/user';

const TENANT_STORAGE_KEY = 'active_tenant_id';

const applyTenantToDom = (tenantId: string | null): void => {
  if (!tenantId) {
    document.documentElement.removeAttribute('data-tenant');
    return;
  }

  document.documentElement.setAttribute('data-tenant', tenantId);
};

export const useTenantStore = defineStore('tenant', () => {
  const activeTenant = ref<Tenant | null>(null);
  const availableTenants = ref<Tenant[]>([]);
  const storedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);
  const activeTenantId = ref<string | null>(storedTenantId);

  const currentTenant = computed<Tenant | null>(() => activeTenant.value);

  function persistTenant(tenantId: string | null): void {
    activeTenantId.value = tenantId;

    if (!tenantId) {
      localStorage.removeItem(TENANT_STORAGE_KEY);
      return;
    }

    localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
  }

  async function setActiveTenant(tenantId: string): Promise<void> {
    const tenantFromList = availableTenants.value.find((tenantRecord) => tenantRecord.id === tenantId) ?? null;
    const resolvedTenant = tenantFromList ?? await tenantService.getTenantById(tenantId);

    if (!resolvedTenant) {
      return;
    }

    activeTenant.value = resolvedTenant;
    persistTenant(resolvedTenant.id);
    applyTenantToDom(resolvedTenant.id);
    window.dispatchEvent(new CustomEvent('tenant-changed', { detail: resolvedTenant }));
  }

  async function syncWithUser(user: User | null): Promise<void> {
    if (!user?.tenant_id) {
      clearTenant();
      return;
    }

    availableTenants.value = await tenantService.getAccessibleTenants();
    const tenantIdToLoad = activeTenantId.value ?? user.tenant_id;

    await setActiveTenant(tenantIdToLoad);

    const hasActiveTenantInList = activeTenant.value
      ? availableTenants.value.some((tenantRecord) => tenantRecord.id === activeTenant.value?.id)
      : false;

    if (!hasActiveTenantInList && activeTenant.value) {
      availableTenants.value.unshift(activeTenant.value);
    }
  }

  async function cycleTenant(): Promise<void> {
    if (availableTenants.value.length <= 1) {
      return;
    }

    const currentTenantIndex = availableTenants.value.findIndex(
      (tenantRecord) => tenantRecord.id === activeTenant.value?.id,
    );
    const nextTenantIndex = (currentTenantIndex + 1) % availableTenants.value.length;
    const nextTenant = availableTenants.value[nextTenantIndex];

    await setActiveTenant(nextTenant.id);
  }

  function clearTenant(): void {
    activeTenant.value = null;
    availableTenants.value = [];
    persistTenant(null);
    applyTenantToDom(null);
  }

  return {
    activeTenant,
    availableTenants,
    currentTenant,
    setActiveTenant,
    syncWithUser,
    cycleTenant,
    clearTenant,
  };
});
