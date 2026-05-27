import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types/user';

const toDotNotation = (permission: string): string => permission.replace(/:/g, '.');
const toColonNotation = (permission: string): string => permission.replace(/\./g, ':');

const expandPermissionAliases = (permission: string): string[] => {
  const normalized = permission.trim();
  if (!normalized) {
    return [];
  }

  return [normalized, toDotNotation(normalized), toColonNotation(normalized)];
};

const normalizePermissionCollection = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  const permissionSet = new Set<string>();

  for (const permission of raw) {
    if (typeof permission !== 'string') {
      continue;
    }

    for (const alias of expandPermissionAliases(permission)) {
      permissionSet.add(alias);
    }
  }

  return Array.from(permissionSet);
};

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<string[]>([]);

  function syncWithUser(user: User | null): void {
    if (!user) {
      clearPermissions();
      return;
    }

    const userPermissions = normalizePermissionCollection(user.permissions ?? []);
    const effectivePermissions = normalizePermissionCollection(user.effective_permissions ?? []);
    const mergedPermissions = new Set<string>([...userPermissions, ...effectivePermissions]);

    permissions.value = Array.from(mergedPermissions);
  }

  function clearPermissions(): void {
    permissions.value = [];
  }

  function hasPermission(permission: string): boolean {
    return expandPermissionAliases(permission).some((variant) => permissions.value.includes(variant));
  }

  function can(permission: string): boolean {
    return hasPermission(permission);
  }

  function canAny(permissionList: string[]): boolean {
    return permissionList.some((permission) => hasPermission(permission));
  }

  function canAll(permissionList: string[]): boolean {
    return permissionList.every((permission) => hasPermission(permission));
  }

  function getEffectivePermissions(): string[] {
    return [...permissions.value];
  }

  async function loadPermissions(user: User | null): Promise<void> {
    syncWithUser(user);
  }

  return {
    permissions,
    syncWithUser,
    clearPermissions,
    can,
    canAny,
    canAll,
    hasPermission,
    getEffectivePermissions,
    loadPermissions,
  };
});
