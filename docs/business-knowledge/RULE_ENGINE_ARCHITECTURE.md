# RULE ENGINE ARCHITECTURE

## 1. Visión Fundamental
El **Universal Rule Engine** no es un motor más del sistema; es el *Núcleo Matemático y Lógico* absoluto de Cotizador 2.0.
Cualquier decisión operativa, desde validar si un cliente puede cotizar, hasta determinar el precio de un salón en temporada alta, pasa forzosamente por la colección central `rule_registry`.

**Prohibición Arquitectónica**: Queda estrictamente prohibido usar condicionales como `if (tenant == 'plaza_mayor')` o `if (espacio.tipo == 'salon')` en el código fuente.

## 2. Clasificación de Reglas (Rule Types)
Las reglas se unifican en una sola colección estructurada, diferenciándose por su dominio de aplicación:

- `eligibility`: Dictan si un cliente avanza o se bloquea (Consumido por Client Eligibility Engine).
- `pricing`: Modifican precios base mediante recargos o tarifas por temporada (Consumido por Pricing Rules Engine).
- `promotion`: Generan descuentos al final del subtotal (Consumido por Promotion Engine).
- `contract`: Determinan si una cláusula dinámica debe incluirse en un contrato.
- `notification`: Disparan alertas asíncronas.
- `document`: Definen la obligatoriedad de un documento en el expediente.

## 3. Estructura de la Base de Datos (`rule_registry`)
Cada regla es un registro versionable con los siguientes atributos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | PK. |
| `tenant` | Relation | Dueño de la regla. Aísla a Plaza Mayor de Casa de Piedra. |
| `rule_type` | Select | `eligibility`, `pricing`, `promotion`, etc. |
| `name` | String | "Recargo Premontaje 25% Salones". |
| `version` | Number | Versión de la regla (Inicia en 1). **Versionado Obligatorio**. |
| `priority` | Number | 1-100. Resuelve conflictos. Mayor número se evalúa primero. |
| `status` | Select | `active`, `inactive`, `archived`. |
| `conditions`| JSON | Estructura lógica "IF" (Operadores: AND, OR, EQUALS, INCLUDES). |
| `actions` | JSON | Estructura "THEN" (Ej. `{"type": "surcharge", "value": 25, "unit": "percentage"}`). |
| `effective_from`| Datetime | Inicio de vigencia de la regla. |
| `effective_until`| Datetime| Fin de vigencia. |

## 4. Estrategia de Versionado Obligatorio
**NUNCA** se sobrescribe una regla activa si ya fue utilizada en una cotización.
Si Casa de Piedra quiere cambiar el descuento de "Verano" del 10% al 15%:
1. Se clona el registro original.
2. El registro original cambia su `status` a `archived` y `effective_until` a `now()`.
3. El nuevo registro nace con `version = version + 1`, `status = active` y sus nuevos valores.

Esto aplica igualmente para **Plantillas** (Contratos, Cotizaciones) y **Documentos Obligatorios**.

## 5. Estrategia de Snapshots (Inmutabilidad Absoluta)
Ningún documento transaccional histórico lee datos vivos. 

- **Quote Snapshot**: Al crearse o aprobarse, guarda en duro (`desglose_precios`) el ID de la regla aplicada, la versión exacta y el monto deducido/sumado. Copia el nombre del cliente y el nombre del espacio.
- **Contract Snapshot**: Al generarse, incrusta las cláusulas exactas vigentes en ese milisegundo y congela el HTML resultante en el campo `contenido_html`. Si la plantilla V1 cambia a V2 mañana, el contrato histórico sigue mostrando la V1.

## 6. Resolución de Conflictos
Si dos reglas de `pricing` aplican al mismo contexto (Ej. "Descuento por Cliente Frecuente" y "Descuento por Volumen"):
1. El motor lee el campo `priority`. Gana el de mayor prioridad.
2. Si la regla ganadora tiene un flag `"stop_processing": true` en su JSON de acciones, las reglas de menor prioridad se ignoran.
3. Si el flag es falso, las acciones matemáticas se apilan (Ej. se aplica el 10% y luego un 5% extra).

## 7. Tenant Administration Center como Primer Consumidor
El TAC es el UI exclusivo que interactúa con el `rule_registry` y el `templates_registry`.
Los administradores funcionales no tocan JSON; usan un *Rule Builder* visual (Drop-downs de "Campo", "Operador", "Valor") que el Frontend traduce al JSON estandarizado para guardar en PocketBase.
