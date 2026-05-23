# CFDI PERMISSION MATRIX

## Granularidad RBAC Fiscal

La matriz de seguridad se extiende con las siguientes llaves:
- `invoice.view`: Permite ver la lista de facturas (Asignado a Comercial, Operaciones, Finanzas).
- `invoice.upload`: Permite subir XML y PDF (Asignado a Comercial y Finanzas).
- `invoice.approve`: Permite emitir el Vo.Bo. final (Asignado **exclusivamente** a Finanzas y Gerencia).
- `invoice.reject`: Permite rechazar y bloquear un CFDI mal emitido (Asignado a Finanzas).
- `invoice.delete`: **Restringido Globalmente**. Un CFDI validado no se borra, se cancela lógicamente con una evidencia de sustitución SAT.