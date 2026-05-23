# RBAC Architecture (Permission-First)

## 1. Visión General
El sistema RBAC de Cotizador 2.0 Enterprise está diseñado bajo el paradigma **Permission-First**. Los nombres de los roles son irrelevantes para el código fuente; la autorización recae al 100% en una matriz de `effectivePermissions`.

La Fuente de Verdad es siempre el Backend (PocketBase), y el Frontend se limita a consumir resultados pre-calculados sin reevaluar jerarquías o nombres.

---

## 2. Modelado de Datos (Catálogos y Relaciones)

El dominio RBAC se compone de las siguientes colecciones atómicas:

### A) `roles` (Agrupadores de Permisos)
Definen agrupaciones reutilizables de permisos. Totalmente configurables.
- `name` (text): Etiqueta visual (Ej. "Administrador Tenant", "Comercial").
- `slug` (text): `admin_tenant`, `comercial`.
- `permissions` (json array): `["clients.view", "clients.create", "quotes.approve"]`.
- `tenant` (relation): Opcional. Permite aislar el rol a una unidad de negocio particular.

### B) `users` (Usuarios)
Almacena la identidad y consolida el acceso.
- `roles` (relation, multiple): Soporta multirol.
- `direct_permissions` (json array): Permisos específicos otorgados independientemente de los roles.
- `effective_permissions` (json array): **CAMPO CALCULADO**. La unión pura de todos los permisos.
- `allowed_tenants` (relation, multiple): Restricción de Tenant.

---

## 3. El Motor de Permisos (Permission Engine)

Implementado en el Backend usando PocketBase Javascript Hooks (`pb_hooks/rbac.pb.js`).

Cuando se crea/actualiza un usuario, o cuando se modifican los permisos de un rol, un trigger ejecuta el siguiente cálculo de unión pura:
```javascript
effectivePermissions = Union(
    User.roles.map(role => role.permissions),
    User.direct_permissions
)
```
Este array resultante se guarda estáticamente.

### API Rules en PocketBase (Backend)
Las validaciones son extremadamente eficientes:
`@request.auth.effective_permissions ?~ "clients.view"`
Superusuarios:
`@request.auth.effective_permissions ?~ "system.full_access"`

### Consumo en el Frontend
El frontend **NUNCA** calcula permisos ni pregunta por roles.
```vue
<Button v-if="hasPermission('contracts.approve')" label="Aprobar" />
```
La visibilidad del Navbar, Dashboard y submenús depende exclusivamente de esta misma función.

---

## 4. Permission Registry (Catálogo Centralizado)
Catálogo oficial de permisos del sistema:

**Clients**
- `clients.view`
- `clients.create`
- `clients.edit`
- `clients.delete`

**Documents / Compliance**
- `documents.view`
- `documents.upload`
- `documents.verify`
- `documents.approve`
- `documents.reject`

**Quotes**
- `quotes.view`
- `quotes.create`
- `quotes.edit`
- `quotes.delete`
- `quotes.approve`

**Contracts**
- `contracts.view`
- `contracts.create`
- `contracts.edit`
- `contracts.approve`

**Invoices**
- `invoices.view`
- `invoices.create`
- `invoices.edit`
- `invoices.cancel`

**Reports**
- `reports.view`
- `reports.export`

**Catalog & Spaces**
- `spaces.view`
- `spaces.manage`
- `campaigns.manage`
- `events.manage`
- `rooms.manage`

**System & Config**
- `config.view`
- `config.manage`
- `control.access`
- `users.manage`
- `roles.manage`
- `permissions.manage`
- `tenants.manage`
- `system.full_access` (Super User Override)

Cada módulo UI declara explícitamente en su inicialización qué permisos requiere de este catálogo.

---

## 5. Tenant-Aware RBAC (Ejemplos Reales)

El sistema soporta que distintos tenants tengan el **mismo rol** pero **distintos permisos**, sin modificar código.

**Tenant Plaza Mayor**
- Rol: `Comercial`
- Permisos: `["quotes.create", "campaigns.manage", "clients.view"]`

**Tenant Casa de Piedra**
- Rol: `Comercial`
- Permisos: `["quotes.create", "events.manage", "rooms.manage", "clients.view"]`

Como el Frontend y Backend evalúan `"campaigns.manage"` o `"events.manage"` y jamás el nombre `"Comercial"`, la UI se adapta a cada Tenant automáticamente ocultando el panel de Campañas a los usuarios de Casa de Piedra.

---

## 6. Auditoría
Registrada inmutablemente en la colección `audit_logs`:
- Asignaciones de roles.
- Cambios de permisos en roles.
- Elevación de privilegios (Permisos directos).
- *Payload* completo del cambio y Actor (ID del usuario/admin que modificó).

---

## 7. Prueba de Escalabilidad (Demostración)

La arquitectura soporta las siguientes operaciones dinámicas **SIN modificar una sola línea de código fuente**:

1. **Crear un nuevo rol**: Se inserta un registro en la tabla `roles`.
2. **Renombrar un rol**: Se edita la columna `name` del rol. El sistema sigue funcionando igual, pues la autorización es por permisos.
3. **Eliminar un rol**: Al borrar de PocketBase, los `users` vinculados pierden los permisos del rol, y el Hook recalcula sus `effective_permissions` de inmediato.
4. **Crear un nuevo tenant**: Insertar en tabla `tenants`.
5. **Crear un nuevo permiso**: Se inventa un string (`agenda.view`), se registra en UI/BD, y se evalúa en el Frontend. PocketBase lo soporta al vuelo.
6. **Asignar permisos directos**: Se añade `"contracts.approve"` al array `direct_permissions` de un usuario. El Hook efectúa la unión y el usuario gana acceso instantáneo.
7. **Combinar múltiples roles**: Se agregan N roles a la relación `roles` de un usuario. El Hook unifica automáticamente.
