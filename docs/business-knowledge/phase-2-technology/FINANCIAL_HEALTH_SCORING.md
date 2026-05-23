# FINANCIAL HEALTH SCORING (Fase 2.3)

## Estados de Salud Financiera

- **Healthy (Verde)**: Balance = 0 (Totalmente pagado y facturado) o Balance Positivo pero dentro del calendario de pagos sin demoras.
- **Warning (Amarillo)**: `overdue_days` > 0 o pagos que suman el total pero faltan facturas por emitir (mismatch contable-fiscal).
- **Critical (Rojo)**: `underpaid` crónico, pagos rechazados o reembolsos pendientes que dejan la deuda viva tras la ejecución del evento.

El TAC calculará este color dinámicamente mediante el Hook de Backend al vuelo.