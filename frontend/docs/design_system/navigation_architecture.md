# Arquitectura de Navegación

La estructura de navegación está diseñada bajo el patrón de **App Shell** con un panel lateral (Sidebar) colapsable y una barra superior (Top bar) contextual.

## Estructura Global

### Top Bar (Contexto Global)
*   Buscador Global (Atajo: `Ctrl + K` / `Cmd + K`)
*   Indicador de Entorno/Sucursal activa
*   Menú de Usuario (Perfil, Preferencias, Cerrar Sesión)
*   Centro de Notificaciones (Campana con contador)

### Sidebar (Navegación Principal)
El menú lateral se organiza en grupos lógicos para agilizar el acceso mental de los operadores.

**1. Operaciones Comerciales (Core Business)**
*   **Cotizaciones:** Creación, versionado y seguimiento.
*   **Contratos:** Generación, revisión y ciclo de vida de renovaciones.
*   **Firmas:** Estado de e-signatures, envíos pendientes, completados.

**2. Gestión de Recursos (Resources)**
*   **Clientes:** CRM base, historial, KYC.
*   **Espacios:** Inventario físico, tipos de oficina, características.
*   **Ocupación:** Planos interactivos, disponibilidad, gestión de asientos.
*   **Documentos:** Gestor documental asociado a clientes y contratos.

**3. Finanzas (Billing & Finance)**
*   **Facturación:** Emisión de facturas, notas de crédito, integraciones fiscales.
*   **Pagos:** Conciliación, estado de cobranza, links de pago.

**4. Monitoreo y Análisis (Insights)**
*   **Notificaciones:** Historial de alertas de sistema y flujos de negocio.
*   **Reportes:** Dashboards de ventas, ocupación, morosidad y proyecciones.

**5. Sistema y Seguridad (System Admin)**
*   **Configuración:** Parámetros del sistema, plantillas, catálogos (monedas, impuestos).
*   **Auditoría:** Registro inmutable de acciones, visualizador forense, trazabilidad.
*   **Administración:** Usuarios, roles, permisos (RBAC), control de acceso.

## Comportamiento de la Navegación
*   **Pestañas (Tabs) a Nivel de Registro:** Cuando el usuario entra al detalle de un "Cliente" o "Contrato", se abre una vista dedicada con pestañas internas (Resumen, Detalles, Relacionados, Historial) en lugar de una página larga.
*   **Estados Colapsados:** El Sidebar puede colapsarse a "solo íconos" para maximizar el espacio de trabajo en pantallas más pequeñas o durante tareas de concentración alta (como la auditoría visual).
