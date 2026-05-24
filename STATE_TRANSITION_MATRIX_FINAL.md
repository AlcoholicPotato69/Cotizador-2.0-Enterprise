# STATE TRANSITION MATRIX FINAL

**Status:** FROZEN
**Date:** 2026-05-24

## Regla de Transición
Toda transición de estado es unidireccional y controlada por un Finite State Machine (FSM) estricto. Queda prohibido forzar estados anteriores (Ej. `APPROVED -> DRAFT`).

### 1. Quotes FSM
- `DRAFT` → `SENT`
- `SENT` → `APPROVED`
- `SENT` → `REJECTED`
- `SENT` → `EXPIRED`
- `APPROVED` → `CONTRACT_GENERATED`
- *No hay regresión permitida de APPROVED a DRAFT.*

### 2. Contracts FSM
- `DRAFT` → `PENDING_SIGNATURE`
- `PENDING_SIGNATURE` → `SIGNED`
- `SIGNED` → `ACTIVE`
- `ACTIVE` → `EXPIRED`
- `ACTIVE` → `TERMINATED`
- `SIGNED` → `TERMINATED` (Si se rescinde antes de inicio)

### 3. Invoices FSM
- `DRAFT` → `GENERATING`
- `GENERATING` → `STAMPING`
- `STAMPING` → `STAMPED`
- `STAMPED` → `SENT`
- `SENT` → `PARTIALLY_PAID`
- `SENT` → `PAID`
- `PARTIALLY_PAID` → `PAID`
- `STAMPED` / `SENT` / `OVERDUE` → `VOIDED` (Cancelación SAT)
- `SENT` / `PARTIALLY_PAID` → `OVERDUE` (Expiración de plazo)

### 4. Space Occupancy FSM
- `HOLD` → `RESERVED`
- `RESERVED` → `CONTRACTED`
- `CONTRACTED` → `COMPLETED`
- `HOLD` / `RESERVED` → `CANCELLED`
- `HOLD` → `EXPIRED`
