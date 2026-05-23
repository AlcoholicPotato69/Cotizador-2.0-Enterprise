# SUPERVISORY CONTROL MATRIX (Fase 2.7)

## 1. Matriz de Control Operativo
Define quién vigila qué en la operación diaria:

| Área | Proceso Crítico | Métrica de Alerta (Warning) | Métrica Crítica (Rojo) |
|------|-----------------|-----------------------------|------------------------|
| Comercial | Caducidad de Cotizaciones | > 5 Días sin acción | > 15 Días sin acción (Se auto-cancela) |
| Operaciones | Bloqueos Temporales | > 48 Hrs sin anticipo | Empalme de evento (Imposible por motor) |
| Jurídico | Firma de Contratos | > 72 Hrs emitido sin firma | Evento próximo a 48H sin contrato firmado |
| Finanzas | Validación SPEI | Evidencia > 24H sin validar | Contrato underpaid a 24H del evento |

Esta matriz será la base lógica para las Alertas por Correo/Notificación en el sistema.