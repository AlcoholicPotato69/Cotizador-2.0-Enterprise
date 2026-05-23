# ROUTER HEALTH REPORT

**Generado:** 2026-05-22T05:07:16.244Z

## Resumen de Integridad
- **Guards (beforeEach):** Activo. Protege rutas privadas evaluando `authStore.isAuthenticated`.
- **Vistas Huérfanas Detectadas:** Varias vistas físicas no están registradas en el Router.

## Auditoría de Vistas vs Rutas

| Archivo (Vista) | Registrado en Router | Clasificación |
| :--- | :--- | :--- |
| `AdminView.vue` | ❌ No (Huérfano) | **C** |
| `AvailabilitySimulator.vue` | ❌ No (Huérfano) | **C** |
| `BrandingBuilder.vue` | ❌ No (Huérfano) | **C** |
| `CatalogView.vue` | ❌ No (Huérfano) | **C** |
| `ClientFileView.vue` | ❌ No (Huérfano) | **C** |
| `clients/ClientDetailView.vue` | ✅ Sí | **A** |
| `clients/ClientFormView.vue` | ✅ Sí | **A** |
| `clients/ClientListView.vue` | ✅ Sí | **A** |
| `ClientsView.vue` | ❌ No (Huérfano) | **C** |
| `ContractsView.vue` | ❌ No (Huérfano) | **C** |
| `DashboardView.vue` | ❌ No (Huérfano) | **C** |
| `devtools/DevtoolsIndex.vue` | ✅ Sí | **A** |
| `DocReqBuilder.vue` | ❌ No (Huérfano) | **C** |
| `LoginView.vue` | ✅ Sí | **A** |
| `PermissionDebugger.vue` | ❌ No (Huérfano) | **C** |
| `PermissionSimulator.vue` | ❌ No (Huérfano) | **C** |
| `PlaygroundView.vue` | ✅ Sí | **A** |
| `PricingBuilder.vue` | ❌ No (Huérfano) | **C** |
| `PromotionsBuilder.vue` | ❌ No (Huérfano) | **C** |
| `QuoteFileView.vue` | ❌ No (Huérfano) | **C** |
| `QuotesView.vue` | ❌ No (Huérfano) | **C** |
| `RbacBuilder.vue` | ❌ No (Huérfano) | **C** |
| `RuleBuilder.vue` | ❌ No (Huérfano) | **C** |
| `RuleSimulator.vue` | ❌ No (Huérfano) | **C** |
| `SpaceBuilder.vue` | ❌ No (Huérfano) | **C** |
| `TaxBuilder.vue` | ❌ No (Huérfano) | **C** |
| `TemplateBuilder.vue` | ❌ No (Huérfano) | **C** |

**Total de vistas huérfanas:** 21 de 27
