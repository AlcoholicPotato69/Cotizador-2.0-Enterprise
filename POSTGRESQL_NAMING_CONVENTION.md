# PostgreSQL Naming Convention - Mandato V5.4

## 1. Reglas Generales
*   **Case**: Usar `snake_case` para todos los identificadores (tablas, columnas, esquemas, índices, etc.). PostgreSQL convierte los identificadores no entrecomillados a minúsculas, por lo que `snake_case` evita problemas de capitalización.
*   **Idioma**: Inglés (recomendado) o Español, pero debe mantenerse estricta consistencia en todo el proyecto.
*   **Longitud**: Los nombres de los identificadores no deben exceder los 63 caracteres (límite por defecto de PostgreSQL).
*   **Caracteres**: Solo letras minúsculas (a-z), números (0-9) y guiones bajos (_). No empezar con un número.

## 2. Esquemas (Schemas)
*   Agrupar entidades lógicamente relacionadas.
*   **Formato**: Nombres en plural o singular (consistente) descriptivos del dominio.
*   **Ejemplos**: `sales`, `hr`, `inventory`, `auth`.

## 3. Tablas (Tables)
*   **Formato**: Sustantivos en minúscula, en `snake_case`. Pueden ser en plural o singular, pero la convención estándar de Mandato V5.4 exige **plural** para tablas que almacenan múltiples registros (ej. `users`, `products`), y singular para tablas de cruce.
*   **Tablas de Unión (Muchos a Muchos)**: Combinar los nombres de las tablas relacionadas ordenados alfabéticamente. Ej: `product_user`.

## 4. Columnas (Columns)
*   **Formato**: `snake_case`.
*   **Llaves Primarias (PK)**: Siempre usar `id` para la llave primaria subrogada (UUID o BIGSERIAL). Alternativamente, `table_name_id` si se prefiere evitar ambigüedades en JOINs, pero se recomienda `id` para la PK de la tabla actual.
*   **Llaves Foráneas (FK)**: `<tabla_referenciada>_id`. Ej: `user_id`, `company_id`.
*   **Fechas/Tiempos**: Usar sufijos `_at` para timestamps completos con zona horaria (ej. `created_at`, `updated_at`, `deleted_at`) y `_date` para fechas (ej. `birth_date`).
*   **Booleanos**: Usar prefijos como `is_`, `has_`, `can_`. Ej: `is_active`, `has_discount`.

## 5. Restricciones (Constraints)
Deberán ser autogeneradas o seguir el siguiente patrón estándar explícito:
*   **Llaves Primarias (PK)**: `<table_name>_pkey` (ej. `users_pkey`).
*   **Llaves Foráneas (FK)**: `<table_name>_<column_name>_fkey` (ej. `orders_user_id_fkey`).
*   **Únicos (Unique)**: `<table_name>_<column_name>_key` o `uq_<table_name>_<column_name>`.
*   **Check (Check)**: `chk_<table_name>_<column_name>`.

## 6. Índices (Indexes)
*   **Formato**: `idx_<table_name>_<column_name>`.
*   **Índices compuestos**: `idx_<table_name>_<col1>_<col2>`.
*   **Índices parciales o especializados**: Añadir un sufijo descriptivo, ej. `idx_users_email_active`.

## 7. Vistas y Funciones
*   **Vistas**: Prefijo `v_` o `vw_` (ej. `v_active_users`). Vistas materializadas con `mv_`.
*   **Funciones/Procedimientos**: Verbos en `snake_case` (ej. `calculate_total`, `update_inventory`).
