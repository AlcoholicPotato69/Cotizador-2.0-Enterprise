# SCALABILITY REVIEW

## Capacidad Base de SQLite & PocketBase
PocketBase utilizando SQLite en modo WAL (Write-Ahead Logging) es capaz de manejar cientos de miles de lecturas por segundo.

## Análisis de Volumen Proyectado
- **100,000 Contratos:** El motor lo soporta en RAM y caché sin degradación, asumiendo índices correctos.
- **1,000,000 Auditorías (`audit_logs`):** Este es el punto de presión principal (Chokepoint). 

## Cuellos de Botella Detectados y Soluciones
1. **Paginación Lenta en Tablas Masivas:** Las colecciones como `audit_logs` y `notification_queue` pueden sufrir ralentización en consultas tipo `COUNT()` o paginación profunda. 
   - *Solución Arquitectónica:* Índices compuestos en `[tenant_id, created_at]`. 
2. **Carga Útil Pesada (Payload Bloat):** Los Snapshots JSON en `contract_versions` pueden inflar la BD.
   - *Solución:* Mantener el esquema de JSON puro (JSONB nativo de SQLite) para que siga siendo indexable, pero planificar archivado en frío (Cold Storage) pasados los 5 años fiscales.
