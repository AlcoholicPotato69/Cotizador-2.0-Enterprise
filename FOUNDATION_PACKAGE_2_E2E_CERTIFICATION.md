# FOUNDATION PACKAGE 2 E2E CERTIFICATIONS

**Date:** 2026-05-23
**Result:** PASSED

## SETTINGS_E2E_CERTIFICATION
- **Test:** Lectura de `BillingSettings` por un usuario intercepta automáticamente el `tenant_id` y arroja valores parametrizados correctamente.
- **Test:** Intento de modificación emite evento `SETTINGS_UPDATED` y restringe permisos por guard.

## AUDIT_E2E_CERTIFICATION
- **Test:** Mutación directa en base de datos PostgreSQL disparó alerta de integridad al no coincidir el `chain_hash`.
- **Test:** Interceptores registran exitosamente el JSON del Payload en cada request HTTP de escritura (POST/PUT/DELETE).

## SNAPSHOT_E2E_CERTIFICATION
- **Test:** `SnapshotsService.createSnapshot()` genera `v1`. Al ejecutar idéntico payload, retorna `v1` para ahorrar espacio.
- **Test:** Modificación en el payload genera `v2` y firma criptográfica divergente.

## APPROVAL_E2E_CERTIFICATION
- **Test:** Flujo Completo: `ApprovalRequest` es creado en `PENDING`. Dos pasos son `APPROVED`. La máquina de estados (`ApprovalsService`) evalúa a `APPROVED` y dispara `AUDIT_LOG`.
- **Test:** Inyección de un `REJECTED` en cualquier paso tumba inmediatamente el request principal a `REJECTED`.
