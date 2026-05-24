# Diseño de APIs (API Design)

## Principios Zero Trust & Multi-Tenant
1. **Autenticación**: Todo request requiere un token válido (ej. JWT) firmado criptográficamente.
2. **Autorización (RBAC)**: Cada endpoint valida los claims de permisos requeridos.
3. **Tenant Context**: El `Tenant-ID` debe derivarse del token seguro, no de los parámetros del payload para evitar escalamiento de privilegios.

## Estructura de Endpoints (REST / GraphQL)

### IAM & Config
- `POST /api/v1/auth/login` -> Identity
- `GET /api/v1/tenants/me` -> Tenants
- `GET /api/v1/rbac/permissions` -> RBAC

### Negocio (Tenant Scoped)
- `GET /api/v1/customers` -> Clientes
- `POST /api/v1/crm/opportunities` -> CRM
- `POST /api/v1/quotes` -> Quotes (Motor de creación)
- `POST /api/v1/quotes/{id}/approve` -> Quotes (Cambio de estado)

### Legal & Operaciones
- `POST /api/v1/contracts` -> Contracts
- `POST /api/v1/signatures/request` -> Signatures
- `POST /api/v1/documents/upload` -> Documents

### Finanzas
- `POST /api/v1/invoices` -> Invoices
- `POST /api/v1/payments/process` -> Payments

### Observabilidad
- `GET /api/v1/reports/execute` -> Reports
- `GET /api/v1/audit/logs` -> Audit (Restringido a roles de Compliance)

## Estándar de Respuestas
Todo endpoint debe retornar un envoltorio estandarizado:
```json
{
  "success": true,
  "data": {},
  "metadata": {
    "tenant_id": "...",
    "request_id": "...",
    "timestamp": "..."
  },
  "errors": []
}
```
