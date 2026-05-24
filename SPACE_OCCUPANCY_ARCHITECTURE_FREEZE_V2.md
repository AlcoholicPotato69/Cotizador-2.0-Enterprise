# SPACE OCCUPANCY ARCHITECTURE FREEZE V2

**Domain:** Space Occupancy
**Status:** FROZEN (V2)

## Prisma Models
`SpaceOccupancy`
- `id`, `tenant_id`
- `spaceId` (FK)
- `occupancySourceType` (String - ej. 'QUOTE', 'CONTRACT', 'INTERNAL')
- `occupancySourceId` (String - ID del snapshot o documento que origina la ocupación)
- `eventName` (String)
- `startTime` (DateTime)
- `endTime` (DateTime)
- `status` (Enum: HOLD, RESERVED, CONTRACTED, COMPLETED, CANCELLED, EXPIRED, RELEASED)
- *Audit Fields:* `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by`

`SpaceOccupancyHistory`
- Historial inmutable para rastrear todo cambio de fechas y estados de la ocupación, facilitando auditorías.

## Estrategia Formal Anti-Overbooking
Se delega la protección al motor de base de datos PostgreSQL:
1. **Serializable Isolation:** Toda transacción que intente crear o modificar un `SpaceOccupancy` utilizará el nivel de aislamiento `SERIALIZABLE` en Prisma.
2. **Conflict Validation:** Se ejecutará una validación física `(new_start < end AND new_end > start)` bloqueando el registro de `Space` mediante `SELECT ... FOR UPDATE` para evitar Race Conditions bajo alta concurrencia.

## Domain Events Emitidos
- `OCCUPANCY_CREATED`
- `OCCUPANCY_RESERVED`
- `OCCUPANCY_CONTRACTED`
- `OCCUPANCY_CANCELLED`
- `OCCUPANCY_COMPLETED`
