# RBAC PERMISSION CATALOG

## Misión
Este catálogo es la única fuente de verdad para la autorización en Cotizador 2.0 Enterprise.
**PROHIBICIÓN ESTRICTA**: El código fuente nunca evaluará roles (Ej. `if (user.role == 'admin')`). El sistema solo preguntará por permisos efectivos (Ej. `if (hasPermission('quotes.approve'))`).

## 1. Permisos Atómicos Fundamentales

### Clientes (`clients.*`)
- `clients.read`: Ver listado y detalles de expedientes.
- `clients.create`: Registrar nuevos prospectos o clientes.
- `clients.update`: Editar datos fiscales o de contacto.
- `clients.delete`: Archivar (soft-delete) expedientes.

### Cotizaciones (`quotes.*`)
- `quotes.read`: Visualizar cotizaciones existentes.
- `quotes.create`: Iniciar el Wizard y emitir cotizaciones.
- `quotes.update`: Editar espacios o fechas en cotizaciones en borrador.
- `quotes.delete`: Cancelar cotizaciones.
- `quotes.approve`: Autorizar una cotización para que proceda a contrato.

### Contratos (`contracts.*`)
- `contracts.read`: Leer documentos legales y anexos.
- `contracts.create`: Generar contrato a partir de una cotización aprobada.
- `contracts.approve`: Firma y activación legal del contrato.
- `contracts.cancel`: Anulación de contrato (requiere justificación).
- `contracts.override`: Capacidad excepcional de forzar la generación de un contrato brincando un bloqueo de elegibilidad.

### Requisitos Documentales (`documents.*`)
- `documents.read`: Ver archivos adjuntos.
- `documents.upload`: Subir archivos al expediente.
- `documents.verify`: Marcar un documento como válido/legal.
- `documents.reject`: Rechazar un documento exigiendo su reemplazo.

### Financiero y Facturación (`billing.*`)
- `billing.read`: Ver estado de cuenta, recibos y facturas de un contrato.
- `billing.create`: Registrar un pago (emitir recibo) o subir factura manual.
- `billing.validate`: Aprobar facturas contra el CFDI Validation Engine.
- `billing.cancel`: Reversión de pagos.

### Catálogo de Espacios (`spaces.*`)
- `spaces.read`: Ver tarifas y disponibilidad.
- `spaces.manage`: Crear o editar salones, aforos, y `occupancy_policies`.

### Configuración del Tenant (`config.*`)
- `config.read`: Ver impuestos, plantillas, promociones vigentes.
- `config.manage`: Editar reglas de negocio (Rule Builder), branding y settings globales.

### Seguridad y Gobernanza (`security.*`)
- `users.read`: Ver usuarios del tenant.
- `users.manage`: Invitar o revocar accesos.
- `roles.read`: Ver configuración de roles.
- `roles.manage`: Crear y editar roles y plantillas.
- `permissions.read`: Ver matriz de seguridad.
- `permissions.manage`: Asignar permisos directos o roles a usuarios.
- `audit.view`: Acceder al `admin_audit_log` global.

## 2. Lógica de Agrupación (Multi-Tenant)
Los permisos son **Tenant-Scoped**. 
El `Effective Permissions Engine` calculará la intersección:
`Permisos Efectivos = (Permisos del Rol A + Permisos del Rol B + Permisos Directos) filtrados por TenantID activo`.
