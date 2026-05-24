# APPROVAL ARCHITECTURE FREEZE

**Domain:** Approval Engine
**Status:** FROZEN

## Prisma Models
- `ApprovalRequest`: `id`, `tenant_id`, `entity_type`, `entity_id`, `status` (PENDING, APPROVED, REJECTED, EXPIRED).
- `ApprovalStep`: `id`, `request_id`, `approver_id`, `decision`.

## Domain Events
- `APPROVAL_REQUESTED`, `APPROVAL_GRANTED`, `APPROVAL_REJECTED`.

## DTO Contracts
- `CreateApprovalRequestDto`, `ProcessApprovalStepDto`.

## Tenant Isolation Strategy
Múltiples empresas (Tenants) pueden tener flujos de aprobación radicalmente distintos. Separación obligatoria.

## Audit Strategy
Toda decisión (Aprobar/Rechazar) guarda IP, timestamp, y `chain_hash`.

## Versioning Strategy
Si la entidad base muta mientras la aprobación está PENDING, el Request original se invalida.

## Testing Strategy
- **Unit Tests:** Máquina de estados (Evitar salto de PENDING a APPROVED si faltan pasos).
- **E2E Tests:** Flujos multinivel (e.g. Gerente -> Director).
