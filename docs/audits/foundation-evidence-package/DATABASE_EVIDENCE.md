# DATABASE_EVIDENCE.md

Evidence extracted from PocketBase API (live_schema.json).

### Colección: users
- **Tipo:** auth
- **Reglas (API Rules):**
  - List: id = @request.auth.id
  - View: id = @request.auth.id
  - Create: 
  - Update: id = @request.auth.id
  - Delete: id = @request.auth.id
- **Índices:** CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`), CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `password` (password *REQ) 
  - `tokenKey` (text *REQ) 
  - `email` (email *REQ) 
  - `emailVisibility` (bool) 
  - `verified` (bool) 
  - `name` (text) 
  - `avatar` (file) 
  - `created` (autodate) 
  - `updated` (autodate) 
  - `tenant_id` (relation) -> tenants00000000
  - `role_id` (relation) -> roles0000000000
  - `effective_permissions` (json) 

### Colección: tenants
- **Tipo:** base
- **Reglas (API Rules):**
  - List: @request.auth.id != ''
  - View: @request.auth.id != ''
  - Create: null
  - Update: null
  - Delete: null
- **Índices:** CREATE UNIQUE INDEX idx_tenants_slug ON tenants (slug)
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `name` (text *REQ) 
  - `slug` (text *REQ) 
  - `branding_json` (json) 
  - `settings_json` (json) 

### Colección: roles
- **Tipo:** base
- **Reglas (API Rules):**
  - List: @request.auth.id != ''
  - View: @request.auth.id != ''
  - Create: null
  - Update: null
  - Delete: null
- **Índices:** CREATE UNIQUE INDEX idx_roles_name ON roles (name)
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `name` (text *REQ) 
  - `permissions_json` (json) 
  - `level` (number *REQ) 

### Colección: clientes
- **Tipo:** base
- **Reglas (API Rules):**
  - List: @request.auth.id != '' && @request.auth.tenant_id = tenant_id
  - View: @request.auth.id != '' && @request.auth.tenant_id = tenant_id
  - Create: @request.auth.id != '' && @request.auth.tenant_id = tenant_id
  - Update: @request.auth.id != '' && @request.auth.tenant_id = tenant_id
  - Delete: null
- **Índices:** CREATE INDEX idx_clientes_tenant ON clientes (tenant_id)
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `tenant_id` (text *REQ) 
  - `razon_social` (text *REQ) 
  - `rfc` (text) 
  - `contacto` (text) 
  - `status_validacion` (select *REQ) 
  - `expediente_json` (json) 

### Colección: permissions
- **Tipo:** base
- **Reglas (API Rules):**
  - List: @request.auth.id != ''
  - View: @request.auth.id != ''
  - Create: null
  - Update: null
  - Delete: null
- **Índices:** 
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `name` (text *REQ) 
  - `domain` (text *REQ) 
  - `description` (text) 

### Colección: documents
- **Tipo:** base
- **Reglas (API Rules):**
  - List: @request.auth.id != '' && @request.auth.tenant_id = tenant_id
  - View: @request.auth.id != '' && @request.auth.tenant_id = tenant_id
  - Create: null
  - Update: null
  - Delete: null
- **Índices:** 
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `tenant_id` (relation *REQ) -> tenants00000000
  - `client_id` (relation *REQ) -> clientes0000000
  - `file` (file *REQ) 
  - `provider` (text *REQ) 
  - `hash` (text *REQ) 
  - `legal_hold` (bool) 
  - `status` (text *REQ) 

### Colección: audit_logs
- **Tipo:** base
- **Reglas (API Rules):**
  - List: null
  - View: null
  - Create: null
  - Update: null
  - Delete: null
- **Índices:** 
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `actor` (relation *REQ) -> _pb_users_auth_
  - `action` (text *REQ) 
  - `payload` (json) 
  - `ip_address` (text) 

### Colección: notifications
- **Tipo:** base
- **Reglas (API Rules):**
  - List: @request.auth.id != '' && @request.auth.id = user_id
  - View: @request.auth.id != '' && @request.auth.id = user_id
  - Create: null
  - Update: @request.auth.id != '' && @request.auth.id = user_id
  - Delete: null
- **Índices:** 
- **Campos & Relaciones:**
  - `id` (text *REQ) 
  - `user_id` (relation *REQ) -> _pb_users_auth_
  - `type` (text *REQ) 
  - `message` (text *REQ) 
  - `read` (bool) 

