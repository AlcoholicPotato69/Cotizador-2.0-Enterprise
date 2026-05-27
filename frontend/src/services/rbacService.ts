import { http } from '../api/http';
import type { User } from '../types/user';

export interface Role {
    id: string;
    name: string;
    description?: string;
    tenant: string;
}

export interface Permission {
    id: string;
    key: string;
    module: string;
    active: boolean;
}

export const rbacService = {
    getUserPermissions(user: User | null): string[] {
        if (!user) {
            return [];
        }
        const perms = (user as any).permissions || (user as any).effective_permissions || [];
        return Array.isArray(perms) ? perms : [];
    },
    async getRoles(tenantId: string): Promise<Role[]> {
        const res = await http.get('/rbac_roles', {
            params: { filter: `tenant = "${tenantId}"` }
        });
        return res.data?.data || res.data || [];
    },
    async getPermissions(): Promise<Permission[]> {
        const res = await http.get('/rbac_permissions', {
            params: { filter: `active = true` }
        });
        return res.data?.data || res.data || [];
    },
    async getRolePermissions(roleId: string): Promise<any[]> {
        const res = await http.get('/rbac_role_permissions', {
            params: { filter: `role = "${roleId}"` }
        });
        return res.data?.data || res.data || [];
    },
    async deleteRolePermission(id: string): Promise<void> {
        await http.delete(`/rbac_role_permissions/${id}`);
    },
    async createRolePermission(data: any): Promise<any> {
        const res = await http.post('/rbac_role_permissions', data);
        return res.data;
    }
};
