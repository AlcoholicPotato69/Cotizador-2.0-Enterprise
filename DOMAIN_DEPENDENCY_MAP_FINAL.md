# DOMAIN DEPENDENCY MAP FINAL

**Status:** FROZEN
**Date:** 2026-05-23

## Mapa de Consumo e Inmutabilidad (Source Purity)

El principio de `Zero Live Reads` rige las siguientes interacciones:

1. **Space Occupancy → Space**
   - Lectura: FK Directa al identificador de recinto.
   - Restricción: SERIALIZABLE Isolation.
2. **Space Occupancy → Client**
   - **PROHIBIDO:** FK Directa a `Client`.
   - **MANDATORIO:** Lee `ClientSnapshotDTO`.

3. **Quote → Client / Space Occupancy**
   - **PROHIBIDO:** FK Directa.
   - **MANDATORIO:** `Quote` contiene `clientIdSnapshot` y `spaceOccupancyIdSnapshot`.

4. **Contract → Quote**
   - **PROHIBIDO:** FK Directa a la tabla `Quote`.
   - **MANDATORIO:** `Contract` se alimenta del `QuoteSnapshot` generado tras el estado `APPROVED`. Contiene `quoteSnapshotId`.

5. **Signature Request → Contract**
   - Lectura de `ContractSnapshot` y los términos legales generados inmutables.

6. **Invoice → Contract**
   - **PROHIBIDO:** Consulta cruzada a `Client`, `Space` o `Quote`.
   - **MANDATORIO:** `Invoice` lee **exclusivamente** el `ContractSnapshot`. Si el contrato original cambia, la factura ya emitida no se altera.

7. **Payment → Invoice**
   - **MANDATORIO:** Lee `InvoiceSnapshot`.

## Message Bus Dependencies
Todos los dominios inyectan eventos en el `DomainEventBus`.
El **Notification Engine** y **Audit Engine** son suscriptores puros (Listen-Only). No emiten consultas de regreso a los dominios.
