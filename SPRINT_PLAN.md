# SPRINT PLAN

## Authority: TECHNICAL DIRECTOR
## Sprint: 1 (Stabilization Sprint)
## Goal: Resolver bloqueadores de producción y certificar el Core (QA & Security)

---

### REGLAS DEL SPRINT
1. **Nadie entra a producción sin certificación QA.** Todas las tareas deben incluir evidencia de pruebas automatizadas.
2. **Nadie modifica arquitectura sin aprobación del Architect.** Las correcciones deben seguir los patrones existentes (Zero Trust, Provider Abstraction).

### BACKLOG DEL SPRINT (Priorizado)

#### TICKET 1: Reactivación y Certificación de RBAC (Critical Blocker)
- **Asignado a:** Backend / Security Engineer
- **Descripción:** El archivo `rbac.pb.js.disabled` debe ser analizado, corregido si es necesario, activado y probado exhaustivamente.
- **Criterio de Aceptación:** `SECURITY_REPORT.md` actualizado con evidencia de pruebas de Tenant Isolation y matrices de acceso funcionales.

#### TICKET 2: Infraestructura de Pruebas (Critical Blocker)
- **Asignado a:** QA / Automation Engineer
- **Descripción:** Instalar y configurar frameworks de pruebas (e.g., Jest para backend hooks, Playwright/Cypress para frontend E2E) apuntando al SQLite de desarrollo.
- **Criterio de Aceptación:** `QA_REPORT.md` actualizado con la primera suite de pruebas pasando exitosamente.

#### TICKET 3: Eliminación de Mocks de Frontend (Critical Blocker)
- **Asignado a:** Frontend Engineer
- **Descripción:** Eliminar `DevToolbar.vue` y cualquier emulación de Server-Sent Events (SSE). Conectar el centro de notificaciones real de PocketBase.
- **Criterio de Aceptación:** Validación manual y E2E de notificaciones en tiempo real reales. `FRONTEND_TEST_REPORT.md` actualizado.

#### TICKET 4: Motores de Retención y Expiración (High Priority)
- **Asignado a:** Backend Engineer
- **Descripción:** Implementar los hooks faltantes para los cronjobs o eventos de retención y expiración de documentos.
- **Criterio de Aceptación:** Pruebas unitarias que demuestren que los documentos expiran o se purgan según las reglas de compliance.

---
**Nota:** Hasta que los tickets 1, 2 y 3 no estén cerrados, **SE BLOQUEA** cualquier desarrollo de nuevas funcionalidades (Invoices/Payments).
