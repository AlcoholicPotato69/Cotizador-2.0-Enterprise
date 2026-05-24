# Codebase Truth Matrix
## Phase 1 - Architecture Reconciliation

| Domain / Component | Documented In Theory | Evidence Found in Codebase | Reality Status | Notes / Proof |
|-------------------|----------------------|----------------------------|----------------|---------------|
| **Identity** | `DOMAIN_MODEL.md` | `users` collection in `pb_migrations` | **PARTIAL** | Core `users` exist, but `DevAuthProvider.ts` uses mocked dummy users (SuperAdmin, Comercial PM, etc.) bypassing real auth. |
| **Tenants** | `DOMAIN_MODEL.md` | `archive/1700000000_init_v2.js` | **MISSING** | The `tenants` collection is in `archive` and NOT in active `pb_migrations`. `tenant_id` fields are orphaned or point to non-existent schemas. |
| **RBAC** | `DOMAIN_MODEL.md` | `permissions` collection, `rbac.pb.js.disabled` | **BROKEN / DISABLED** | `roles` collection missing. The core RBAC hook is explicitly disabled (`rbac.pb.js.disabled`). |
| **Clientes** | `DOMAIN_MODEL.md` | `archive/1710000003_clientes_schema.js` | **MISSING** | `clientes` collection does not exist in active migrations. Frontend queries fail or mock. |
| **CRM** | `DOMAIN_MODEL.md` | No evidence found | **MISSING** | No `Opportunity`, `Lead`, `Activity` collections. |
| **Quotes** | `DOMAIN_MODEL.md` | `quotes`, `quote_versions`, `quote_items`, `quotes.pb.js` | **EXISTS (But Orphaned)** | Exists in DB and Hooks, but relies on missing `clientes` and `espacios` collections. |
| **Rule Engine (Quotes)**| `ARCHITECTURE.md` | `archive/1710000008_rule_engine_registry.js` | **MISSING** | Frontend `QuotesView.vue` queries `rule_registry` and `template_registry`, which are not in active DB. |
| **Contracts** | `DOMAIN_MODEL.md` | `contracts`, `contract_versions`, `contract_templates`, `contracts.pb.js` | **EXISTS** | Robust implementation in active migrations and hooks. |
| **Signatures** | `DOMAIN_MODEL.md` | `contract_signatures`, `signature_events`, `signature_webhooks.pb.js` | **EXISTS** | Signature domain is present and actively migrated. |
| **Documents** | `DOMAIN_MODEL.md` | `documents`, `documents.pb.js` | **EXISTS** | Found in `pb_migrations` and `pb_hooks`. |
| **Invoices (CFDI)** | `DOMAIN_MODEL.md` | `InvoiceProvider.ts` in frontend (mocked) | **MOCKED** | No backend tables for `invoices`. Frontend has a dummy provider. |
| **Payments** | `DOMAIN_MODEL.md` | No evidence found | **MISSING** | No backend or frontend evidence. |
| **Notifications** | `DOMAIN_MODEL.md` | `notifications` | **PARTIAL** | Collection exists, but no robust omni-channel engine found. |
| **Reports** | `DOMAIN_MODEL.md` | `contract_metrics` | **PARTIAL** | Metrics exist, but no `ReportDefinition` or `Dashboard`. |
| **Audit** | `DOMAIN_MODEL.md` | `audit_logs` | **EXISTS** | Active migration found for audit logging. |
| **Espacios (Inventory)**| `ARCHITECTURE.md` | `archive/1710000004_espacios_schema.js` | **MISSING** | Frontend queries `espacios` but it's only in `archive`. |

## Conclusion
The codebase is in a **FRACTURED STATE**. The theoretical foundation (Tenants, RBAC, Clientes) was either deleted or moved to `archive/`, rendering the advanced domains (Quotes, Contracts) fundamentally broken since they rely on missing foreign references.
