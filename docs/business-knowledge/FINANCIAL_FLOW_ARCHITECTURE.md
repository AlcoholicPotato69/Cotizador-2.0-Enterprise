# FINANCIAL FLOW ARCHITECTURE

## 1. Misión
Establecer al **Contract File** como el eje central de cobranza y erradicar el concepto de "Pago Único Obligatorio". El sistema debe modelar la realidad financiera de los recintos: anticipos, liquidaciones, adeudos y penalizaciones.

## 2. Estados Financieros del Contrato (`Contract Financial Status`)
El contrato físico no es el final. El contrato posee un motor de estado financiero independiente a su estado legal:
- **`pending`**: Contrato firmado legalmente, pero con 0% de pago registrado.
- **`partially_paid`**: Existen `recibos` abonados, pero el total acumulado es menor al `precio_final` del Snapshot.
- **`paid`**: Liquidado al 100%. Los recibos cubren el total.
- **`overdue`**: Existen abonos faltantes y la fecha de liquidación definida en el Snapshot ha expirado.
- **`cancelled`**: Contrato anulado (Se exige auditoría de la reversión financiera si había recibos).

## 3. Financial Installments (Plan de Pagos)
El *Universal Rule Engine* determinará las parcialidades.
Ejemplo: Una regla de negocio evalúa el `space_snapshot` de un "Salón". La regla exige: 
- Installment 1 (Anticipo): 20% a la firma.
- Installment 2 (Liquidación): 80% a 15 días antes del evento.

Estos pagos se materializan en la colección `recibos`. El sistema jamás asume que un pago único cubrirá el evento.

## 4. Integración al Ciclo Operativo (Facturación Híbrida)
La **Factura** en el Cotizador 2.0 no flota en el vacío. Toda factura debe nacer anclada a un componente del **Contract File**.

**Caso de Uso 1 (Facturación Global del Evento)**:
El cliente liquida el evento. El administrador abre el *Quote File*, navega al *Contract File*, y dispara "Emitir Factura Total". El `InvoiceProvider` extrae los Snapshots y genera el CFDI por el total.

**Caso de Uso 2 (Facturación por Parcialidades)**:
El cliente paga el anticipo. El administrador sube manualmente el XML de la factura del anticipo. El `CFDI Validation Engine` lo aprueba y lo vincula exclusivamente al *Recibo #1* (Installment 1). 

El *Tenant Administration Center* permitirá al administrador de Plaza Mayor decidir la política general de su recinto: *¿Facturamos por anticipo o facturamos el total al liquidar?*
