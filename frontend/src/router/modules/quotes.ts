import type { RouteRecordRaw } from 'vue-router';

const quotesRoutes: RouteRecordRaw[] = [
  {
    path: 'quotes',
    name: 'quotes',
    component: () => import('../../views/quotes/QuoteListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'quotes/new',
    name: 'quote-create',
    component: () => import('../../views/quotes/QuoteCreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'quotes/:id',
    name: 'quote-detail',
    component: () => import('../../views/quotes/QuoteDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'quotes/:id/edit',
    name: 'quote-edit',
    component: () => import('../../views/quotes/QuoteDetailView.vue'), // Handled by same view or separate in future
    meta: { requiresAuth: true }
  },
  {
    path: 'quotes/:id/versions',
    name: 'quote-versions',
    component: () => import('../../views/quotes/QuoteDetailView.vue'), // Shown in Tabs
    meta: { requiresAuth: true }
  },
  {
    path: 'quotes/:id/versions/:versionId',
    name: 'quote-version-detail',
    component: () => import('../../views/quotes/QuoteVersionView.vue'),
    meta: { requiresAuth: true }
  }
];

export default quotesRoutes;
