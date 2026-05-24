# Domain Map: Cotizador 2.0 Enterprise

## 1. Core Domain
**Quoting (Cotizaciones)**
- **Propósito:** Gestionar el ciclo de vida de las cotizaciones comerciales (borrador, en revisión, enviada, aprobada, rechazada).
- **Entidades principales:** `Quote`, `QuoteLine`, `QuoteTerms`, `QuoteApproval`.

## 2. Supporting Domains
**Product Catalog (Catálogo de Productos)**
- **Propósito:** Gestión del inventario virtual, características de los productos, taxonomía y especificaciones técnicas.
- **Entidades principales:** `Product`, `Category`, `Attribute`, `Variant`.

**Pricing Engine (Motor de Precios)**
- **Propósito:** Calcular descuentos, impuestos, y reglas de negocio para establecer precios dinámicos según el cliente y volumen.
- **Entidades principales:** `PriceList`, `DiscountRule`, `TaxRule`, `PriceTier`.

**Customer Management (Gestión de Clientes / CRM Lite)**
- **Propósito:** Mantener el maestro de clientes comerciales, estructura de organizaciones y contactos.
- **Entidades principales:** `Customer`, `Contact`, `Address`, `Account`.

## 3. Generic Domains
**Identity & Access Management (IAM)**
- **Propósito:** Autenticación de usuarios, autorización y control de acceso basado en roles (RBAC/ABAC).
- **Entidades principales:** `User`, `Role`, `Permission`, `Session`.

**Notifications**
- **Propósito:** Envío de comunicaciones omnicanal (Email, SMS, in-app) sobre el estado de las cotizaciones y aprobaciones requeridas.
- **Entidades principales:** `NotificationTemplate`, `NotificationLog`.
