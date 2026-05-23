# 09 - RBAC Rules (Permission-First Architecture)

## 1. Principio Fundamental: PERMISSION-FIRST
El sistema de autorización NO está basado en roles, está basado estricta y exclusivamente en **Permisos**.
Los roles son únicamente agrupaciones lógicas y reutilizables de permisos. El nombre de un rol (ej. "Admin", "Ventas", "Supervisor") **NUNCA** tiene significado técnico dentro de la plataforma.

Queda estrictamente prohibida la lógica en frontend o backend del tipo:
- `if role == 'admin'`
- `if role.includes('verificador')`

Toda autorización se resuelve mediante:
`effectivePermissions`

## 2. Multirol y Permisos Directos
Cotizador 2.0 abandona el esquema de "Rol Único Fijo". 
- Un usuario puede tener **Múltiples Roles** (Ej. Comercial + Reportes).
- Un usuario puede tener **Permisos Directos** (Excepciones específicas, como `contracts.approve`, otorgado sin tener que modificar o crear roles).

## 3. Effective Permissions (Permisos Efectivos)
El motor RBAC del backend calcula en tiempo real/evento una bolsa única de permisos (`effective_permissions`) que consiste en la unión matemática de todos los permisos heredados de sus N roles, más los permisos directos.

El backend protege cada registro utilizando reglas dinámicas basadas exclusivamente en permisos, por ejemplo:
`@request.auth.effective_permissions ?~ "quotes.approve"`

Incluso el acceso total de sistema no depende de un nombre de rol, sino del permiso `system.full_access` (o poseer explícitamente todos los permisos).

## 4. Tenant-Aware RBAC
El control de acceso siempre se intersecta con la restricción del Tenant. 
Dos tenants pueden tener roles con el **mismo nombre** pero permisos distintos.

**Ejemplo Casa de Piedra:**
- Rol: `Comercial`
- Permisos: `["quotes.create", "events.manage", "rooms.manage"]`

**Ejemplo Plaza Mayor:**
- Rol: `Comercial`
- Permisos: `["quotes.create", "campaigns.manage"]`

El sistema soporta esto naturalmente porque la base de datos valida **permisos**, no nombres de roles. Además, toda lectura cruza con:
`@request.auth.allowed_tenants ?= tenant`
