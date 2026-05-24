# Architecture Reconciliation Report
## Enterprise Architect Reality Check (Phase 1)
**Date:** 2026-05-23
**Status:** FAILED REALITY CHECK (FRACTURED ARCHITECTURE)

### 1. Executive Summary
After an extensive audit of the actual source code (`backend/pb_migrations`, `backend/pb_hooks`, `frontend/src`), the theoretical architecture defined in `ARCHITECTURE.md` and `DOMAIN_MODEL.md` is **largely disconnected from reality**. The system has advanced features (Contracts, Signatures, Quotes) implemented, but the foundational pillars (Tenants, RBAC, Clients, Rule Engine) are entirely missing or disabled in the active backend. The frontend is operating under the false assumption that these systems exist, leading to heavy use of mocking.

### 2. The Illusion of Multi-Tenant and RBAC (Zero Trust Violation)
- **Tenants:** The `ARCHITECTURE.md` states "Arquitectura nativa de múltiples inquilinos, con aislamiento estricto". **Reality:** The `tenants` collection DOES NOT EXIST in active migrations (it was moved to `archive/`). Relations pointing to `tenant_id` are orphaned. 
- **RBAC:** The documentation claims strict Role-Based Access Control. **Reality:** The `roles` collection is missing. The primary RBAC enforcement script (`backend/pb_hooks/rbac.pb.js.disabled`) is explicitly disabled.

### 3. Missing Core Business Modules
- **Clients & Inventory (Espacios):** The `clientes` and `espacios` collections are strictly in `archive/` and not in active database schemas.
- **Rule Engine (Cotizaciones):** The `frontend/src/views/QuotesView.vue` is heavily programmed to query `rule_registry`, `template_registry`, and `event_reservations` to calculate dynamic pricing. **Reality:** None of these collections exist in the active backend.
- **Financials (Invoices/Payments):** There is absolutely no backend support for invoices or payments. The frontend uses a dummy `InvoiceProvider.ts` to mock this behavior.

### 4. Fake Authentication (Frontend)
- The frontend circumvents actual authentication by using a mock provider (`DevAuthProvider.ts`), which logs in users via hardcoded dictionary keys (e.g., "superadmin", "comercial_pm") and issues fake JWT tokens (`mock_jwt_token_123`). This entirely bypasses the Zero Trust architecture.

### 5. Verified Working Components
The following domains DO exist in the active codebase and show robust implementation:
- **Contracts & Signatures:** Extensive migrations and hooks (`contracts.pb.js`, `signature_webhooks.pb.js`, `contract_pdfs`, etc.).
- **Audit Logging:** The `audit_logs` collection is active.
- **Documents:** Active collections and hooks.

### 6. Architectural Conclusion & Blockers
The project CANNOT proceed to any QA or Release phase. The foundation was stripped out (moved to `archive`), leaving the roof (Contracts, Quotes) floating in mid-air. 

**Immediate Recommendations:**
1. **Restore Core Schemas:** Bring `tenants`, `roles`, `clientes`, `espacios`, and `rule_registry` back from `archive/` into active `pb_migrations` and execute them.
2. **Re-enable RBAC:** Fix and re-enable `rbac.pb.js`.
3. **Remove Frontend Mocks:** Delete `DevAuthProvider.ts` and enforce genuine PocketBase authentication.
