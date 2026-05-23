# Quote File Domain Model

## 1. Visión General
El **Expediente de Cotización** encapsula todo el ciclo de vida, las matemáticas y el rastro de auditoría de una propuesta comercial antes de convertirse en un contrato vinculante.

## 2. Anatomía de la Cotización
Una cotización guarda la siguiente estructura estricta:

- **Metadatos**: Fechas de reserva, Cliente, Tenant, Estado.
- **El Carrito**: Array de espacios o servicios a rentar.
- **El Snapshot Financiero (Inmutable)**: Desglose matemático.
- **Rastro de Promociones**: Qué reglas del `Promotion Engine` se activaron (Ej. `["Promo Navidad -20%", "Volumen -15%"]`).
- **Rastro de Precios**: Qué modificadores inyectó el `Pricing Rules Engine` (Ej. `["Recargo Premontaje CasaPiedra"]`).

## 3. Estados del Expediente (Workflow Configurable)
- `DRAFT`: Cotización en construcción. Matemáticas recalculándose en tiempo real.
- `PENDING_APPROVAL`: Requiere autorización (Por política configurada de descuento excesivo).
- `APPROVED`: El Snapshot se congela. Se aparta la fecha tentativamente.
- `CONTRACTED`: Convertido a Contrato. (Flujo exitoso).
- `REJECTED/CANCELED`: Anulado por caducidad o por el cliente.

## 4. Dependencia de Motores (Pipeline Arquitectónico)
La cotización no tiene inteligencia matemática. Es un orquestador:
1. Pide al **Eligibility Engine**: "¿Este cliente puede cotizar?"
2. Recolecta variables del usuario.
3. Pide al **Pricing Rules Engine**: "Ajusta las tarifas base".
4. Pide al **Promotion Engine**: "Aplica descuentos al subtotal".
5. Extrae la configuración de **Impuestos**.
6. Genera el **Snapshot Inmutable**.

## 5. El Concepto de Inmutabilidad
Una cotización `APPROVED` se "congela" en el tiempo. Si al día siguiente el Tenant Administration Center modifica un precio base o borra una promoción, la cotización histórica permanece intacta. El motor de Contratos usará exclusivamente este snapshot.
