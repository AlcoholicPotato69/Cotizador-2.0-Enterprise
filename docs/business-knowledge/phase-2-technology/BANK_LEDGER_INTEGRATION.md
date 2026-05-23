# BANK LEDGER INTEGRATION (Fase 2.6)

## 1. Disparo Transaccional (Ledger)
Al momento exacto en que Finanzas dictamina `approved` sobre una evidencia de pago, el `pb_hooks` transaccional se dispara:
1. Genera un `receipt` (Recibo) con su propio `receipt_snapshot` inmutable.
2. Inyecta una fila de tipo `payment_received` en la colección `financial_ledger`, abonando el monto verificado a la deuda del Contrato.
3. El *Financial Health Engine* recalcula la salud del contrato (ej. pasando de *Warning* a *Healthy*).