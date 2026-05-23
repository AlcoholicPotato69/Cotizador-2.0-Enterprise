# COLLECTION INVENTORY REPORT

**Generado:** 2026-05-22T05:41:00.000Z

## Inventario Físico de PocketBase (Extracción API)

### 1. `users`
* **Estado:** Activo
* **Campos:** `username`, `email`, `emailVisibility`, `verified`, `tenant_id`, `role_id` (inferidos a través de uso en vistas).
* **Relaciones:** `tenant_id` -> `tenants`, `role_id` -> `roles`.
* **Uso Real:** Login y asignación de inquilino.
* **Clasificación:** **A**

### 2. `tenants`
* **Estado:** Activo
* **Campos:** `name`, `domain`
* **Uso Real:** FLS y filtrado de middleware cruzado.
* **Clasificación:** **A**

### 3. `roles`
* **Estado:** Activo
* **Campos:** `name`
* **Uso Real:** Integrado con el hook `rbac.pb.js` y asignado a usuarios.
* **Clasificación:** **B** (Falta la tabla de `permissions` para que tenga utilidad real).

### 4. `clientes`
* **Estado:** Activo
* **Uso Real:** CRUD operando en Frontend.
* **Clasificación:** **A**

### Colecciones Inexistentes (Ghost Tables)
Las siguientes colecciones descritas en arquitectura NO existen en la base de datos física:
* `permissions` (**D**)
* `quotes` (**D**)
* `contracts` (**D**)
* `documents` (**D**)
* `notifications` (**D**)
* `snapshots` (**D**)
* `audit_logs` (**D**)
* `financial_ledger` (**D**)
