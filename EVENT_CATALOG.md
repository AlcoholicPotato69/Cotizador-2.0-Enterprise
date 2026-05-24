# Catálogo de Eventos (Event Catalog)

La arquitectura es Event-Driven para lograr bajo acoplamiento entre dominios y satisfacer la regla "Audit Everything". Todos los eventos viajan a través de un Message Broker / Event Bus.

## Estructura del Evento (CloudEvents)
```json
{
  "specversion": "1.0",
  "type": "Domain.Action.Outcome",
  "source": "/domain/service",
  "id": "UUID",
  "time": "ISO-8601",
  "tenant_id": "UUID",
  "actor_id": "UUID",
  "data": {}
}
```

## Eventos por Dominio

### Identity & Tenants
- `Identity.User.Created`
- `Identity.Session.Started` (Gatilla Audit)
- `Tenant.Config.Updated`

### Clientes & CRM
- `Customer.Profile.Created`
- `CRM.Opportunity.Won` (Gatilla creación de Quote)

### Quotes
- `Quote.Draft.Created`
- `Quote.Pricing.Calculated`
- `Quote.Status.Approved` (Gatilla creación de Contract)

### Contracts & Signatures
- `Contract.Document.Generated`
- `Signature.Request.Sent` (Gatilla Notification)
- `Signature.Document.Signed` (Gatilla Invoice)

### Finanzas
- `Invoice.Document.Issued`
- `Payment.Transaction.Succeeded` (Gatilla Notification, actualiza CRM/Invoice)
- `Payment.Transaction.Failed`

### Operaciones
- `Document.File.Uploaded`
- `Notification.Email.Delivered`

## Consumidor Obligatorio
El dominio **Audit** está suscrito silenciosamente a **todos** los eventos (`*.*.*`) para registrar la trazabilidad histórica del sistema entero sin afectar el rendimiento transaccional.
