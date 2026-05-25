import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

const devtoolsRoutes: RouteRecordRaw[] = [
  {
    path: '/devtools',
    name: 'DevtoolsCenter',
    component: () => import('../../views/devtools/DevtoolsIndex.vue'),
    meta: {
      requiresAuth: true,
      permission: 'devtools.access'
    },
    beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (import.meta.env.VITE_APP_ENV !== 'development') {
        next('/');
      } else {
        next();
      }
    }
  }
];

export default devtoolsRoutes;