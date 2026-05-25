/**
 * @module RouterConfig
 * @description Application routing configuration utilizing Vue Router.
 * Implements a strict Zero-Trust Navigation Guard that intercepts all route transitions.
 * Ensures users are authenticated, assigned to a valid Tenant, and possess the explicit RBAC permissions required for the destination.
 */
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { usePermissionsStore } from '../stores/permissionsStore';
import clientsRoutes from './modules/clients';
import devtoolsRoutes from './modules/devtools';
import quotesRoutes from './modules/quotes';
import dashboardRoutes from './modules/dashboard';
import financeRoutes from './modules/finance';
import adminRoutes from './modules/admin';
import catalogRoutes from './modules/catalog';
import spacesRoutes from './modules/spaces';
import scheduleRoutes from './modules/schedule';
import legalRoutes from './modules/legal';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('../layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/playground'
        },
        {
          path: 'playground',
          name: 'playground',
          component: () => import('../views/PlaygroundView.vue')
        },
        ...clientsRoutes,
        ...devtoolsRoutes,
        ...quotesRoutes,
        ...dashboardRoutes,
        ...financeRoutes,
        ...adminRoutes,
        ...catalogRoutes,
        ...spacesRoutes,
        ...scheduleRoutes,
        ...legalRoutes
      ]
    }
  ]
});

/**
 * Zero-Trust Navigation Guard
 * 
 * Intercepts all routing events to enforce security policies.
 * 
 * 1. Authentication Check: Redirects unauthenticated users trying to access protected routes to `/login`.
 * 2. Login Bypass: Redirects already authenticated users away from `/login`.
 * 3. Tenant Enforcement: Ensures the user has a valid `tenant_id` and the tenant context is fully loaded.
 * 4. RBAC Resolution: Examines the `to.meta.permission` property. If missing (and the route is not explicitly public), access is denied. If present, it checks the user's granular capabilities via the `permissionsStore`.
 */
router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore();
  const isValidSession = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isValidSession) {
    return '/login';
  } 
  
  if (to.name === 'login' && isValidSession) {
    return '/';
  }

  // RBAC Permission and Tenant Check
  if (isValidSession && to.meta.requiresAuth) {
    const user = authStore.user;
    const tenantStore = useTenantStore();
    
    if (!tenantStore.activeTenant) {
        if (user?.tenant_id) {
            await tenantStore.syncWithUser(user);
        } else {
            console.warn("User has no tenant assigned.");
            authStore.logout();
            return '/login';
        }
    }

    const permStore = usePermissionsStore();

    const requiredPermission = to.meta.permission as string;

    // Zero-Trust: If a route requires authentication but has no explicit permission defined,
    // deny access by default, unless it's explicitly allowed without permissions (e.g., playground).
    const isPublicAuthRoute = ['playground', 'login'].includes(to.name as string);

    if (!requiredPermission && !isPublicAuthRoute) {
      console.warn(`Access denied. Route ${to.path} lacks explicit permission mapping.`);
      return '/';
    }

    if (requiredPermission && !permStore.hasPermission(requiredPermission)) {
      console.warn(`Access denied. Missing permission: ${requiredPermission}`);
      return '/';
    }
  }

  return true;
});

export default router;
