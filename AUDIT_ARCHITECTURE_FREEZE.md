# AUDIT ARCHITECTURE FREEZE

**Domain:** Audit Engine
**Status:** FROZEN

## Prisma Models
- `AuditLog`: `id`, `tenant_id`, `user_id`, `action`, `entity_type`, `entity_id`, `payload`, `current_hash`, `previous_hash`, `chain_hash`

## Domain Events
- `AUDIT_LOG_CREATED`: Emitido internamente para particionamiento asíncrono.

## DTO Contracts
- N/A. Módulo de solo lectura para frontend. `CreateAuditDto` usado internamente por interceptores.

## Tenant Isolation Strategy
Los registros de auditoría están estrictamente particionados por `tenant_id`.

## Audit Strategy
El motor de auditoría es la última línea de defensa. Implementa *Hash Chaining* criptográfico iterativo.

## Versioning Strategy
Los registros de auditoría son INMUTABLES (`UPDATE` y `DELETE` bloqueados a nivel de PostgreSQL Trigger).

## Testing Strategy
- **Unit Tests:** Validar la exactitud matemática del Hash Chain.
- **E2E Tests:** Intentos de mutación o borrado deben fallar.
