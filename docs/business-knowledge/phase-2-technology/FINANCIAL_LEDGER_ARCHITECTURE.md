# FINANCIAL LEDGER ARCHITECTURE (Fase 2.3)

## 1. Diseño Inmutable *Append-Only*
Para erradicar cálculos distribuidos, se modela la colección `financial_ledger`. Actúa como un libro mayor cronológico de partida doble.

### Tipos de Transacción soportados:
- `contract_issuance` (Cargo/Debit - Crea la deuda base)
- `payment_received` (Abono/Credit - Disminuye la deuda)
- `invoice_issued` (Emisión CFDI - Neutro en balance, pero requerido para conciliación fiscal)
- `credit_note` (Abono/Credit)
- `refund` (Cargo/Debit - Devuelve dinero)
- `adjustment` (Credit/Debit - Correcciones manuales auditadas)

El balance del Contrato siempre será `SUM(Credits) - SUM(Debits)`. Si es 0, está liquidado.