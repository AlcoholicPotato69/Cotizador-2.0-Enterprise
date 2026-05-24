# DOCUMENT POLICY E2E CERTIFICATION

**Date:** 2026-05-23
**Result:** PASSED ✅

## Ejecución Física contra Base de Datos
- **Legal Hold:** Petición `DELETE /documents/:id` sobre un documento con `legalHold=true` fue bloqueada contundentemente por `DocumentPolicyService.canDelete()` retornando 403 Forbidden.
- **Active Retention (Purge Denied):** Intento de purga (`canPurge`) sobre documento sin Legal Hold pero con `retentionUntil` proyectado a 2030 fue bloqueado (HTTP 403).
- **Purge Allowed:** Purga ejecutada exitosamente en documento sin Hold y con fecha de retención vencida en 2025.
- **Archiving:** Documentos enviados a Glacier Storage exitosamente invocando `canArchive()`.
