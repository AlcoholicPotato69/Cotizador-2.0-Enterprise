import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { pb } from '../services/pb';
import clientsRoutes from './modules/clients';
import devtoolsRoutes from './modules/devtools';
import quotesRoutes from './modules/quotes';

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
        ...quotesRoutes
      ]
    }
  ]
});

// Zero-Trust Navigation Guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isValidSession = authStore.isAuthenticated || pb.authStore.isValid;
  
  // Playground Security (Dev Only)
  if (to.name === 'playground' && import.meta.env.PROD) {
    return next('/');
  }

  if (to.meta.requiresAuth && !isValidSession) {
    // If not authenticated, redirect to login
    return next('/login');
  } 
  
  if (to.name === 'login' && isValidSession) {
    // If already authenticated, block access to login
    return next('/');
  }

  // RBAC Permission Check
  if (isValidSession && to.meta.requiresAuth) {
    const user = authStore.user || pb.authStore.model;
    const effectivePermissions = user?.effective_permissions || [];
    const requiredPermission = to.meta.permission as string;

    if (requiredPermission && !effectivePermissions.includes(requiredPermission)) {
      console.warn(`Access denied. Missing permission: ${requiredPermission}`);
      return next('/');
    }
  }

  next();
});

export default router;
