# Procesos de Negocio (Business Processes)
Operación: Plaza Mayor y Casa de Piedra

Este documento define el flujo secuencial de operaciones para la gestión comercial y operativa de los recintos.

## 1. Flujo de Lead
**Inicio**: El prospecto contacta por algún canal (web, teléfono, presencial) preguntando por disponibilidad de espacios.
**Desarrollo**: 
- Se capturan datos básicos (Nombre, Empresa, Tipo de Evento, Fecha estimada, Aforo).
- Se asigna un ejecutivo comercial.
- Se califica el lead (probabilidad de cierre).
**Fin**: El lead es calificado como viable y pasa a ser Cliente Prospecto, o es descartado.

## 2. Flujo de Cliente
**Inicio**: Un lead calificado muestra interés real en una cotización.
**Desarrollo**:
- Se recaba la documentación fiscal y legal del cliente (Alta de Hacienda, Identificación del Representante Legal, Comprobante de Domicilio).
- Se da de alta en el sistema ERP/CRM.
**Fin**: Cliente creado con un ID único, listo para recibir cotizaciones formales.

## 3. Flujo de Cotización
**Inicio**: El cliente solicita el costo de un espacio para una fecha específica.
**Desarrollo**:
- Se verifica disponibilidad en el calendario (Plaza Mayor o Casa de Piedra).
- Se genera un "Hold" o reserva tentativa.
- Se agregan servicios adicionales (montaje, seguridad, limpieza, energía, A/V).
- Se aplican descuentos permitidos según tabulador.
- Se emite el documento de Cotización con vigencia.
**Fin**: Cotización enviada al cliente esperando su aprobación.

## 4. Flujo de Contrato
**Inicio**: El cliente acepta la cotización.
**Desarrollo**:
- El sistema genera el borrador del contrato basado en las cláusulas estándar y los datos de la cotización.
- Revisión por el área legal si hay modificaciones solicitadas por el cliente.
- Se establece el cronograma de pagos.
**Fin**: Contrato emitido y listo para firma.

## 5. Flujo de Firma
**Inicio**: Contrato aprobado por ambas partes.
**Desarrollo**:
- Envío a firma autógrafa o firma electrónica (ej. DocuSign, e.Firma).
- Se recolectan firmas de los representantes legales.
**Fin**: Contrato firmado y validado. El evento pasa a estatus "Confirmado".

## 6. Flujo de Factura
**Inicio**: Se cumple un hito del cronograma de pagos del contrato.
**Desarrollo**:
- Se genera la pre-factura.
- Se emite el CFDI correspondiente con el uso de CFDI y régimen fiscal correcto del cliente.
**Fin**: Factura enviada al cliente.

## 7. Flujo de Pago
**Inicio**: El cliente realiza un depósito o transferencia.
**Desarrollo**:
- Cuentas por cobrar identifica el ingreso en el estado de cuenta.
- Se concilia el pago contra la factura emitida.
- Se genera el Complemento de Pago (REP).
**Fin**: Saldo de la factura actualizado. Si es el pago final, el evento queda liberado financieramente.

## 8. Flujo de Renovación
**Inicio**: Un evento recurrente (anual/mensual) termina con éxito.
**Desarrollo**:
- El ejecutivo contacta al cliente para apartar la fecha del próximo año.
- Se copian las condiciones del evento anterior, actualizando precios según inflación o nuevas tarifas.
- Se emite una nueva cotización de renovación.
**Fin**: Nueva cotización enviada, reiniciando el ciclo.

## 9. Flujo de Terminación
**Inicio**: El evento ha concluido y el cliente ha desocupado las instalaciones.
**Desarrollo**:
- Se realiza un recorrido de revisión de daños.
- Si hay daños o consumos extra, se emite una factura de cierre.
- Si todo está en orden, se devuelve el depósito en garantía o se cierra la cuenta.
**Fin**: Evento cerrado contable y operativamente.
