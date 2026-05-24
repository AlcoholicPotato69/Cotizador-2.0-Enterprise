# MASTER ROADMAP

## Authority: TECHNICAL DIRECTOR
## Project: Cotizador 2.0 Enterprise

---

Este Roadmap Maestro define la dirección estratégica del proyecto. Ningún cambio en los objetivos de negocio puede ser realizado sin la aprobación del **Product Owner**. Ningún cambio estructural puede hacerse sin la aprobación del **Architect**.

### PHASE 1: Stabilization & Tech Debt (Current Focus)
**Status:** In Progress (Blocker Resolution)
**Objetivo:** Obtener un estado de "Certificable" para habilitar el pase a producción del Core.
- Restaurar y auditar el sistema RBAC (`rbac.pb.js`).
- Implementar infraestructura de pruebas (Unit, Integration, E2E).
- Obtener un `QA_REPORT.md` en estado PASSED.
- Eliminar mocks y datos simulados del Frontend.

### PHASE 2: Core Enterprise Operations
**Status:** Blocked (Waiting for Phase 1)
**Objetivo:** Finalizar los motores de cumplimiento legal y operaciones críticas documentales.
- Implementación de Motores de Retención y Expiración para Documentos.
- Certificación del flujo Multi-Signer y validación del Evidence Vault con pruebas determinísticas.
- Activación de Realtime Subscriptions sin emuladores.

### PHASE 3: Financial & Invoicing Domain
**Status:** Unstarted (Blocked by Business Rule)
**Objetivo:** Manejo de pagos y facturación.
- Integración del modelo de `Invoice Management`.
- Sistema de `Payment Tracking` y conciliación.
- Reportes financieros.

### PHASE 4: Scale & Multi-Tenant Final Audit
**Status:** Unstarted
**Objetivo:** Asegurar la escalabilidad para múltiples plazas (Plaza Mayor, Casa de Piedra).
- Pruebas de Carga (Load Testing).
- Certificación exhaustiva de Tenant Isolation.
- Revisión final de Arquitectura y Go-Live.
