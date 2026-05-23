# DATABASE SCHEMA AUDIT

**Generado:** 2026-05-22T04:47:08.223Z

## Resumen de Colecciones (Físicas vs Esperadas)

| Colección | Estado Físico | Campos | Índices | Reglas (API) | Clasificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **users** | ✅ Encontrada | 10 | 2 | 5/5 | **A** |
| **roles** | ✅ Encontrada | 4 | 1 | 2/5 | **A** |
| **tenants** | ✅ Encontrada | 5 | 1 | 2/5 | **A** |
| **clientes** | ✅ Encontrada | 7 | 1 | 4/5 | **A** |
| **espacios** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **cotizaciones** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **contratos** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **documentos** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **rule_registry** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **security_audit_log** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **reservations** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **snapshots** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **rbac_user_roles** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **rbac_role_permissions** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **rbac_permissions** | ❌ Faltante | 0 | 0 | 0/5 | **D** |
| **rbac_user_direct_perm** | ❌ Faltante | 0 | 0 | 0/5 | **D** |

## Detalles por Colección

### Colección: `users`
- **ID:** `_pb_users_auth_`
- **API Rules:**
  - List: `id = @request.auth.id`
  - View: `id = @request.auth.id`
  - Create: ``
  - Update: `id = @request.auth.id`
  - Delete: `id = @request.auth.id`

#### Campos
| Nombre | Tipo | Requerido | Sistema |
| :--- | :--- | :--- | :--- |
| `id` | `text` | Sí | Sí |
| `password` | `password` | Sí | Sí |
| `tokenKey` | `text` | Sí | Sí |
| `email` | `email` | Sí | Sí |
| `emailVisibility` | `bool` | No | Sí |
| `verified` | `bool` | No | Sí |
| `name` | `text` | No | No |
| `avatar` | `file` | No | No |
| `created` | `autodate` | No | No |
| `updated` | `autodate` | No | No |

#### Índices
- `CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)`
- `CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''`

---

### Colección: `tenants`
- **ID:** `tenants00000000`
- **API Rules:**
  - List: `@request.auth.id != ''`
  - View: `@request.auth.id != ''`
  - Create: `null`
  - Update: `null`
  - Delete: `null`

#### Campos
| Nombre | Tipo | Requerido | Sistema |
| :--- | :--- | :--- | :--- |
| `id` | `text` | Sí | Sí |
| `name` | `text` | Sí | No |
| `slug` | `text` | Sí | No |
| `branding_json` | `json` | No | No |
| `settings_json` | `json` | No | No |

#### Índices
- `CREATE UNIQUE INDEX idx_tenants_slug ON tenants (slug)`

---

### Colección: `roles`
- **ID:** `roles0000000000`
- **API Rules:**
  - List: `@request.auth.id != ''`
  - View: `@request.auth.id != ''`
  - Create: `null`
  - Update: `null`
  - Delete: `null`

#### Campos
| Nombre | Tipo | Requerido | Sistema |
| :--- | :--- | :--- | :--- |
| `id` | `text` | Sí | Sí |
| `name` | `text` | Sí | No |
| `permissions_json` | `json` | No | No |
| `level` | `number` | Sí | No |

#### Índices
- `CREATE UNIQUE INDEX idx_roles_name ON roles (name)`

---

### Colección: `clientes`
- **ID:** `clientes0000000`
- **API Rules:**
  - List: `@request.auth.id != '' && @request.auth.tenant_id = tenant_id`
  - View: `@request.auth.id != '' && @request.auth.tenant_id = tenant_id`
  - Create: `@request.auth.id != '' && @request.auth.tenant_id = tenant_id`
  - Update: `@request.auth.id != '' && @request.auth.tenant_id = tenant_id`
  - Delete: `null`

#### Campos
| Nombre | Tipo | Requerido | Sistema |
| :--- | :--- | :--- | :--- |
| `id` | `text` | Sí | Sí |
| `tenant_id` | `text` | Sí | No |
| `razon_social` | `text` | Sí | No |
| `rfc` | `text` | No | No |
| `contacto` | `text` | No | No |
| `status_validacion` | `select` | Sí | No |
| `expediente_json` | `json` | No | No |

#### Índices
- `CREATE INDEX idx_clientes_tenant ON clientes (tenant_id)`

---

