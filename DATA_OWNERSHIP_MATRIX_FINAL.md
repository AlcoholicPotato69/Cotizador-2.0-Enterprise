# DATA OWNERSHIP MATRIX FINAL

**Status:** FROZEN
**Date:** 2026-05-24

## Principio de Propiedad Exclusiva
Solo el **Owner Domain** puede crear, actualizar o eliminar (soft-delete) los datos vivos bajo su jurisdicción. Todo dominio secundario debe consumir un Snapshot Inmutable. Queda estrictamente prohibido que un dominio invoque métodos de mutación sobre otro (Ej. `invoiceService.updateClientData()` está prohibido).

## Mapa de Jurisdicción

| Dominio (Dato) | Owner Domain | Consumidores Externos (Read-Only Snapshots) |
| --- | --- | --- |
| Perfil Fiscal | `Client Domain` | Quote, Contract, Invoice (vía ClientSnapshot) |
| Recintos (Spaces) | `Spaces Domain` | Occupancy, Quote (vía SpaceSnapshot) |
| Condiciones de Cotización | `Quote Domain` | Contract (vía QuoteSnapshot) |
| Textos Legales | `Contract Domain` | Signature, Invoice (vía ContractSnapshot) |
| Saldo Financiero | `Financial Domain` | Analytics, Portal Cliente |
| Eventos Auditables | `Audit Domain` | N/A (Solo escritura en frío) |
