# Universal Rule Engine

## 1. Visión General
El **Universal Rule Engine** es el núcleo de evaluación lógica de Cotizador 2.0. En lugar de tener lógicas condicionales rígidas repartidas por el código (ej. "si el espacio es salón y estamos en diciembre, cobrar 20% más"), este motor centraliza la evaluación de configuraciones puras (`JSON`/Estructuras de Base de Datos).

Este motor es consumido transversalmente por:
- **Pricing Rules Engine**
- **Promotion Engine**
- **Client Eligibility Engine**
- **Contract Engine**

## 2. Estructura de una Regla (Rule)
Toda regla en el sistema se compone de tres elementos principales:
1. **Condición (IF)**: ¿Qué se evalúa?
2. **Contexto (Context)**: Entradas proporcionadas al motor (Cliente, Tenant, Espacio, Fecha, Cotización actual).
3. **Acción (THEN)**: ¿Qué resultado o mutación se aplica si se cumple la condición?

### 2.1 Evaluador de Condiciones (Condition Builder)
Las condiciones soportan operadores lógicos estándar:
- `EQUALS`, `NOT_EQUALS`
- `GREATER_THAN`, `LESS_THAN`
- `INCLUDES`, `NOT_INCLUDES`
- `AND`, `OR`, `NOT` (Agrupadores Lógicos)

**Ejemplo de Condición en JSON Base de Datos:**
```json
{
  "operator": "AND",
  "rules": [
    { "field": "context.espacio.categoria", "op": "EQUALS", "value": "Salones" },
    { "field": "context.tenant.slug", "op": "EQUALS", "value": "casa_de_piedra" },
    { "field": "context.cotizacion.duracion_dias", "op": "GREATER_THAN", "value": 2 }
  ]
}
```

## 3. Resolución de Conflictos y Prioridad
Cuando múltiples reglas pueden aplicar a un mismo contexto (ej. un salón tiene Descuento por Temporada y también Descuento Comercial):
1. **Puntaje de Prioridad (`priority`)**: Las reglas tienen un número (1-100). Las reglas con mayor prioridad se evalúan primero.
2. **Bandera `stop_processing`**: Si una regla crítica se activa y tiene este flag, se ignora el resto de las reglas en la cadena (Útil para descuentos máximos o bloqueos definitivos de elegibilidad).

## 4. Consumo por otros Motores

- **Promotion Engine**: Utiliza el Universal Rule Engine evaluando el Contexto del Carrito (Cotización). Si la condición es `true`, la *Acción* inyecta un objeto `Descuento` al arreglo financiero.
- **Client Eligibility**: Envía al Rule Engine el Expediente del Cliente (Documentos). Las reglas verifican `vencimientos` o `estados`. Si `true`, la *Acción* retorna un array de motivos de bloqueo (ej. `["Constancia Fiscal Vencida"]`).

## 5. El "Rule Builder" Visual
El Universal Rule Engine debe contar con un constructor visual en el **Tenant Administration Center**. Este UI traduce los "combobox" y "text inputs" del usuario en la estructura JSON descrita en la Sección 2, aislando por completo al usuario de la sintaxis técnica.
