# MASTER DATA MANAGEMENT STRATEGY (Fase 2.7)

## 1. Propiedad de los Datos (Data Ownership)
Para garantizar la verdad única, se descentraliza la administración:
- **Catálogo de Espacios (Locaciones)**: Propiedad exclusiva del Gerente de Operaciones.
- **Catálogo de Precios y Temporadas**: Propiedad exclusiva del Gerente Comercial.
- **Catálogo de Clientes y Referencias Bancarias**: Propiedad compartida (Comercial crea prospecto, Finanzas valida RFC y asigna Referencia).

## 2. Gobernanza de Catálogos
Cualquier modificación al precio base de un espacio en el TAC guardará un `price_audit_log`. Las cotizaciones vivas no sufrirán impacto gracias a la estrategia de *Snapshots*, pero todas las nuevas cotizaciones utilizarán la nueva tarifa de manera inquebrantable.