# AUDIT STRATEGY FINAL

**Status:** FROZEN
**Date:** 2026-05-23

## Hash Chain Protocol
Todos los modelos de la Arquitectura Empresarial inyectan su evento de mutación al `AuditEventPublisher` global en NestJS.

### Algoritmo de Auditoría
1. Se captura la acción (`CREATE`, `UPDATE`, `SOFT_DELETE`, `APPROVE`).
2. Se extrae el `previous_hash` del último registro insertado en `AuditLog`.
3. Se calcula el `current_hash` en tiempo de ejecución: `SHA-256(JSON(Payload))`.
4. Se calcula el eslabón final: `chain_hash = SHA-256(previous_hash + current_hash)`.

### Tamper Detection (Scheduled Engine)
- El **Audit Cron Job** se ejecuta cada hora barriendo la tabla `AuditLog`.
- Re-calcula la ecuación matemática.
- Si `calculated_chain_hash != stored_chain_hash`, se asume una intervención directa y corrupta a la base de datos PostgreSQL.
- Se dispara un Evento de Alta Severidad (`SYSTEM_TAMPERED`).

### Operaciones Protegidas
La auditoría es irreductible e inmutable. El `Soft Delete` obligatorio graba un evento, no elimina la cadena. Ni siquiera los superadministradores pueden borrar registros físicamente.
