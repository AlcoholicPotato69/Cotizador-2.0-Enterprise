# NOTIFICATION CENTER ARCHITECTURE

## UI Multi-Tenant del Centro
Un *Drawer* lateral que visualiza las alertas atrapadas por el Engine.
- Filtro estricto por `tenant_id` y `RBAC`. Un usuario con permisos comerciales nunca verá una notificación de "XML Rechazado".