# LONG TERM MAINTENANCE PLAN (J.8)
## Estrategia 1-10 Años
1. **Dependencias**: Freeze de Vue 3 y PocketBase. Actualizaciones solo parches CVE.
2. **Crecimiento**: Multi-tenant soporta 100+ Tenants gracias al aislamiento a nivel fila en DB.
3. **Archivado**: Purga de `admin_audit_log` cada 5 años. Contratos retenidos a perpetuidad.