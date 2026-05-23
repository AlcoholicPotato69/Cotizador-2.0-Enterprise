# FINANCIAL RECONCILIATION ARCHITECTURE (Fase 2.3)

## El Motor de la Verdad
El *Financial Reconciliation Engine* corre como un *CronJob* asíncrono y como un *Hook* sincrónico en Base de Datos.
- **Síncrono**: Cada vez que se añade una fila al Ledger, recalcula el `financial_status` y el `invoicing_status` del contrato padre.
- **Asíncrono**: Barre de madrugada en busca de fechas de expiración de pagos (`payment_schedules`) y cambia el estado de salud a `Warning` o `Critical` si un pago no entró a tiempo.