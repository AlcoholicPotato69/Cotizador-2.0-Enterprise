# DATABASE FOUNDATION REVIEW
**Author:** Database Architect

## PostgreSQL Validations
- **Naming Convention:** snake_case en DB, camelCase en Prisma Client.
- **Indexes:** Definidos correctamente (idx_tenant, idx_deleted_at).
- **Constraints:** Foreign Keys explícitas y Unique Constraints.
- **FK Strategy:** Cascade solo donde lógicamente sea entidad hija estricta (Ej. Permisos de un Rol).
- **Soft Delete Strategy:** `deleted_at` TIMESTAMPTZ y `deleted_by` UUID requeridos.
- **Tenant Isolation:** `tenant_id` obligatorio en toda tabla de datos.
- **Partitioning Strategy:** Definida para `AuditLogs` y `EventSubscriptions` (particionado por fecha).
- **Backup Strategy:** Volcados lógicos diarios y PITR configurado.
- **Retention Strategy:** Legal holds en documentos definidos.

**PRISMA_READY = YES**
