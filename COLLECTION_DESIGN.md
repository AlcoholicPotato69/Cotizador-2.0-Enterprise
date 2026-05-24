# Diseño de Colecciones (Collection Design)

Alineados al principio Multi-Tenant y Audit Everything, las colecciones/tablas base tendrán las siguientes estructuras abstractas.

## Estructura Base de Datos (Reglas Multi-Tenant)
Todas las colecciones de negocio deben implementar:
```json
{
  "_id": "ObjectId / UUID",
  "tenant_id": "UUID",
  "created_at": "Timestamp",
  "updated_at": "Timestamp",
  "created_by": "UUID (User)",
  "updated_by": "UUID (User)"
}
```

## Colecciones Principales

### Domain: Tenants
- `tenants`: Información de los inquilinos.
- `tenant_configs`: Parámetros de aislamiento y customización.

### Domain: Identity & RBAC
- `users`: Credenciales e identidades.
- `roles`: Roles disponibles por Tenant.
- `permissions`: Permisos atómicos.

### Domain: Clientes & CRM
- `customers`: Perfil del cliente.
- `crm_opportunities`: Ciclo de venta asociado a un cliente.

### Domain: Quotes
- `quotes`: Encabezado de la cotización.
- `quote_items`: Líneas de detalle.
- `pricing_rules`: Motores de precio aplicables.

### Domain: Contracts & Signatures
- `contracts`: Acuerdos formalizados a partir de Quotes.
- `signature_requests`: Tracking de firmas sobre documentos de contratos.

### Domain: Documents
- `documents`: Metadatos de archivos (Blob storage referenciado).

### Domain: Invoices & Payments
- `invoices`: Relacionadas a Contracts/Quotes.
- `payments`: Transacciones procesadas e integraciones con pasarelas.

### Domain: Audit (Append-Only, Inmutable)
- `audit_logs`:
```json
{
  "_id": "UUID",
  "tenant_id": "UUID",
  "timestamp": "ISO-8601",
  "actor_id": "UUID",
  "action": "CREATE | UPDATE | DELETE | READ",
  "resource": "Domain/Collection",
  "resource_id": "UUID",
  "ip_address": "String",
  "changes": { "before": {}, "after": {} }
}
```
