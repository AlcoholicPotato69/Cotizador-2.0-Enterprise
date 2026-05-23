# DOCUMENT JOB QUEUE ARCHITECTURE (Fase 2.1)

## 1. Sincronía vs Asincronía
- **Ejecución Síncrona**: Para 1 contrato unitario. Timeout de 15s.
- **Ejecución Asíncrona**: Obligatoria para Lotes (Ej. "Generar facturas de todo el evento").

## 2. Límites de Concurrencia
Para proteger el RAM del servidor (Playwright es pesado), el *Sidecar* utilizará `p-limit` o un balanceador de colas (Redis/BullMQ) restringido a **MÁXIMO 5 Workers concurrentes**. Los excedentes se encolan con patrón FIFO.