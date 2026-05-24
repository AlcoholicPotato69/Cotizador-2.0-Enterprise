# Grafo de Dependencias (Dependency Graph)

El sistema busca minimizar las dependencias síncronas entre dominios. La mayoría de las interacciones se realizan asíncronamente mediante Eventos.

## Dependencias Core (Transversales e Inyectadas)
- **Audit**: Nadie depende de Audit síncronamente. Audit escucha a todos.
- **Tenants**: Base para aislar la data de todos los dominios.
- **Identity & RBAC**: Dependencia síncrona obligatoria (vía API Gateway/Middleware) para Zero Trust. Todo request debe ser validado por estos dominios antes de llegar al negocio.

## Flujo de Negocio (Dependencias Causales)

1. **CRM -> Clientes**
   - Una oportunidad de CRM requiere un Cliente existente.
2. **Quotes -> CRM / Clientes**
   - Una cotización se genera en base a una oportunidad o directamente para un cliente.
3. **Contracts -> Quotes**
   - El contrato se instancia a partir de los ítems y precios pactados en una Quote aprobada.
4. **Signatures -> Contracts / Documents**
   - El proceso de firma requiere un contrato y generar documentos inmutables.
5. **Invoices -> Contracts / Clientes**
   - La facturación se dispara según los términos del contrato firmado.
6. **Payments -> Invoices**
   - Los pagos concilian facturas pendientes.

## Servicios de Utilidad (Invocados por cualquier dominio)
- **Documents**: Quotes, Contracts e Invoices dependen de este dominio para almacenar PDFs y anexos.
- **Notifications**: Invocado (generalmente de forma asíncrona) por Signatures (enviar request de firma), Payments (recibos) e Identity (recuperación de clave).
- **Reports**: Lee datos agregados de todos los dominios (idealmente desde réplicas de solo lectura o un Data Warehouse) para no afectar el rendimiento transaccional.
