# 06 - Contract Engine Rules

## 1. El Propósito
El motor de contratos toma una Cotización Aprobada y genera un documento con validez legal (`documentos`).

## 2. Bloqueo de Modificación
- Un contrato no se puede generar si la cotización no está `aprobada`.
- Una vez generado un contrato asociado, la cotización original se bloquea (no se puede regresar a `pendiente` fácilmente sin invalidar el contrato).

## 3. Manejo de Evidencias y Anexos
- En procesos de publicidad y convenios B2B, a menudo se adjuntan "Anexos Técnicos" (planos, fotografías de evidencia) al contrato final.
- El sistema debe ser capaz de concatenar estos recursos.
