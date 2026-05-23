# OBSERVABILITY IMPLEMENTATION REPORT (Fase 2.4)

## Arquitectura Tenant-Aware Dashboards

El módulo de Observabilidad se ha reescrito para consultar `pb_data` filtrando rígidamente por `tenant_id` y `business_model`.

### 1. Plaza Mayor (Tenant Dashboard)
Se restringe exclusivamente a:
- Cotizaciones y Contratos Publicitarios generados.
- Tasa de conversión de Activaciones de Marca.
- Disponibilidad futura y ocupación actual de espacios Físicos/Digitales.
- Ingresos segmentados (Física vs Digital vs Activaciones).
- Vencimientos de contratos y facturación pendiente.
*(Cero rastro de eventos sociales).* 

### 2. Casa de Piedra (Tenant Dashboard)
Dashboard operativo híbrido:
- Anticipos pendientes.
- Calendario de Premontajes / Desmontajes.
- Conflictos de disponibilidad en Salones.
- Publicidad física y digital activa.

### 3. Global TAC (System Dashboard)
Vista consolidada exclusiva para el SuperAdmin Multi-Tenant:
- Comparativa de Ingresos y Contratos generados (PM vs CP).
- Métricas de Seguridad: Intentos de Logins fallidos, Tenant Escape Attempts (Auditoría Zero Trust).
- Salud Financiera y Documental (Errores de generación de PDF, fallos en WORM storage).
- Estado de Backups a S3.

## Dictamen de Telemetría
La observabilidad ahora refleja la realidad comercial asimétrica del negocio. El componente sube a **Nivel A**.