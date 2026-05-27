import { http } from '../api/http';

export interface FeatureFlag {
  id: string;
  tenantId: string;
  featureKey: string;
  enabled: boolean;
  rolloutPercentage: number;
}

const normalizeFlag = (raw: unknown): FeatureFlag | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const payload = raw as Record<string, unknown>;
  const featureKey = payload.featureKey;
  const tenantId = payload.tenantId;

  if (typeof featureKey !== 'string' || typeof tenantId !== 'string') {
    return null;
  }

  return {
    id: String(payload.id ?? ''),
    tenantId,
    featureKey,
    enabled: Boolean(payload.enabled),
    rolloutPercentage: Number(payload.rolloutPercentage ?? 100),
  };
};

export const featureFlagService = {
  async getFeatureFlag(key: string): Promise<FeatureFlag | null> {
    try {
      const response = await http.get(`/feature-flags/${encodeURIComponent(key)}`);
      return normalizeFlag(response.data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },
};
