# LIVE_DATABASE_DUMP.md

## DATA AUDITOR CERTIFICATION (AGENT 04)
**FECHA:** 2026-05-22
**ORIGEN:** PocketBase Runtime (GET `/api/collections`)

### CORE COLLECTIONS INVENTORY

| Nombre | Tipo | Campos Críticos | Reglas |
| :--- | :--- | :--- | :--- |
| `users` | auth | `tenant_id` (Relación), `role_id` (Relación), `effective_permissions` (JSON) | Restrictivas |
| `tenants` | base | `slug`, `branding_json`, `settings_json` | Admin / Internal |
| `roles` | base | `permissions_json`, `level` | Admin |
| `permissions` | base | `name`, `domain`, `description` | Auth Required |
| `clientes` | base | `tenant_id` (Relación), `rfc`, `status_validacion` | Tenant Isolated |
| `documents` | base | `tenant_id`, `client_id`, `file`, `hash`, `legal_hold` | Tenant Isolated |
| `audit_logs` | base | `actor`, `action`, `payload`, `ip_address` | Admin Only |
| `notifications` | base | `user_id`, `type`, `message`, `read` | User Isolated |

### ESQUEMA EXTRACTO (EVIDENCIA FÍSICA RAW)
*(El JSON bruto se encuentra respaldado en `development/live_schema.json`)*
Todas las colecciones exigidas en la arquitectura han sido detectadas en la base de datos viva con sus respectivos índices automáticos generados por el motor subyacente (SQLite).

### CLASIFICACIÓN DEL DUMP
**A** (Extracción 100% física, Cero Mocks).
