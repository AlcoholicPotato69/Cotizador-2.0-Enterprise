# PARTIAL RECONCILIATION TESTS (Fase 2.3)

## Escenarios de Prueba de Conciliación

1. **Anticipo**: Un contrato de $10,000 recibe un pago de $5,000. 
   - *Resultado*: Estado del Ledger = `partial`. Balance pendiente = $5,000.
2. **Múltiples Facturas**: Un contrato liquidado de $20,000 debe facturarse en 2 CFDI (Factura A por $10k, Factura B por $10k).
   - *Resultado*: `invoice_balance` empatado con el `financial_snapshot`. Estado = `matched`.
3. **Overpaid**: Un cliente deposita $10,500 en lugar de $10,000.
   - *Resultado*: Balance = +$500. Estado = `overpaid`. (Requiere nota de crédito o reembolso manual).