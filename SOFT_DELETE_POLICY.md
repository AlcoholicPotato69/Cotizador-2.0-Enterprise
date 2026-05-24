# Política de Soft Delete (Borrado Lógico)

## Declaración Principal
Está terminantemente prohibido utilizar sentencias de borrado físico (`DELETE`) en las bases de datos transaccionales para entidades del negocio principal (usuarios, cotizaciones, catálogos, configuraciones). Todos los registros deben ser dados de baja lógica para garantizar la coherencia de los datos y auditorías.

## Columnas Requeridas en el Esquema
Las tablas sujetas a Soft Delete deben incluir obligatoriamente dos columnas:
1. `deleted_at`: Tipo `TIMESTAMP WITH TIME ZONE` (o equivalente), con valor por defecto `NULL`.
2. `deleted_by`: Tipo `UUID` opcional pero recomendado, que apunta al usuario que originó la baja.

## Manejo de Índices y Unicidad (Unique Constraints)
Los índices únicos tradicionales pueden causar colisiones si se vuelve a crear un registro que había sido borrado lógicamente. Todos los índices únicos deben filtrar registros borrados.
- **En SQL**: Usar Partial Indexes. 
  *Ejemplo:* `CREATE UNIQUE INDEX idx_user_email_active ON users(email) WHERE deleted_at IS NULL;`

## Reglas de Acceso a Datos (Consultas Globales)
1. Los repositorios de datos (ORM o Query Builders) DEBEN aplicar de manera implícita la condición `deleted_at IS NULL` a nivel global en todos los `SELECT`, `UPDATE` y uniones (`JOIN`).
2. Las consultas que necesiten recuperar registros borrados deben usar un flag explícito, ej. `repository.findWithDeleted()`.
3. La visualización en el frontend de registros en estado "borrado" está reservada exclusivamente para roles con permisos de auditoría (`Super_Admin` o `Auditor`).
