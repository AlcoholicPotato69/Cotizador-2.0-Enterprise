import type { RouteRecordRaw } from 'vue-router';

const scheduleRoutes: RouteRecordRaw[] = [
  {
    path: '/schedule',
    name: 'schedule',
    component: () => import('../../views/ScheduleView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'schedule.view'
    }
  }
];

export default scheduleRoutes;
