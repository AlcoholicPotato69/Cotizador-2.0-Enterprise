# ARCHITECTURAL TRACEABILITY MATRIX

**Generado:** 2026-05-22T06:00:00.000Z

## Matriz de Conformidad Arquitectónica vs Realidad del Código

| Dominio | Documento Base | Código Real Localizado | Persistencia / Flujo Real | Prueba Fáctica Ejecutada | Calificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `FRONTEND_AUTHORIZATION_ARCHITECTURE.md` | `LoginView.vue`, `authStore.ts` | Parcial (Sin persistencia F5) | Local E2E (Admin Login) | **C** |
| **Tenant Engine** | `TENANT_ADMINISTRATION_CENTER_ARCHITECTURE.md`| `tenantStore.ts` | Falla (Mockeado a `pm`) | Inspección de Store Pinia | **C** |
| **RBAC / Authz** | `RBAC_ARCHITECTURE.md` | `permissionsStore.ts` | Falla (Mockeado manual) | Trazabilidad de `setPermissions` | **C** |
| **Data Model Base** | N/A | `pb_data/data.db` (vía HTTP) | Operativa | Consulta `/api/collections` | **A** |
| **Data Model Avanzado**| Todos los dominios core | N/A | Falla | Consulta `/api/collections` | **D** |
| **Client Module** | `client-file-domain.md` | `ClientListView`, `ClientFormView` | Parcial (Sin Save) | Local E2E (UI CRUD) | **C** |
| **Document Engine** | `07-document-engine-rules.md` | `DsDocumentViewer.vue` | Falla (Maqueta inerte) | Inspección de Canvas & Props | **D** |
| **Notification Center** | Ninguno físico completo | `notificationStore.ts` | Falla (En Memoria Local) | Inspección de Async hooks | **C** |
| **Calendar Center** | Ninguno físico completo | `DsCalendarShell.vue` | Falla (Maqueta inerte) | Trazabilidad de Rutas de Vue | **D** |
| **Business Engines** | `RULE_ENGINE_ARCHITECTURE.md`, etc. | N/A | Falla (Inexistentes) | Búsqueda `pb_hooks/` | **D** |
| **Runtime Security** | `09-rbac-rules.md` | `rbac.pb.js` | Operativa | Middlewares PocketBase | **A** |
| **End To End Flows** | `BusinessFlows.md` | Flujos de UI | Fragmentada (No hay flujos 100%)| Local E2E Integrado | **C** |
| **Design System** | `UX_ACCEPTANCE_REPORT.md` | `src/style.css`, Tailwind Config | Parcial (Falla Dark Mode) | Auditoría Visual Playwright | **B** |
| **Dev Toolkit** | `DeveloperGuide.md` | `development/*.bat` | Operativa | Ejecución batch local | **A** |

## Resumen Cuantitativo
* Total de Componentes/Dominios Auditados: 14
* Dominios Operativos (A): 3
* Dominios con Deuda Leve (B): 1
* Dominios Fracturados / Mocks (C): 6
* Dominios Inexistentes / Ghost (D): 4
