import type { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../../views/AdminView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access'
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../../views/UsersView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access'
    }
  },
  {
    path: '/admin/roles',
    name: 'AdminRoles',
    component: () => import('../../views/RolesView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access'
    }
  },
  {
    path: '/admin/permissions',
    name: 'AdminPermissions',
    component: () => import('../../views/PermissionsView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access'
    }
  },
  {
    path: '/admin/governance',
    name: 'AdminGovernance',
    component: () => import('../../views/DocumentGovernanceView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access' // or config.manage
    }
  },
  {
    path: '/admin/audit-logs',
    name: 'AdminAuditLogs',
    component: () => import('../../views/AuditLogView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access'
    }
  },
  {
    path: '/admin/integrations',
    name: 'AdminIntegrations',
    component: () => import('../../views/IntegrationsView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'admin.access'
    }
  }
];

export default adminRoutes;
