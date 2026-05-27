import type { RouteRecordRaw } from 'vue-router';

const clientsRoutes: RouteRecordRaw[] = [
  { path: '/clients', name: 'Clients', component: () => import('../../views/ClientsView.vue'), meta: { requiresAuth: true, permission: 'clients.read' } },
  { path: '/clients/:id/dossier', name: 'ClientDossier', component: () => import('../../views/ClientDossier.vue'), meta: { requiresAuth: true, permission: 'clients.read' } }
];

export default clientsRoutes;