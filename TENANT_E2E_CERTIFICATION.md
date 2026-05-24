# TENANT E2E CERTIFICATION

**Date:** 2026-05-23
**Result:** PASSED

## Evidencia Física E2E
- **Test:** `GET /users` enviando `x-tenant-id: TENANT_A` retorna solo usuarios del Tenant A (mediante `TenantContextService` e inyección global).
- **Test:** Operación de mutación en `Tenant` dispara `DomainEventPublisher.publish()` correctamente.
- **Test:** Invocación a `DELETE /tenants/:id` verifica actualización de campos de auditoría `deleted_at` y `deleted_by` en lugar de borrar el registro en cascada (Soft Delete).
