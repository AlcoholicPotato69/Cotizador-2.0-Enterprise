# ROLE PERMISSION MATRIX FINAL

**Status:** FROZEN
**Date:** 2026-05-23

## Principio Básico
Se prohíbe el uso de validaciones de código muerto como `if(user.role === 'Admin')`. 
Toda validación viaja por el `PermissionsGuard` de NestJS verificando un array de capacidades asociadas al Token JWT.

## Capacidades (Permissions) Registradas

### System & Settings
- `settings.view`, `settings.update`, `settings.rollback`
- `audit.view`, `audit.export`
- `approvals.override`

### CRM (Clients)
- `clients.create`, `clients.view`, `clients.update`, `clients.delete`
- `compliance.override_contract`, `compliance.override_invoice`

### Operations (Spaces)
- `spaces.create`, `spaces.update`, `spaces.decommission`
- `occupancy.hold`, `occupancy.reserve`, `occupancy.cancel`
- `occupancy.override_overbooking` (Permiso especial)

### Commercial (Quotes)
- `quotes.create`, `quotes.send`, `quotes.approve`, `quotes.reject`

### Legal (Contracts & Signatures)
- `contracts.draft`, `contracts.renew`, `contracts.terminate`
- `signatures.request`, `signatures.delegate`, `signatures.void`

### Financial (Billing & Payments)
- `invoices.draft`, `invoices.stamp`, `invoices.void`
- `payments.review`, `payments.approve`, `payments.reject`

## Asignación Base (Dinámica en Base de Datos)
Los administradores del Tenant construyen Roles mapeando estos permisos. El backend solo audita la existencia del string `action` en la sesión autenticada.
