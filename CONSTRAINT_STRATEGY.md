# Constraint Strategy - Mandato V5.4

## 1. Filosofía
Las restricciones (constraints) son la última y más sólida línea de defensa para garantizar la integridad de los datos. La lógica de negocio puede fallar o saltarse a nivel de aplicación, pero la base de datos no debe permitir estados inconsistentes.

## 2. Tipos de Constraints y Reglas de Uso

### 2.1. Primary Keys (PK)
*   **Obligatorio**: Toda tabla **debe** tener una llave primaria.
*   **UUID vs BIGSERIAL**: Se estandariza el uso de UUID (v4 o v7) para tablas expuestas externamente, distribuidas o sincronizadas. Usar `BIGSERIAL` (Identity columns) para catálogos internos o tablas de enlace puramente locales.
*   Definir como `GENERATED ALWAYS AS IDENTITY` en lugar de la palabra clave `SERIAL` para enteros, cumpliendo el estándar SQL.

### 2.2. Foreign Keys (FK)
*   **Integridad Referencial**: Todas las relaciones relacionales deben estar protegidas por Foreign Keys.
*   **ON DELETE / ON UPDATE**: 
    *   Definir explícitamente el comportamiento.
    *   Usar `ON DELETE CASCADE` solo en composiciones estrictas (ej. si se borra la Orden, borrar los Detalles de Orden).
    *   Usar `ON DELETE RESTRICT` (por defecto) en catálogos y entidades maestras para evitar borrados accidentales de información histórica.
    *   Considerar `ON DELETE SET NULL` para relaciones opcionales (ej. un usuario fue borrado, pero su comentario queda con autor NULL).

### 2.3. Unique Constraints (UNIQUE)
*   Usar siempre para columnas que identifiquen unívocamente registros alternos a la PK (ej. `email`, `tax_id`, `slug`).
*   Considerar restricciones únicas compuestas (ej. `UNIQUE(user_id, product_id)` en una tabla de favoritos) para prevenir duplicidad.

### 2.4. Check Constraints (CHECK)
*   Usar para validaciones de dominio directo que no cambian (ej. `CHECK (price >= 0)`, `CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE'))`).
*   Aseguran que no entren datos anómalos o imposibles sin requerir triggers complejos.

### 2.5. Not Null Constraints (NOT NULL)
*   **Regla de Oro**: Por defecto, todas las columnas deben ser `NOT NULL` a menos que se justifique que la ausencia de datos es un estado de negocio válido.
*   Evitar almacenar `NULL` cuando el valor es simplemente vacío (ej. cadenas de texto). Preferir cadenas vacías `''` para textos, excepto si `NULL` tiene un significado lógico específico distinto de "vacío".

## 3. Triggers vs Constraints
*   Favorecer siempre el uso de Constraints nativas (`CHECK`, `UNIQUE`, `FK`) frente a Triggers debido al menor costo de rendimiento y complejidad.
*   Reservar Triggers exclusivamente para cálculos complejos transaccionales, auditoría (historial de cambios) o mantenimientos de campos derivados.
