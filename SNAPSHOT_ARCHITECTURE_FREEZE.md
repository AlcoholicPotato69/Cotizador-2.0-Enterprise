# SNAPSHOT ARCHITECTURE FREEZE

**Domain:** Snapshots
**Status:** FROZEN

## Prisma Models
- `Snapshot`: `id`, `tenant_id`, `entity_type`, `entity_id`, `version`, `payload`, `snapshot_hash`

## Domain Events
- `SNAPSHOT_CREATED`: Emitido para notificar al módulo de firmas/aprobaciones que un documento se ha congelado.

## DTO Contracts
- `CreateSnapshotDto`: Especifica el origen y el JSON inmutable.
- `GetSnapshotDto`: Lectura histórica.

## Tenant Isolation Strategy
Aislamiento estricto por `tenant_id`.

## Audit Strategy
La creación de un snapshot desencadena un `AuditLog`.

## Versioning Strategy
Versiones incrementales (`v1`, `v2`). Si el payload es idéntico al último snapshot, la creación se aborta para ahorrar disco.

## Testing Strategy
- **Unit Tests:** Algoritmo de comparación de deltas.
- **E2E Tests:** Recuperación fidedigna del JSON original.
