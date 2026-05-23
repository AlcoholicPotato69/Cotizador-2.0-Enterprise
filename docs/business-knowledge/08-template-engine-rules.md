# 08 - Template Engine Rules

## 1. Visión del Motor de Plantillas
Las plantillas en Cotizador 2.0 ya no deben depender de editores drag-and-drop frágiles, sino de un motor determinista.

## 2. Inyección de Contexto
El motor recibirá un "Snapshot" JSON inmutable (Cotización, Cliente, Firmantes, Membrete) y lo inyectará en la plantilla.
- Variables Clave: `{{CLIENTE_RAZON_SOCIAL}}`, `{{FOLIO_COTIZACION}}`, `{{FECHAS_EVENTO}}`, `{{DESGLOSE_FINANCIERO}}`.

## 3. Composición de Layout
Todo documento constará de:
1. **Background Layer**: Membrete oficial de la entidad (Plaza Mayor vs Casa de Piedra).
2. **Body Layer**: El texto legal y las tablas financieras.
3. **Annex Layer**: Renderizado dinámico de evidencias fotográficas, planos y comprobantes de pago adjuntos al final del contrato.
