import type { RouteRecordRaw } from 'vue-router';

const quotesRoutes: RouteRecordRaw[] = [
  {
    path: 'quotes',
    name: 'quotes',
    component: () => import('../../views/QuotesView.vue'),
    meta: { requiresAuth: true, permission: 'quotes.read' }
  },
  {
    path: 'quotes/new',
    name: 'quote-create',
    component: () => import('../../views/quotes/QuoteCreateView.vue'),
    meta: { requiresAuth: true, permission: 'quotes.write' }
  },
  {
    path: 'quotes/:id',
    name: 'quote-detail',
    component: () => import('../../views/quotes/QuoteDetailView.vue'),
    meta: { requiresAuth: true, permission: 'quotes.read' }
  },
  {
    path: 'quotes/:id/edit',
    name: 'quote-edit',
    component: () => import('../../views/quotes/QuoteDetailView.vue'), // Handled by same view or separate in future
    meta: { requiresAuth: true, permission: 'quotes.write' }
  },
  {
    path: 'quotes/:id/dossier',
    name: 'quote-dossier',
    component: () => import('../../views/QuoteDossier.vue'),
    meta: { requiresAuth: true, permission: 'quotes.read' }
  },
  {
    path: 'quotes/:id/versions',
    name: 'quote-versions',
    component: () => import('../../views/quotes/QuoteDetailView.vue'), // Shown in Tabs
    meta: { requiresAuth: true, permission: 'quotes.read' }
  },
  {
    path: 'quotes/:id/versions/:versionId',
    name: 'quote-version-detail',
    component: () => import('../../views/quotes/QuoteVersionView.vue'),
    meta: { requiresAuth: true, permission: 'quotes.read' }
  }
];

export default quotesRoutes;
