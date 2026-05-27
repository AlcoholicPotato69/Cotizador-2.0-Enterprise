import { usePermissionsStore } from '../stores/permissionsStore';
import { useTenantStore } from '../stores/tenantStore';
import { useFeatureFlagStore } from '../stores/featureFlagStore';
import type { Tenant } from '../services/tenantService';

export function hasPermission(permission: string | string[]): boolean {
  const permissionsStore = usePermissionsStore();
  return Array.isArray(permission)
    ? permissionsStore.canAny(permission)
    : permissionsStore.hasPermission(permission);
}

export function currentTenant(): Tenant | null {
  const tenantStore = useTenantStore();
  return tenantStore.currentTenant;
}

export function featureFlags(featureKey?: string, fallback = false): boolean | Record<string, boolean> {
  const featureFlagStore = useFeatureFlagStore();
  if (!featureKey) {
    return featureFlagStore.snapshot;
  }

  return featureFlagStore.isEnabled(featureKey, fallback);
}
