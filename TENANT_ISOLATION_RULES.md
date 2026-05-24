# Reglas de Aislamiento Multi-Tenant

## Principio Fundamental
Ningún usuario, proceso o API puede acceder, modificar o eliminar datos que no pertenezcan a su `tenant_id` asociado, a menos que esté explícitamente autorizado bajo el rol de `Super_Admin` en operaciones de cross-tenant (mantenimiento/supervisión).

## Reglas de Implementación

1. **Filtro Obligatorio**: Todas las consultas a la base de datos DEBEN incluir `WHERE tenant_id = ?`. Este parámetro debe ser inyectado por el framework de manera automática (Data Isolation Abstraction) siempre que sea posible.
2. **Contexto de Petición Segura**: El `tenant_id` se debe extraer ÚNICAMENTE del JWT verificado. Está estrictamente prohibido confiar en el `tenant_id` proveniente del payload del cliente o de la query string.
3. **Row-Level Security (RLS)**: En bases de datos que lo soporten (ej. PostgreSQL), se habilitará RLS por tabla.
   *Ejemplo de política:* 
   `CREATE POLICY tenant_isolation_policy ON table_name USING (tenant_id = current_setting('app.current_tenant')::uuid);`
4. **Validación de Creación Segura**: Todo registro creado debe heredar automáticamente el `tenant_id` del usuario autenticado en el backend. Las APIs deben ignorar y limpiar cualquier intento de inyectar este campo manualmente.
5. **Prohibición de Cruce de Datos**: Está estrictamente prohibido realizar JOINs entre diferentes `tenant_id` en consultas de negocio o analíticas regulares del Tenant.
