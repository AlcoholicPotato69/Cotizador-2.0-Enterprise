import { create } from 'zustand';

/**
 * Permission type matches EXACTLY the backend permission strings
 * sent in the JWT payload from NestJS AuthService.
 */
export type Permission = 
  // CRM
  | 'clients.create' | 'clients.read' | 'clients.update' | 'clients.delete'
  // Spaces / Catalog
  | 'spaces.create' | 'spaces.read' | 'spaces.update' | 'spaces.delete'
  // Quotes
  | 'quotes.create' | 'quotes.read' | 'quotes.update'
  // Contracts
  | 'contracts.create' | 'contracts.read'
  // Invoices
  | 'invoices.create' | 'invoices.read'
  // Payments
  | 'payments.create' | 'payments.read'
  // Admin / System
  | 'users.manage' | 'roles.manage'
  | 'audit.read'
  // Dashboard & Navigation
  | 'dashboard.view' | 'settings.view' | 'catalog.view' | 'schedule.view'
  // Global Access
  | 'admin.access'
  // Custom domain permissions
  | 'marketing.read' | 'legal.write' | 'finance.view'
  // Catch-all for future backend permissions
  | (string & {});

interface PermissionState {
  permissions: Permission[];
  setPermissions: (perms: Permission[]) => void;
  hasPermission: (perm: Permission | Permission[]) => boolean;
  hasAnyPermission: (perms: Permission[]) => boolean;
}

import { persist } from 'zustand/middleware';

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      permissions: [], // MUST BE INJECTED BY AUTH API ONLY
      setPermissions: (permissions) => set({ permissions }),
      hasPermission: (perm) => {
        const { permissions } = get();
        if (Array.isArray(perm)) {
          return perm.every(p => permissions.includes(p));
        }
        return permissions.includes(perm);
      },
      hasAnyPermission: (perms) => {
        const { permissions } = get();
        return perms.some(p => permissions.includes(p));
      }
    }),
    {
      name: 'c2-permissions-storage',
    }
  )
);
