# CFDI FLS ARCHITECTURE

## Field Level Security (Nivel Fiscal)

La colección `invoices` aplica restricciones a nivel de campo (FLS):
- **UUID, XML Raw, SubTotal, IVA, Total**: Solo-Lectura (*Read-Only*) para todos tras su inserción. El Motor de Validación es el único autorizado a poblar estos campos durante el Parseo. Ningún humano puede editar el monto.
- **PDF URL**: Accesible solo para usuarios con `invoice.view`.
- **Status**: Editable únicamente por usuarios con `invoice.approve` o `invoice.reject`. Comerciales solo tienen acceso de lectura a este campo.