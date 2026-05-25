import type { RouteRecordRaw } from 'vue-router';

const financeRoutes: RouteRecordRaw[] = [
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('../../views/InvoicesView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'finance.view'
    }
  },
  {
    path: '/payments',
    name: 'payments',
    component: () => import('../../views/PaymentsView.vue'),
    meta: {
      requiresAuth: true,
      permission: 'finance.view'
    }
  },
  {
    path: '/finance-dossier/:id?',
    name: 'finance-dossier',
    component: () => import('../../views/FinancialDossier.vue'),
    meta: {
      requiresAuth: true,
      permission: 'finance.view'
    }
  }
];

export default financeRoutes;
