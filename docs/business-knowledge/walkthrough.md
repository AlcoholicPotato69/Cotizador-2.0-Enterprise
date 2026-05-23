# Entregable de Fase F.1: Gobernanza y Builders Fundamentales

Atendiendo tu directiva arquitectónica obligatoria, se ha transformado completamente la gobernanza y administración de la plataforma. **El sistema ya no depende de nombres de roles ni lógica hardcodeada**, migrando hacia una arquitectura 100% *Permission-Driven*.

## 1. Estado de Migraciones PB
Se ha creado la migración definitiva `1710000013_rbac_normalization.js` implementando el esquema relacional riguroso:
- `rbac_permissions` (entidad completa con metadata)
- `rbac_roles`
- `rbac_role_permissions`
- `rbac_user_roles`
- `rbac_user_direct_permissions`
- `admin_audit_log` para registrar cada movimiento.

## 2. Estado del Effective Permissions Engine
Se ha implementado `EffectivePermissionsEngine.ts`.
Este motor centralizado captura: `Roles(User, Tenant) + DirectPermissions(User, Tenant)`, y consolida un `Set` único de permisos efectivos, garantizando el aislamiento por Tenant y la ausencia de validaciones `if(role === 'admin')`.

## 3. Estado del permissionsStore (Pinia)
Se ha implementado el almacén global `permissionsStore.ts` que nutre al frontend. Se hidrata dinámicamente al iniciar sesión o cambiar de Tenant, ofreciendo funciones como `can('quotes.read')`, `canAny([...])`, y `canAll([...])`.

## 4. Arquitectura Frontend Permission-Driven
- **Rutas (Route-Level)**: `router/index.ts` ahora inyecta un guardián global. Rutas como `/admin` exigen el `meta.permission: 'config.manage'`. Si no se cumple, el usuario es bloqueado antes de dibujar la página.
- **Directivas (Component/Action-Level)**: Se crearon directivas globales de Vue (`v-permission`, `v-can-any`).
- **Navegación Dinámica**: El `MainLayout.vue` ha sido refactorizado. Los botones laterales (Sidebar) inyectan `v-permission`. Un usuario de "Ventas" sin acceso al Catálogo ni a la Administración simplemente **no verá** esos menús.

## 5. Estado de los Builders (Tenant Administration Center)

Los Builders fundamentales fueron construidos respetando tu mandato de "Configuration over code":

### RbacBuilder.vue & PermissionSimulator.vue
- Se integra en la pestaña "Gobernanza & Roles".
- Permite construir los roles atando permisos por módulo visualmente.

### RuleBuilder.vue
- Motor visual de reglas multi-propósito (`pricing`, `eligibility`, `promotion`, `occupancy`).
- Construido con una abstracción visual de AST (Árbol de Sintaxis Abstracta) para anidar lógicas (AND/OR/NOT).
- Soporta *Flags* críticos: **Exclusividad** (para rechazar promociones paralelas) y **Hard Abort** (`stop_processing`).
- Implementa **estrategia de versionado duro**: Toda edición archiva la anterior y crea una nueva versión para no afectar contratos históricos.
- Inyecta trazabilidad al `admin_audit_log`.

### SpaceBuilder.vue
- Editor visual del catálogo.
- Implementa formalmente las **Occupancy Policies**: `exclusive` (bloqueo total), `shared` (sobreventa) o `segmented` (campañas).

### DocReqBuilder.vue
- Define la lista de requisitos documentales por Tipo de Persona, alimentando directamente la vista `ClientFileView` y al *Eligibility Engine*.

> [!TIP]
> **Evidencia de Integración:** Todo se orquesta bajo el `AdminView.vue`, el cual actúa como host modular de pestañas (Tabs) de los distintos Builders. Solo cargan si el `v-permission` lo autoriza.

## Riesgos y Pendientes
- **Riesgo:** El cálculo de *Effective Permissions Engine* sobre tenants con miles de permisos directos puede requerir *caching* avanzado en Redis a largo plazo.
- **Pendientes para F.2:** Habiendo estabilizado Gobernanza y el Universal Rule Engine, el sistema está listo para construir la Fase F.2 (Promotions Builder, Pricing Builder, Taxes Builder, Templates Builder).
