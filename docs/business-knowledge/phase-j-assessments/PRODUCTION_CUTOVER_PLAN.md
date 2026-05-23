# PRODUCTION CUTOVER PLAN (J.8)

## 1. Transición desde Cotizador 1.0
- **Día Cero**: Freeze de base de datos de Cotizador 1.0 (Sólo lectura).
- **Migración de Datos**: Importación de Catálogos (Salones, Usuarios, Roles) hacia PocketBase SQLite.
- **Validación Post-Despliegue**: Equipo Jurídico verifica consistencia de 5 contratos históricos en la nueva plataforma.

## 2. Estrategia de Rollback
Si se detecta un error crítico en las primeras 48h, se apagará el DNS de Cotizador 2.0 y se restaurará el acceso de escritura al Cotizador 1.0. Las cotizaciones huérfanas en V2 se migrarán manualmente a V1.