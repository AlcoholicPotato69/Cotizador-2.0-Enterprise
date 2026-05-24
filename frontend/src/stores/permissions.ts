import { defineStore } from 'pinia';
import { ref } from 'vue';
import { http } from '../api/http';
import { useTenantStore } from './tenant';
import { useAuthStore } from './authStore';

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<Set<string>>(new Set());
  const isLoading = ref(false);

  const loadPermissions = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated || !authStore.user) return;
    
    const tenantStore = useTenantStore();
    if (!tenantStore.activeTenantId) return;

    isLoading.value = true;
    try {
      const res = await http.get(`/users/${authStore.user.id}/permissions`);
      permissions.value = new Set(res.data.permissions || []);
    } catch (e) {
      console.error(e);
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
