# FRONTEND AUTHORIZATION ARCHITECTURE

## 1. Misión (Permission-Driven UI)
Todo pixel renderizado en la interfaz del Cotizador 2.0 Enterprise obedece a una única ley: **Los permisos efectivos**. Las palabras `admin`, `ventas` o `gerente` están absolutamente erradicadas del código fuente. Todo componente visible debe responder a la pregunta: *¿Por qué se muestra esto?* y la respuesta será la validación criptográfica contra el `EffectivePermissionsEngine`.

## 2. Los 5 Niveles de Autorización (Authorization Layers)

### 1. Route-Level Authorization
El `Vue Router` actúa como la muralla principal. Toda ruta evalúa sus `meta.requiredPermissions`. Si el usuario no tiene el permiso (Ej. `clients.read`), se ejecuta un guard que:
1. Bloquea el renderizado.
2. Redirecciona al `/dashboard`.
3. Dispara un log de auditoría (Intento de acceso no autorizado registrado).

### 2. Module-Level Authorization
Las secciones principales del sistema operan condicionalmente.
Ejemplo: El módulo "Cotizaciones" completo está envuelto lógicamente. Si el usuario pierde `quotes.read`, el sistema no carga ni el listado, ni los botones, ni los filtros, matando el módulo por completo.

### 3. Component-Level Authorization
Los componentes atómicos evalúan permisos directos. 
Ejemplo: Dentro de `ClientsView`, el botón de `+ Nuevo Cliente` solo existe si `hasPermission('clients.create')` retorna `true`.

### 4. Action-Level Authorization
Para operaciones destructivas o críticas, el permiso no se hereda de la capacidad de leer. 
Ejemplo: Un usuario con `contracts.read` puede ver el contrato, pero el botón "Anular" y su llamada a la API subyacente exigen estrictamente `contracts.cancel`.

### 5. Field-Level Authorization (Future-Proofing)
La arquitectura está preparada para ocultar campos individuales.
Ejemplo: Componentes como `<ClientDataCard>` evaluarán `hasPermission('clients.sensitive_data')`. Si es falso, los campos como `RFC` y `Domicilio Fiscal` mostrarán "Datos Ocultos - Permisos Insuficientes", protegiendo datos regulados.

## 3. Motores Dinámicos

### Dynamic Navigation Engine (Navbar & Sidebar)
Se erradican los menús hardcodeados en el `MainLayout`. El menú lateral es un componente iterativo que lee un array de rutas potenciales. Antes de dibujar cada ítem, consulta al `EffectivePermissionsEngine`. Si el usuario no tiene acceso a la Configuración (`config.read`), el ítem "Configuración" jamás se renderiza en el DOM.

### Dynamic Dashboard Engine
El Dashboard ya no es estático. Es un grid componible.
Los *Widgets* (Ej. "Cotizaciones Pendientes", "Contratos Vencidos", "Reporte Financiero") están registrados con requerimientos de permiso.
El Dashboard dibujará únicamente las métricas que el usuario tiene permitido ver (Ej. Si no tiene `billing.read`, el KPI de Ingresos no existirá para él).

## 4. AppShell Authority
El "State Management" de permisos vive exclusivamente en el nivel superior (AppShell / Layout Principal). El `EffectivePermissionsEngine` se hidrata tras el Login y la selección del Tenant. Las vistas hijas (ClientsView, QuotesView) consumen inyecciones globales (vía `provide/inject` o Stores globales) y jamás calculan su propia seguridad. Esto garantiza que una revocación de permisos propague el cierre de componentes instantáneamente en toda la app.
