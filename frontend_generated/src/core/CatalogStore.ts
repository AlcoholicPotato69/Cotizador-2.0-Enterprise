import { create } from 'zustand';
import { TenantId } from './tenant';

export interface Space {
  id: string;
  name: string;
  category: string;
  capacity: number | string;
  status: string;
  tenantId: TenantId | 'all';
}

interface CatalogState {
  spaces: Space[];
}

export const useCatalogStore = create<CatalogState>(() => ({
  spaces: []
}));
