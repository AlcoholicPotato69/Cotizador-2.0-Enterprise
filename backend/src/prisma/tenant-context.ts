import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: string;
}

export const tenantContext = new AsyncLocalStorage<TenantContext>();
