import { computed } from 'vue';
import { getActiveUser } from '../services/pb';

/**
 * @module useRBAC
 * @description Vue composable for evaluating granular application permissions.
 * Follows the "Permission-First Architecture" pattern. 
 * Resolves privileges exclusively against `effective_permissions` rather than explicit role names, ensuring flexible and scalable access control.
 * 
 * @returns {Object} Methods and computed properties for evaluating user privileges.
 */
export function useRBAC() {
  const user = getActiveUser();

  /**
   * @type {import('vue').ComputedRef<string[]>}
   * @description Reactively provides the array of permissions assigned to the current active user.
   */
  const effectivePermissions = computed<string[]>(() => {
    return user?.effective_permissions || [];
  });

  /**
   * Checks if the active user possesses a specific permission.
   * Note: The `system.full_access` permission acts as a universal override.
   * 
   * @param {string} permission - The exact string identifier from the Permission Registry (e.g. 'quotes.create')
   * @returns {boolean} True if the user possesses the requested permission or universal override
   */
  const hasPermission = (permission: string): boolean => {
    const perms = effectivePermissions.value;
    if (!perms || !Array.isArray(perms)) return false;

    // Super user override
    if (perms.includes('system.full_access')) return true;

    return perms.includes(permission);
  };

  /**
   * Checks if the active user possesses ANY of the provided permissions (logical OR).
   * 
   * @param {string[]} permissions - An array of permission strings to check against
   * @returns {boolean} True if the user possesses at least one of the listed permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  /**
   * Checks if the active user possesses ALL of the provided permissions (logical AND).
   * 
   * @param {string[]} permissions - An array of permission strings to check against
   * @returns {boolean} True if the user possesses every single listed permission
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
