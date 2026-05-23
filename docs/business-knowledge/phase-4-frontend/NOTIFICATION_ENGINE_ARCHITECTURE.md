# NOTIFICATION ENGINE ARCHITECTURE

## Arquitectura Event-Driven
El Backend emite Eventos de Dominio:
- `quote.approved`
- `contract.payment_pending`
- `invoice.rejected`

Estos eventos son empujados por el *PocketBase Realtime SSE (Server-Sent Events)* hacia el *Notification Engine* del Frontend, quien los atrapa y los inyecta en el *NotificationStore*. Se prohíbe crear notificaciones directamente desde clics de botones en la UI.