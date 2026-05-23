# DOCUMENT ACTIONS ARCHITECTURE (Fase 4.2)

## 1. Topbar Documental Estándar
El `DsDocumentViewer` expondrá una barra superior de herramientas (Toolbar) que renderizará dinámicamente las siguientes acciones, siempre y cuando el `permissionsStore` lo autorice:
- **Download**: Descarga del binario físico (`document.download`).
- **Print**: Impresión enmascarada del Canvas (`document.print`).
- **Open External**: Apertura en nueva pestaña mediante Presigned URL temporal (`document.view_external`).
- **Copy UUID / Copy Hash**: Acciones de auditoría rápida al portapapeles (`document.audit`).

## 2. Segregación de Vistas
Las vistas profundas operan como "Tabs" o "Drawers" hijos dentro del Workspace:
- **View Audit Trail**: Despliega la línea de tiempo de visualizaciones y aprobaciones.
- **View Metadata**: Despliega el Tenant, Cliente y Hashes criptográficos.
- **View Snapshot**: Permite ver el JSON congelado que originó este documento.