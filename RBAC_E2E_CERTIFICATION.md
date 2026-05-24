# RBAC E2E CERTIFICATION

**Date:** 2026-05-23
**Result:** PASSED

## Evidencia Física E2E
- **Test:** Decorador `@Permissions('quotes.read')` activado en controlador bloquea peticiones de usuarios sin ese permiso físico (arroja `403 Forbidden`).
- **Test:** Asignación de un rol a un usuario fuera de su `tenant_id` falla a nivel base de datos (`Unique Constraint Violation`).
- **Test:** La alteración de un Permiso a un Rol dispara un evento hacia el `AuditEventPublisher` generando su respectivo `chain_hash` exitosamente.
