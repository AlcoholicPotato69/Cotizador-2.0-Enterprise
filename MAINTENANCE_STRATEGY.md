# MAINTENANCE STRATEGY

## Componentes de Alta Dificultad (Alto Riesgo de Rotura)
1. **Approval Engine & DAGs:** La resolución de grafos paralelos en Goja (PocketBase Hooks) es propensa a fallos si no hay pruebas exhaustivas. Requerirá monitoreo constante.
2. **Hash Chaining en Auditoría:** Si la BD experimenta una caída durante una inserción, el hash anterior podría desincronizarse, corrompiendo la cadena.

## Estrategia de Monitoreo Obligatoria
- **Notification Queue:** Requiere métricas para detectar reintentos fallidos de envío de correo (dead-letter queues).
- **Integridad de Hash:** Un *Cron Job* interno deberá correr cada 24 horas validando la firma criptográfica entera del `audit_logs` para emitir una alerta inmediata al Director en caso de alteración externa de SQLite.
