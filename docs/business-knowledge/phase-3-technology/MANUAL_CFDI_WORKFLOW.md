# MANUAL CFDI WORKFLOW (Fase 3.0)

## 1. Naturaleza del Proceso
Se bloquea indefinidamente el timbrado automático. La facturación es externa, pero su registro y validación es **interno y obligatorio** para cerrar un expediente.

## 2. Flujo Lineal Inquebrantable
1. El contrato es cobrado en su totalidad (`financial_status = paid`). Solo entonces se habilita el módulo de facturación.
2. El comercial o financiero genera la factura en el portal externo (SAT/Intelisis/Facturama).
3. Sube el **XML y PDF** al *Tenant Administration Center*.
4. El sistema lee el XML, ejecuta validaciones matemáticas y fiscales, y lo pasa a revisión.
5. Finanzas otorga el *Aprobado Final*.
6. Se genera el `invoice_snapshot`.
7. El Contrato puede pasar a `closed`.