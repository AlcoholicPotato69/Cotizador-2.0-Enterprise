# Reglas de Negocio (Business Rules)
Operación: Plaza Mayor y Casa de Piedra

## 1. Reglas de Leads y Clientes
- **BR-CLI-01**: Un lead no puede convertirse en Cliente sin al menos un RFC válido (o Tax ID para extranjeros).
- **BR-CLI-02**: Todo cliente debe tener asignado un ejecutivo comercial responsable. Si el ejecutivo cambia, debe quedar registro en la bitácora de auditoría.

## 2. Reglas de Cotización
- **BR-COT-01 (Vigencia)**: Las cotizaciones tienen una vigencia máxima de 15 días naturales. Pasado este tiempo, el sistema debe expirar la cotización automáticamente.
- **BR-COT-02 (Reserva de Fechas)**: Generar una cotización pone un "Hold" en el calendario por un máximo de 7 días. Si no hay anticipo o contrato, el calendario se libera automáticamente.
- **BR-COT-03 (Descuentos)**:
  - Ejecutivos: Máximo 5% de descuento.
  - Gerencia Comercial: Máximo 15% de descuento.
  - Dirección: > 15% de descuento, requiere token o aprobación electrónica del Director.
- **BR-COT-04 (Conflictos de Fecha)**: El sistema no permitirá cotizar el mismo salón para las mismas horas. Para cotizaciones en las mismas fechas pero con diferentes clientes (lista de espera), la primera cotización tendrá prioridad "Hold 1", la segunda "Hold 2".

## 3. Reglas de Contrato y Firma
- **BR-CON-01 (Anticipo)**: Ningún contrato es válido hasta no confirmar la recepción del anticipo definido (usualmente 20% a 50%).
- **BR-CON-02 (Bloqueo Legal)**: Si un cliente tiene deudas de eventos pasados, el sistema impedirá la generación de un nuevo contrato hasta liquidar el adeudo.

## 4. Reglas de Facturación y Pago
- **BR-FAC-01 (CFDI)**: No se puede emitir factura si los datos fiscales del cliente no están validados (Constancia de Situación Fiscal actualizada al año en curso).
- **BR-PAG-01 (Liquidación Total)**: El evento debe estar pagado al 100% al menos 15 días antes del montaje. Si no se cumple, el sistema bloquea los permisos de ingreso para proveedores.
- **BR-PAG-02 (Depósitos en Garantía)**: Se debe cobrar un depósito en garantía por posibles daños al recinto, el cual no causa IVA y se devuelve 30 días posteriores al evento si no hay daños.

## 5. Reglas de Terminación
- **BR-TER-01 (Cierre)**: Un evento no puede cambiar a estatus "Terminado" si tiene saldos pendientes o notas de cargo abiertas.
