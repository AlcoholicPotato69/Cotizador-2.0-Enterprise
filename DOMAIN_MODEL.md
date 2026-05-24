# Modelo de Dominios (Domain Model)

## Contextos Delimitados (Bounded Contexts)

### 1. Identity & Access Management (IAM)
- **Identity**: `User`, `Credential`, `Session`
- **Tenants**: `Tenant`, `TenantConfiguration`, `Subscription`
- **RBAC**: `Role`, `Permission`, `Policy`, `UserRoleAssignment`

### 2. Customer Relationship
- **Clientes**: `Customer`, `ContactPerson`, `Address`
- **CRM**: `Opportunity`, `Lead`, `Activity`, `Note`

### 3. Core Business (Sales & Quoting)
- **Quotes**: `Quote`, `QuoteLineItem`, `PricingRule`, `Discount`
- **Contracts**: `Contract`, `TermsAndConditions`, `RenewalInfo`

### 4. Legal & Documentación
- **Signatures**: `SignatureRequest`, `Signer`, `SignatureLog`
- **Documents**: `DocumentMetadata`, `FileBlob`, `Folder`

### 5. Finanzas
- **Invoices**: `Invoice`, `InvoiceLineItem`, `Tax`
- **Payments**: `PaymentIntent`, `Transaction`, `Refund`

### 6. Operaciones y Observabilidad
- **Notifications**: `NotificationTemplate`, `Message`, `DeliveryReceipt`
- **Reports**: `ReportDefinition`, `Dashboard`, `DataExtract`
- **Audit**: `AuditTrail`, `SystemLog`, `SecurityEvent`

## Relaciones Clave (Zero Trust & Multi Tenant)
- Todos los modelos de todos los dominios (excepto Identity puro) deben incluir y forzar el atributo `TenantId`.
- La lectura/escritura en cualquier dominio debe verificar contra `RBAC` y registrar un evento en `Audit`.
