import type { RouteRecordRaw } from 'vue-router';

const legalRoutes: RouteRecordRaw[] = [
  {
    path: '/legal',
    redirect: '/legal/contracts',
  },
  {
    path: '/legal/contracts',
    name: 'contracts-list',
    component: () => import('../../views/ContractsView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'contracts.read'
    }
  },
  {
    path: '/legal/contracts/:id',
    name: 'contract-dossier',
    component: () => import('../../views/ContractDossier.vue'),
    meta: {
      requiresAuth: true,
      permission: 'contracts.read'
    }
  },
  {
    path: '/legal/agreements',
    name: 'agreements-list',
    component: () => import('../../views/AgreementsView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'agreements.read'
    }
  },
  {
    path: '/legal/agreements/:id',
    name: 'agreement-dossier',
    component: () => import('../../views/AgreementDossier.vue'),
    meta: {
      requiresAuth: true,
      permission: 'agreements.read'
    }
  }
];

export default legalRoutes;
