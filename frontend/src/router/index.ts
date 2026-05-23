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
    next('/login');
  } else if (to.name === 'login' && isValidSession) {
    // If already authenticated, block access to login
    next('/');
  } else {
    next();
  }
});

export default router;
