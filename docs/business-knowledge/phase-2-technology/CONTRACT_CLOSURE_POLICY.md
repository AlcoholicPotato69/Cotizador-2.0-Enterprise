# CONTRACT CLOSURE POLICY (Fase 2.3)

## Protección de Cierre Contractual (Zero Trust)
El estado operativo `closed` (Evento ejecutado, liquidado y archivado) **queda completamente bloqueado a nivel Base de Datos** si el Ledger no empata.

### Restricciones (Hook `beforeUpdate` en PB):
No se permite guardar `status = closed` si:
1. `financial_status == underpaid` (Falta dinero).
2. `financial_status == mismatch` (Dinero no cuadra con el snapshot).
3. `invoicing_status == pending` (Falta emitir al menos 1 CFDI para cubrir el 100% del pago).
4. Existe un `reconciliation_error` abierto en auditoría.

**Resultado**: Un contrato jamás podrá archivarse si arrastra basura financiera.