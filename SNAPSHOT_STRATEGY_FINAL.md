# SNAPSHOT STRATEGY FINAL

**Status:** FROZEN_V7.2
**Date:** 2026-05-23

## Protocolo de Inmutabilidad
El Motor de Snapshots aísla los módulos y garantiza inmutabilidad histórica absoluta.

### 1. Snapshot Entities
- **Client Snapshot:** Congelamiento comercial y fiscal del Lead en el momento de transicionar a Cliente.
- **Quote Snapshot:** Congelamiento de precios, moneda (`currency_code`) e ítems (`Prisma Decimal`).
- **Contract Snapshot:** Congelamiento de cotización, cliente y **Template Context**.

### 2. Contract Template Immutability (V7.2)
Los contratos ya no almacenan HTML hardcodeado. 
El `ContractSnapshot` generado al entrar a firma deberá incluir obligatoriamente:
- `template_version`: Referencia inmutable a la versión de texto legal utilizada.
- `template_hash`: Hash criptográfico del cuerpo legal en el instante de la generación para prevenir alteraciones en la tabla central `ContractTemplate`.

### 3. Estructura y Consumo
- Toda tabla leerá los IDs de estos snapshots y no usará llaves foráneas vivas hacia los dominios adyacentes.
