# Retention Policy - Mandato V5.4

## 1. Alcance
Establece las directrices para la retención, archivo y eliminación segura de los datos almacenados en PostgreSQL, garantizando el cumplimiento legal, control del almacenamiento y rendimiento del sistema.

## 2. Estrategia de "Soft Deletes"
*   **Cuándo usar**: Solo para entidades críticas del negocio, catálogos principales y registros financieros o de auditoría donde la trazabilidad histórica sea necesaria.
*   **Implementación**: Añadir una columna `deleted_at (TIMESTAMPTZ)`. Las consultas estándar filtrarán `WHERE deleted_at IS NULL`. (Considerar uso de Vistas para la aplicación).
*   **Precauciones**: El uso de Soft Deletes afecta restricciones Unique y el tamaño de los índices. Ajustar índices parciales (`WHERE deleted_at IS NULL`).
*   **Cuándo NO usar**: En tablas transaccionales masivas, logs de sistema, tablas pivot/cruce. Usar `Hard Delete` allí para evitar sobrecarga (bloat).

## 3. Retención de Logs y Datos Operacionales
*   **Logs y Auditoría (Alta Volatilidad)**: Datos como `user_sessions`, `api_requests_logs`, o telemetría deben tener una retención máxima corta (ej. 30 a 90 días). 
*   **Depuración Automática**: Implementar CRON jobs o pg_cron dentro de PostgreSQL para ejecutar periódicamente comandos `DELETE FROM table WHERE created_at < NOW() - INTERVAL '90 days'`.
*   Para un manejo más eficiente en tablas masivas operacionales, utilizar el particionamiento declarativo y descartar particiones enteras (DROP TABLE) en lugar de sentencias DELETE masivas.

## 4. Archivado (Data Archiving)
*   **Cold Data**: Datos históricos (ej. cotizaciones del año anterior cerradas) que no son consultados frecuentemente pero deben preservarse por motivos regulatorios (ej. 5-7 años).
*   **Estrategia**: Mover datos antiguos de las tablas principales (Online Transaction Processing) a esquemas históricos (`history`, `archive`) o a bases de datos de análisis (OLAP/Data Warehouse).
*   Esto mantiene el working set de PostgreSQL pequeño en memoria (buffers) garantizando el rendimiento de las consultas transaccionales diarias.

## 5. Limpieza y Purga (Vacuum)
*   Las políticas de borrado masivo (Hard Deletes) o actualizaciones pesadas dejarán tuplas muertas. Es vital configurar correctamente los parámetros del daemon **autovacuum** para asegurar que el espacio sea reclamado y evitar la degradación de tablas.
