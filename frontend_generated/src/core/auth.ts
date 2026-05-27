import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePermissionStore } from './permissions';
import { useTenantStore, TenantId } from './tenant';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenant_id: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: any, permissions: string[]) => void;
  logout: () => void;
}

/**
 * Maps the backend tenant ID to the frontend TenantId token.
 */
function resolveTenantId(backendTenantId: string): TenantId {
  const map: Record<string, TenantId> = {
    'pm': 'plaza_mayor',
    'cp': 'casa_de_piedra',
    '00000000-0000-0000-0000-000000000000': 'admin',
  };
  return map[backendTenantId] || 'admin';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user, permissions) => {
        set({ token, user, isAuthenticated: true });

        // Pass backend permissions DIRECTLY to the permission store.
        // No mapping needed — frontend now uses backend permission strings.
        usePermissionStore.getState().setPermissions(permissions as any);

        // Resolve and set the tenant context
        const tenantId = resolveTenantId(user.tenant_id);
        useTenantStore.getState().setTenant(tenantId);
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        usePermissionStore.getState().setPermissions([]);
      },
    }),
    {
      name: 'c2-auth-storage-v2', // Changed from v1 to force cache invalidation
    }
  )
);
