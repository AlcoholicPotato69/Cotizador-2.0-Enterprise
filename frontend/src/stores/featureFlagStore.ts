import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { featureFlagService } from '../services/featureFlagService';

interface LocalFeatureFlagState {
  enabled: boolean;
  rolloutPercentage: number;
  loadedAt: number;
}

const clampRollout = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return Math.floor(value);
};

const getDeterministicBucket = (key: string, tenantId: string): number => {
  const seed = `${tenantId}:${key}`;
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash) % 100;
};

export const useFeatureFlagStore = defineStore('feature-flags', () => {
  const flags = ref<Record<string, LocalFeatureFlagState>>({});
  const currentTenantId = ref<string | null>(null);

  async function loadFeatureFlag(featureKey: string, forceReload = false): Promise<void> {
    if (!featureKey) {
      return;
    }

    if (!forceReload && flags.value[featureKey]) {
      return;
    }

    const remoteFlag = await featureFlagService.getFeatureFlag(featureKey);

    if (!remoteFlag) {
      return;
    }

    flags.value[featureKey] = {
      enabled: remoteFlag.enabled,
      rolloutPercentage: clampRollout(remoteFlag.rolloutPercentage),
      loadedAt: Date.now(),
    };
  }

  function isEnabled(featureKey: string, fallback = false): boolean {
    const flag = flags.value[featureKey];
    if (!flag) {
      return fallback;
    }

    if (!flag.enabled) {
      return false;
    }

    if (flag.rolloutPercentage >= 100) {
      return true;
    }

    if (flag.rolloutPercentage <= 0) {
      return false;
    }

    const tenantId = currentTenantId.value ?? 'unknown-tenant';
    const bucket = getDeterministicBucket(featureKey, tenantId);
    return bucket < flag.rolloutPercentage;
  }

  function setTenantScope(tenantId: string | null): void {
    if (tenantId === currentTenantId.value) {
      return;
    }

    currentTenantId.value = tenantId;
    flags.value = {};
  }

  const snapshot = computed<Record<string, boolean>>(() => {
    const entries = Object.entries(flags.value).map(([key]) => [key, isEnabled(key, false)] as const);
    return Object.fromEntries(entries);
  });

  return {
    flags,
    snapshot,
    loadFeatureFlag,
    isEnabled,
    setTenantScope,
  };
});
