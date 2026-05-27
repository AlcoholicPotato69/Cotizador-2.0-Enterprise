import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TenantId = 'casa_de_piedra' | 'plaza_mayor' | 'admin';

export interface TenantMetadata {
  id: TenantId;
  name: string;
  shortName: string;
  primaryColor: string;
  hoverColor?: string;
}

interface TenantState {
  currentTenant: TenantId | null;
  tenantMetadata: Record<TenantId, TenantMetadata>;
  setTenant: (id: TenantId) => void;
  updateTenantColor: (id: TenantId, color: string, hoverColor?: string) => void;
  applyTenantTheme: (tenantId: TenantId) => void;
}

const defaultMetadata: Record<TenantId, TenantMetadata> = {
  casa_de_piedra: { id: 'casa_de_piedra', name: 'Casa de Piedra', shortName: 'CP', primaryColor: '#6B4F3A', hoverColor: '#543e2e' },
  plaza_mayor: { id: 'plaza_mayor', name: 'Plaza Mayor', shortName: 'PM', primaryColor: '#C8102E', hoverColor: '#A00D25' },
  admin: { id: 'admin', name: 'Configuración', shortName: 'CFG', primaryColor: '#334155', hoverColor: '#1e293b' },
};

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      tenantMetadata: defaultMetadata,
      setTenant: (id) => {
        set({ currentTenant: id });
        get().applyTenantTheme(id);
      },
      updateTenantColor: (id, color, hoverColor) => {
        set((state) => ({
          tenantMetadata: {
            ...state.tenantMetadata,
            [id]: {
              ...state.tenantMetadata[id],
              primaryColor: color,
              hoverColor: hoverColor || color
            }
          }
        }));
        if (get().currentTenant === id) {
          get().applyTenantTheme(id);
        }
      },
      applyTenantTheme: (tenantId) => {
        if (typeof document !== 'undefined') {
          const tenant = get().tenantMetadata[tenantId];
          const root = document.documentElement;
          
          // Cleanup legacy data attributes
          if (tenantId === 'casa_de_piedra') {
            root.setAttribute('data-tenant', 'casa-de-piedra');
          } else if (tenantId === 'admin') {
            root.setAttribute('data-tenant', 'admin');
          } else {
            root.removeAttribute('data-tenant');
          }

          if (tenant) {
             root.style.setProperty('--brand-primary', tenant.primaryColor);
             if (tenant.hoverColor) {
               root.style.setProperty('--brand-hover', tenant.hoverColor);
             } else {
               root.style.setProperty('--brand-hover', tenant.primaryColor);
             }
          }
        }
      }
    }),
    { 
      name: 'c2-tenant-storage-v3',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
           if (state.currentTenant) {
             // Defer execution gently to ensure window.document is fully parsed
             setTimeout(() => state.applyTenantTheme(state.currentTenant!), 10);
           }
        }
      }
    }
  )
);

