# Migration Policy - Mandato V5.4

## 1. Principio Fundamental
Las bases de datos relacionales evolucionan. Todos los cambios de esquema (DDL) y migraciones de datos base (DML) deben gestionarse bajo un control de versiones estricto, sin excepciones. Queda prohibida la alteración manual del esquema en entornos de Producción.

## 2. Herramientas Aprobadas
*   Se utilizará la herramienta de migración definida en el stack tecnológico base del proyecto (ej. Flyway, Liquibase, Prisma Migrate, TypeORM Migrations, Alembic).
*   La herramienta debe soportar migraciones ordenadas, control de estado en base de datos (tabla de historial de migraciones) y manejo de transacciones.

## 3. Versionado y Nomenclatura
*   Cada archivo de migración debe tener una marca de tiempo estricta o un versionado secuencial explícito (ej. `V202405231200__add_user_status.sql` o `202405231200-add-user-status.ts`).
*   El nombre del archivo debe describir clara y brevemente el propósito del cambio en inglés, separado por guiones o guiones bajos.

## 4. Diseño de Migraciones Seguras (Zero-Downtime)
*   **Compatibilidad Hacia Atrás**: Toda migración debe ser compatible con la versión anterior de la aplicación.
*   Si se renombra o se borra una columna, debe hacerse en múltiples fases (Migración Expand/Contract):
    1.  **Fase 1 (Expand)**: Añadir la nueva columna, mantener la vieja. La aplicación escribe en ambas y lee de la vieja.
    2.  **Fase 2 (Migrate)**: Script en background para migrar datos históricos de la vieja a la nueva.
    3.  **Fase 3 (Transition)**: Desplegar nueva versión de la app que lee/escribe en la nueva columna.
    4.  **Fase 4 (Contract)**: Borrar (DROP) la columna antigua (suele hacerse uno o varios releases después).
*   **Locks (Bloqueos)**: Evitar operaciones DDL que requieran un `ACCESS EXCLUSIVE LOCK` largo en tablas grandes (ej. añadir columna con valor por defecto requiere reescribir la tabla en versiones viejas de PG; en PG 11+ es seguro).
*   Creación de índices concurrentes: En bases de datos en producción, usar **siempre** `CREATE INDEX CONCURRENTLY`. Dado que esto no puede ejecutarse dentro de un bloque de transacción global de migración, la herramienta de migraciones debe configurarse para soportar ejecución no transaccional para estos scripts.

## 5. Rollbacks (Reversiones)
*   A nivel de código de migración, siempre debe escribirse el script de bajada (`down/rollback`), a menos que la herramienta (ej. Prisma) lo auto-genere de manera segura.
*   Cuidado con las operaciones destructivas (ej. `DROP TABLE`). En muchos casos, un rollback real implica restaurar datos. Priorizar los backups antes de cualquier migración de riesgo.

## 6. Revisión y Aprobación
*   Todo script de migración requiere Code Review enfocado en impacto de performance (ej. si requiere escanear tablas masivas, bloqueos de escritura) por parte del Database Architect o un Senior Backend.
