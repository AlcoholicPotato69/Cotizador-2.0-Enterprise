# Tenant Administration Center

## 1. Visión General
El **Tenant Administration Center** es el corazón operativo de Cotizador 2.0. Diseñado bajo el principio de *Configuration Over Code*, es la interfaz y el repositorio de datos que permite a cada Tenant (Plaza Mayor, Casa de Piedra, etc.) gobernar el 100% de sus reglas de negocio de forma autónoma, sin involucrar al equipo de desarrollo.

## 2. Alcance Administrativo
Este centro unifica la configuración de las siguientes vertientes:

### A) Seguridad y Accesos (RBAC)
- Creación de Roles y gestión de la matriz de Permisos Efectivos.
- Asignación de permisos directos a usuarios.

### B) Motor Documental y Elegibilidad
- Declaración de "Tipos de Documentos" obligatorios (Ej. "Constancia Fiscal").
- Configuración de vigencias de documentos.
- Configuración de reglas que el *Client Eligibility Engine* consumirá (Ej. Bloqueo automático si el documento "INE" expira).

### C) Configuración Financiera y Comercial
- Administrar Tasas de Impuestos (Activar/Desactivar IVA, ISN, Retenciones).
- Crear y modificar Conceptos (Subcategorías de ingresos para ERP).
- Configuración de Catálogo de Espacios (Categorías dinámicas, Zonas).

### D) Constructores de Reglas (Rule Builders)
- Interfaz visual para el **Promotion Engine** (Descuentos y Promociones).
- Interfaz visual para el **Pricing Rules Engine** (Reglas de precio base y temporada).

### E) Motor de Plantillas y Branding
- Editor WYSIWYG/Code para las Plantillas HTML de Contratos, Cotizaciones y Recibos.
- Parámetros de Branding por Tenant (Logo URL, Primary Color, Footers Legales).

## 3. Principio Arquitectónico
El Administration Center interactúa directamente con PocketBase creando y editando registros en colecciones dedicadas al sistema (Ej. `tenant_config`, `tax_rules`, `document_requirements`, `templates`).
Ningún módulo comercial (Cotizador, Expediente, Contratos) posee lógica dura; todos consultan los datos generados por este módulo en tiempo de ejecución.

## 4. Beneficios Operativos
- **Autonomía**: Un cambio en una cláusula de contrato en Plaza Mayor se refleja de inmediato sin redespliegue.
- **Auditoría Central**: Todas las configuraciones guardadas en el Tenant Admin generan un `audit_log`, detallando quién cambió una regla de IVA o alteró una promoción comercial.
