# SETTINGS ARCHITECTURE FREEZE

**Domain:** Settings
**Status:** FROZEN

## Prisma Models
- `TenantSettings`: `id`, `tenant_id`, `timezone`, `currency`, `language`
- `BillingSettings`: `id`, `tenant_id`, `tax_rate`, `invoice_prefix`

## Domain Events
- `SETTINGS_UPDATED`: Disparado cuando cualquier política global o de tenant cambia.

## DTO Contracts
- `UpdateTenantSettingsDto`: Contiene zona horaria, moneda base.
- `UpdateBillingSettingsDto`: Contiene tasas de IVA y prefijos fiscales.

## Tenant Isolation Strategy
Todo query a Settings utilizará el `tenant_id` extraído por el `TenantContextService`.

## Audit Strategy
Cualquier modificación será registrada en `AuditLog` con su respectivo `chain_hash`.

## Versioning Strategy
Las configuraciones no se sobrescriben destructivamente. Todo update genera una nueva versión en `SettingsHistory`.

## Testing Strategy
- **Unit Tests:** Pruebas sobre la resolución de políticas con valores por defecto.
- **E2E Tests:** Validar mutación y lectura protegida.
