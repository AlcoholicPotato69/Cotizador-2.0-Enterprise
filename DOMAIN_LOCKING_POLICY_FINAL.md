# DOMAIN LOCKING POLICY FINAL

**Status:** FROZEN
**Date:** 2026-05-24

## Protocolo de Sellado
Para garantizar la integridad transaccional y evitar que la historia pueda reescribirse, el ERP implementa un cierre en cascada. 

### Reglas de Bloqueo Automático

1. **Evento: INVOICE_STAMPED (Factura Timbrada)**
   - **Se Bloquea:** `Invoice` viva (Solo puede recibir Payments o Void).
   - **Se Bloquea:** `ContractSnapshot` asociado (Protección total).
   - **Se Bloquea:** `QuoteSnapshot` originador.
   - *Razón:* Lo que se timbra en el fisco (SAT) amarra hacia atrás toda la negociación. Alterar la historia es un delito.

2. **Evento: CONTRACT_SIGNED (Contrato Firmado)**
   - **Se Bloquea:** `ContractSnapshot` original.
   - **Se Bloquea:** `QuoteSnapshot` original.
   - **Se Bloquea:** La `Quote` viva (No puede editarse, solo generar enmiendas).
   - *Razón:* El acuerdo jurídico está consolidado.

3. **Evento: OCCUPANCY_CONTRACTED (Recinto Asegurado)**
   - **Se Bloquea:** Fecha y Horario del `SpaceOccupancy`. Solo puede modificarse mediante el flujo de Cancelación y Reubicación auditada.
