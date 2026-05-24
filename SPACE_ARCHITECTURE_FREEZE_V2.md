# SPACE ARCHITECTURE FREEZE V2

**Domain:** Spaces
**Status:** FROZEN (V2)

## Prisma Models
`Space`
- `id`, `tenant_id`
- `name` (String)
- `type` (Enum: HALL, ROOM, OPEN_AREA)
- `capacity` (Int)
- `areaSqm` (Float)
- `basePricePerHour` (Float)
- `status` (Enum: AVAILABLE, PRE_RESERVED, RESERVED, CONTRACTED, BLOCKED, MAINTENANCE, RELEASED, DECOMMISSIONED)
- *Audit Fields:* `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`

## Snapshot Readiness
- Se implementará un `SpaceSnapshotDTO` inmutable. Todo contrato, cotización o factura que consuma un `Space` no apuntará al ID vivo de `Space`, sino que generará una copia en el dominio `Snapshots` y almacenará la referencia al Snapshot Hash, garantizando que cambios futuros de precio no afecten operaciones históricas.

## Integración con Approval Engine
- Los estados `BLOCKED` y `MAINTENANCE` requerirán la invocación del `ApprovalEngine`. Un `Space` no puede entrar en mantenimiento sin un `ApprovalRequest` validado y aprobado por los actores correspondientes.

## Domain Events Emitidos
- `SPACE_CREATED`
- `SPACE_UPDATED`
- `SPACE_BLOCKED`
- `SPACE_RELEASED`
