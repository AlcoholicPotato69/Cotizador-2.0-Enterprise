# Event Catalog (Event-Driven Architecture)

Catálogo oficial de Eventos de Dominio en el sistema, emitidos primariamente para desencadenar efectos colaterales de manera desacoplada.

### 1. `quote.created`
- **Publisher**: `Quote Context`
- **Payload**: `{ quoteId: string, customerId: string, totalAmount: number, timestamp: Date }`
- **Subscribers**: 
  - *Notifications* (Alerta al equipo comercial)
  - *ERP Context* (Inicia sincronización paralela en modo borrador).

### 2. `quote.approved`
- **Publisher**: `Quote Context`
- **Payload**: `{ quoteId: string, approvedByUserId: string, isAutoApproved: boolean, timestamp: Date }`
- **Subscribers**: 
  - *ERP Context* (Convierte a Orden de Venta "Sales Order" en el ERP)
  - *Notifications* (Notifica al cliente con PDF adjunto).

### 3. `product.price.changed`
- **Publisher**: `Pricing Context`
- **Payload**: `{ productId: string, oldPrice: number, newPrice: number, effectiveDate: Date }`
- **Subscribers**: 
  - *Quote Context* (Marca cotizaciones en estado "Borrador" que contengan este producto para forzar recálculo antes de envío).

### 4. `customer.updated`
- **Publisher**: `Customer Context`
- **Payload**: `{ customerId: string, changedFields: string[] }`
- **Subscribers**: 
  - *ERP Context* (Encola actualización de datos maestros hacia el CRM central o ERP).
  - *Quote Context* (Actualiza datos de facturación en snapshots activos).
