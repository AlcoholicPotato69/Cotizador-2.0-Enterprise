# TENANT CONTEXT ARCHITECTURE (Fase 4.1)

## 1. Resolución Automática
Al loguearse, el sistema determina el `tenant_id` asociado al `user_id`.
- `useTenant()` expone `currentTenant`, `brandingContext`, y `taxProfile`.
- Si un SuperAdmin tiene acceso a ambos, el Navbar superior mostrará un *Tenant Switcher*.
- Todo Fetch de datos enviará `tenant_id` como filtro mandatorio, respaldado por las *API Rules* backend.