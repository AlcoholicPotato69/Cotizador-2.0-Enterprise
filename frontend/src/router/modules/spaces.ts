import type { RouteRecordRaw } from 'vue-router';

const spacesRoutes: RouteRecordRaw[] = [
  {
    path: '/spaces',
    name: 'spaces',
    component: () => import('../../views/SpacesView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'spaces.view'
    }
  }
];

export default spacesRoutes;
