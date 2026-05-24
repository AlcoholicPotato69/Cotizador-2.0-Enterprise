# Indexing Strategy - Mandato V5.4

## 1. Principios Básicos
*   **No sobredimensionar**: Cada índice añade una penalización de rendimiento en operaciones de escritura (INSERT, UPDATE, DELETE). Crear índices solo si la ganancia en lectura supera el coste de escritura.
*   **Analizar consultas reales**: Usar `EXPLAIN ANALYZE` para verificar que el planificador de consultas de PostgreSQL realmente está utilizando los índices.

## 2. Tipos de Índices a Utilizar
*   **B-Tree**: Por defecto en PostgreSQL. Ideal para operadores `=`, `<`, `<=`, `>`, `>=`, y `BETWEEN`. Usar para IDs, fechas, estados, valores numéricos.
*   **Hash**: Usar únicamente para comprobaciones de igualdad simples (`=`) en columnas donde la lectura es extrema pero no se requieren rangos.
*   **GIN (Generalized Inverted Index)**: Obligatorio para tipos de datos compuestos como arreglos (`ARRAY`), JSONB, y para búsquedas de texto completo (Full-Text Search).
*   **GiST (Generalized Search Tree)**: Utilizado para tipos de datos geométricos (PostGIS) o búsquedas de texto completo donde GIN es demasiado lento para actualizar.
*   **BRIN (Block Range Index)**: Especial para tablas extremadamente grandes (particiones/logs) donde los datos están ordenados físicamente (ej. series temporales por `created_at`). Ocupan muy poco espacio.

## 3. Estrategias Avanzadas
*   **Índices Compuestos (Multicolumn)**: Utilizarlos cuando las consultas frecuentemente filtran o agrupan por múltiples columnas juntas (ej. `WHERE user_id = X AND status = Y`). Recordar la regla de cardinalidad: colocar la columna más selectiva primero o, en su defecto, la que se evalúa por igualdad antes que la de rango.
*   **Índices Parciales**: Obligatorios para filtrar filas que no necesitan ser indexadas (ej. `CREATE INDEX idx_active_users ON users (email) WHERE is_active = true`). Esto reduce drásticamente el tamaño del índice y aumenta el rendimiento.
*   **Índices por Expresión**: Útiles para consultas que aplican funciones sobre columnas, como `CREATE INDEX idx_users_lower_email ON users (LOWER(email))`.

## 4. Mantenimiento y Monitoreo
*   Ejecutar periódicamente análisis de índices sin uso utilizando vistas del catálogo (ej. `pg_stat_user_indexes`).
*   Reindexar (`REINDEX INDEX CONCURRENTLY ...`) cuando haya una alta fragmentación o degradación (bloat) en tablas con alta tasa de UPDATE/DELETE.
*   Siempre crear índices en producción utilizando la cláusula `CONCURRENTLY` para no bloquear operaciones de escritura en la tabla (ej. `CREATE INDEX CONCURRENTLY ...`).
