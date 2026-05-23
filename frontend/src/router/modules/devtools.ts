export default [
  {
    path: '/devtools',
    name: 'DevtoolsCenter',
    component: () => import('../../views/devtools/DevtoolsIndex.vue'),
    beforeEnter: (_to: any, _from: any, next: any) => {
      if (import.meta.env.VITE_APP_ENV !== 'development') {
        next('/');
      } else {
        next();
      }
    }
  }
];