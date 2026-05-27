import { http } from '../api/http';
import { authService } from './authService';

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  config?: Record<string, unknown>;
  logoUrl?: string;
  branding?: Record<string, unknown>;
}

const normalizeTenant = (raw: unknown, fallbackId?: string): Tenant | null => {
  if (!raw || typeof raw !== 'object') {
    if (!fallbackId) {
      return null;
    }

    return {
      id: fallbackId,
      name: `Tenant ${fallbackId}`,
      config: {},
    };
  }

  const payload = raw as Record<string, unknown>;
  const id = String(payload.id ?? payload.tenant_id ?? payload.tenantId ?? fallbackId ?? '');

  if (!id) {
    return null;
  }

  const fallbackName = `Tenant ${id}`;

  return {
    id,
    name: String(payload.name ?? payload.displayName ?? fallbackName),
    domain: typeof payload.domain === 'string' ? payload.domain : undefined,
    config: (payload.config && typeof payload.config === 'object')
      ? (payload.config as Record<string, unknown>)
      : {},
    logoUrl: typeof payload.logoUrl === 'string' ? payload.logoUrl : undefined,
    branding: (payload.branding && typeof payload.branding === 'object')
      ? (payload.branding as Record<string, unknown>)
      : undefined,
  };
};

const fallbackTenantFromSession = async (): Promise<Tenant[]> => {
  const session = await authService.refreshSession().catch(() => null);
  const tenantId = session?.record.tenant_id;

  if (!tenantId) {
    return [];
  }

  const tenantFromApi = await tenantService.getTenantById(tenantId).catch(() => null);
  if (tenantFromApi) {
    return [tenantFromApi];
  }

  return [
    {
      id: tenantId,
      name: `Tenant ${tenantId}`,
      config: {},
    },
  ];
};

export const tenantService = {
  async getTenantById(id: string): Promise<Tenant | null> {
    try {
      const response = await http.get(`/tenants/${id}`);
      return normalizeTenant(response.data, id);
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return normalizeTenant(null, id);
      }
      throw error;
    }
  },

  async getAccessibleTenants(): Promise<Tenant[]> {
    try {
      const response = await http.get('/tenants');
      const payload = response.data;

      const rawTenants = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as Record<string, unknown>)?.items)
          ? ((payload as Record<string, unknown>).items as unknown[])
          : payload && typeof payload === 'object'
            ? [payload]
            : [];

      const tenants = rawTenants
        .map((tenant) => normalizeTenant(tenant))
        .filter((tenant): tenant is Tenant => tenant !== null);

      if (tenants.length > 0) {
        return tenants;
      }

      return await fallbackTenantFromSession();
    } catch {
      return await fallbackTenantFromSession();
    }
  },

  async updateTenant(id: string, payload: Partial<Tenant>): Promise<Tenant> {
    const response = await http.patch(`/tenants/${id}`, payload);
    const normalizedTenant = normalizeTenant(response.data, id);

    if (!normalizedTenant) {
      throw new Error('Invalid tenant response');
    }

    return normalizedTenant;
  },
};
