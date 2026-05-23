import { defineStore } from 'pinia';
import { ref } from 'vue';
import { calculateEffectivePermissions } from '../utils/EffectivePermissionsEngine';
import { pb } from '../services/pb';
import { useTenantStore } from './tenant';

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<Set<string>>(new Set());
  const isLoading = ref(false);

  const loadPermissions = async () => {
    if (!pb.authStore.isValid || !pb.authStore.model) return;
    
    const tenantStore = useTenantStore();
    if (!tenantStore.activeTenantId) return;

    isLoading.value = true;
    try {
      const permsSet = await calculateEffectivePermissions({
        userId: pb.authStore.model.id,
        tenantId: tenantStore.activeTenantId
      });
      permissions.value = permsSet.permissions;
    } finally {
      isLoading.value = false;
    }
  };

  const clearPermissions = () => {
    permissions.value.clear();
  };

  /** Evalúa si el usuario tiene un permiso específico */
  const can = (permissionKey: string): boolean => {
    return permissions.value.has(permissionKey);
  };

  /** Evalúa si el usuario tiene al menos UNO de los permisos solicitados */
  const canAny = (permissionKeys: string[]): boolean => {
    return permissionKeys.some(key => permissions.value.has(key));
  };

  /** Evalúa si el usuario tiene TODOS los permisos solicitados */
  const canAll = (permissionKeys: string[]): boolean => {
    return permissionKeys.every(key => permissions.value.has(key));
  };

  const getEffectivePermissions = (): string[] => {
    return Array.from(permissions.value);
  };

  return {
    permissions,
    isLoading,
    loadPermissions,
    clearPermissions,
    can,
    canAny,
    canAll,
    getEffectivePermissions
  };
});
