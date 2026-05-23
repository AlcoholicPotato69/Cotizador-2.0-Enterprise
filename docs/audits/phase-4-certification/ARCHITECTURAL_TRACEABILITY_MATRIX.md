# ARCHITECTURAL_TRACEABILITY_MATRIX.md

## MATRIZ DE TRAZABILIDAD FUNDACIONAL (AGENT 12)

Esta matriz vincula el Diseño Arquitectónico (Documento) con la Implementación Viva (Archivo/Runtime) y su Prueba Criptográfica o E2E, cerrando la brecha de confianza.

| Documento | Archivo Real | Método / Colección | Prueba Ejecutada | Resultado | Clasificación |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `AUTH_ARCHITECTURE.md` | `authStore.ts` & `/api/collections/users` | `authWithPassword()` | Test E2E: Login Válido e Inválido | Persistencia JWT confirmada | **A** |
| `SESSION_ARCHITECTURE.md` | `App.vue` & `router/index.ts` | `initializeSession()` | Test F5 manual y en Runtime | Rehidratación desde localStorage | **A** |
| `TENANT_ARCHITECTURE.md` | `tenantService.ts` & `tenantStore.ts` | CSS Injection & `@request.auth` | Test E2E: Cross-Tenant Fetch | API HTTP 404 (Bloqueado) | **A** |
| `RBAC_ARCHITECTURE.md` | `rbac.pb.js` & `roles` | `onRecordAuthRequest()` | Test E2E: Fetch `audit_logs` | HTTP 403 (Rol protegido) | **A** |
| `DATA_MODEL_ARCHITECTURE.md`| `pb_data/data.db` (SQLite) | `documents`, `clientes`, etc. | Test Node: API Schema Dump | FKs restrictivas operativas | **A** |
| `CLIENT_MODULE_ARCHITECTURE` | `clientService.ts` | `createClient()` | Test E2E: POST `clientes` | Guardado con Tenant Injection | **A** |
| `DOCUMENT_ARCHITECTURE.md` | `documentService.ts` | `Upload Document` | Test E2E: Multipart Form Upload | Hash Web Crypto y PB Rule actúan | **A** |
| `DESIGN_SYSTEM.md` | `main.css` & `tailwind.config.js` | `theme()` breakpoints | Evaluación manual Runtime | Clases dinámicas inyectadas | **A** |

### CONCLUSIÓN
Cero desviaciones críticas en la Fundación. La traza es auditable desde el diseño hasta el byte guardado en disco duro.
