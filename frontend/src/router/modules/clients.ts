export default [
  { path: '/clients', name: 'ClientList', component: () => import('../../views/clients/ClientListView.vue'), meta: { requiresAuth: true } },
  { path: '/clients/new', name: 'ClientCreate', component: () => import('../../views/clients/ClientFormView.vue'), meta: { requiresAuth: true } },
  { path: '/clients/:id', name: 'ClientDetail', component: () => import('../../views/clients/ClientDetailView.vue'), meta: { requiresAuth: true } }
];