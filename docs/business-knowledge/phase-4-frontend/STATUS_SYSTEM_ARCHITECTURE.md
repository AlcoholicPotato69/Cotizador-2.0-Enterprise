# STATUS SYSTEM ARCHITECTURE (Fase 4.2)

## 1. Estandarización Semántica de Estados
El componente `DsStatusBadge` mapeará automáticamente valores de backend a colores estandarizados del Design System:

### Contratos & Cotizaciones
- `draft` (Borrador): `surface-500` (Gris).
- `pending` (Pendiente Firma/Validación): `amber-500` (Naranja).
- `approved` / `signed`: `green-600` (Verde).
- `rejected` / `cancelled`: `red-600` (Rojo).

### Financiero (Pagos y Facturas)
- `unpaid`: `red-600` (Rojo).
- `partial`: `amber-500` (Naranja).
- `paid`: `green-600` (Verde).
- `validated` (CFDI): `blue-500` (Azul).

Esta arquitectura prohíbe que un módulo defina un "verde" diferente al que usa el resto del sistema, garantizando coherencia visual global.