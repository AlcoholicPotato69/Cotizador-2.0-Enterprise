# Partitioning Strategy - Mandato V5.4

## 1. Cuándo Particionar (Reglas Base)
*   **Volumen**: No particionar tablas pequeñas. Empezar a particionar cuando se espere que la tabla supere el tamaño de la memoria física disponible o sobrepase los **50-100 GB** de tamaño real, o posea cientos de millones de registros.
*   **Patrones de Acceso**: Particionar si las consultas siempre acotan la búsqueda basándose en una columna clave (ej. consultar datos solo de los últimos meses, o por un `tenant_id` específico).
*   **Rotación de Datos**: Ideal cuando el ciclo de vida de los datos implica borrado de registros antiguos masivamente (Data Expiration). Eliminar una partición (`DROP TABLE`) tiene un coste O(1), a diferencia del `DELETE` que es pesado y genera tuplas muertas.

## 2. Estrategias Nativas de PostgreSQL

### 2.1. Particionamiento por Rango (RANGE)
*   **Principal Caso de Uso**: Datos de series temporales, logs de auditoría, eventos, transacciones financieras históricas.
*   **Clave**: Generalmente una columna de tipo fecha (ej. `created_at`).
*   **Diseño**: Particionar por meses o años dependiendo del volumen esperado por periodo.

### 2.2. Particionamiento por Lista (LIST)
*   **Principal Caso de Uso**: Arquitecturas Multitenant o categorización explícita.
*   **Clave**: `tenant_id`, `country_code`, o `status`.
*   **Diseño**: Aislar datos de clientes masivos en sus propias particiones para facilitar operaciones, respaldos específicos y control de concurrencia.

### 2.3. Particionamiento por Hash (HASH)
*   **Principal Caso de Uso**: Distribuir el I/O en hardware de manera equitativa cuando no hay un rango claro de tiempo o lista para agrupar.
*   **Consideración**: Se usa en casos de alto tráfico de inserción que causa cuellos de botella por contención del B-Tree de los índices, aunque es menos frecuente que RANGE y LIST en aplicaciones de negocio típicas.

## 3. Mantenimiento y Automatización
*   **Creación Manual VS Automática**: PostgreSQL no crea particiones automáticamente al insertar registros. Las particiones deben existir previamente (pre-creación).
*   **Herramienta Oficial**: Se recomienda usar la extensión **`pg_partman`** para administrar particiones de tiempo (RANGE) y su retención de forma automatizada mediante procesos en background.
*   **Default Partition**: Es una buena práctica crear una tabla partición DEFAULT para atrapar registros que no calzan, para evitar errores de inserción, pero debe monitorearse activamente para reubicar esos datos.

## 4. Restricciones Técnicas
*   Las Llaves Primarias y Únicas **deben incluir la clave de particionamiento**.
*   Restricciones foráneas (FK) referenciando hacia / desde tablas particionadas están soportadas de manera nativa desde PG 12, pero deben diseñarse con cuidado debido al rendimiento al comprobar referencias masivamente.
