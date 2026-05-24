# APPROVAL ADVANCED WORKFLOW CERTIFICATION

**Date:** 2026-05-23
**Result:** PASSED ✅

## Pruebas Físicas Ejecutadas
- **Sequential Approval:** DAG configurado. El Paso 2 no se activa hasta que el Paso 1 se aprueba (Order = 1 vs Order = 2).
- **Parallel & Quorum:** Configurado Paso 3 con 3 Directores en paralelo y Quorum de 2. Aprobado exitosamente al recibir la segunda firma.
- **Rejected:** Un solo rechazo colapsó todo el Request a `REJECTED`.
- **Cancelled:** Invocador canceló el request con estado PENDING.
- **Expired (SLA):** Al sobrepasar la fecha límite simulada, el motor actualizó automáticamente a `EXPIRED`.
- **Delegation & Escalation:** Un Approver delegó su firma a otro UUID exitosamente. El motor detectó falta de respuesta y escaló la petición según la regla configurada.
