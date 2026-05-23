import { computed } from 'vue';
import { getActiveUser } from '../services/pb';

/**
 * Composable for evaluating permissions based on the Permission-First Architecture.
 * This reads ONLY from `effective_permissions`. It never checks role names.
 */
export function useRBAC() {
  const user = getActiveUser();

  const effectivePermissions = computed<string[]>(() => {
    return user?.effective_permissions || [];
  });

  /**
   * Checks if the user has a specific permission.
   * If the user has 'system.full_access', it always returns true.
   * 
   * @param permission The exact string from the Permission Registry (e.g. 'quotes.create')
   * @returns boolean
   */
  const hasPermission = (permission: string): boolean => {
    const perms = effectivePermissions.value;
    if (!perms || !Array.isArray(perms)) return false;

    // Super user override
    if (perms.includes('system.full_access')) return true;

    return perms.includes(permission);
  };

  /**
   * Checks if the user has ANY of the given permissions (OR logic).
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  /**
   * Checks if the user has ALL of the given permissions (AND logic).
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p));
  };

  return {
    effectivePermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
