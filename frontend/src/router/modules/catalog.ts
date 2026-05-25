import type { RouteRecordRaw } from 'vue-router';

const catalogRoutes: RouteRecordRaw[] = [
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('../../views/CatalogView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'catalog.view'
    }
  }
];

export default catalogRoutes;
