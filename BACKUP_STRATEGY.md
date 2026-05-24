# Backup Strategy - Mandato V5.4

## 1. Objetivos de Recuperación
*   **RPO (Recovery Point Objective)**: Cantidad de pérdida de datos aceptable. Meta estándar: < 15 minutos, idealmente 0 en desastres lógicos mediante PITR.
*   **RTO (Recovery Time Objective)**: Tiempo máximo para estar operativos nuevamente tras un desastre. Meta estándar: < 2 a 4 horas.

## 2. Tipos de Backups Implementados

### 2.1. Backups Físicos (Continuous Archiving y Base Backups)
*   **Mecanismo**: Uso de herramientas como `pgBackRest` o `WAL-G`.
*   **Base Backup**: Realizar un backup físico completo (Base Backup) cada 24 horas (usualmente en la madrugada para entornos de menor tráfico).
*   **Archivado de WAL (Write-Ahead Logs)**: Envío continuo (cada pocos minutos) de archivos WAL a un almacenamiento de objetos inmutable (AWS S3, Azure Blob, Google GCS).
*   **Propósito**: Habilita **PITR (Point-In-Time Recovery)**. Permite restaurar el clúster exacto al estado de cualquier segundo en los últimos N días, mitigando borrados accidentales (ej. `DROP DATABASE`).

### 2.2. Backups Lógicos
*   **Mecanismo**: `pg_dump` y `pg_dumpall`.
*   **Frecuencia**: Se recomienda un volcado lógico semanal o antes de migraciones mayores de esquema/versión.
*   **Propósito**: Útil para restaurar bases de datos específicas o tablas individuales fácilmente, migrar entre diferentes arquitecturas, versiones de PostgreSQL, o clonar ambientes hacia staging/QA (aplicando ofuscación).

## 3. Almacenamiento y Seguridad
*   **Redundancia Geográfica**: Los backups (WAL y Base Backups) deben replicarse a una región secundaria / Zona de Disponibilidad distinta de la base de datos principal.
*   **Cifrado**: Todo backup debe almacenarse cifrado en reposo (AES-256) y transmitirse cifrado (TLS).
*   **Inmutabilidad**: Proteger el bucket de backups contra borrados accidentales o ataques ransomware (ej. S3 Object Lock) durante el período de retención mínimo.

## 4. Pruebas de Restauración (Disaster Recovery Testing)
*   Un backup no sirve si no se puede restaurar.
*   Se realizará un simulacro de restauración (DR Drill) automatizado o manual al menos 1 vez por trimestre.
*   El proceso consiste en levantar un clúster desde el backup en un entorno aislado, verificar que levante y cruzar sumas de verificación o recuentos (row counts) de tablas clave.
