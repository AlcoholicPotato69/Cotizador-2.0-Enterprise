# RULE CONFLICT RESOLUTION STRATEGY

## 1. Naturaleza de los Conflictos
El *Universal Rule Engine* evalúa cientos de reglas de negocio dinámicas (promociones, recargos, elegibilidad). Inevitablemente, múltiples reglas aplicarán al mismo contexto.
Ejemplo: Un cliente ("Gobierno") quiere cotizar en "Temporada Baja".
- Regla A: "Clientes de Gobierno tienen 15% de descuento".
- Regla B: "Temporada Baja otorga 10% de descuento".

¿Qué debe hacer el sistema? ¿Aplicar 25%? ¿Aplicar solo 15%? 

## 2. Parámetros Determinísticos
Toda regla en el `rule_registry` tiene tres parámetros que rigen la resolución de conflictos:
1. `priority` (Número del 1 al 100).
2. `actions[].stop_processing` (Booleano).
3. `actions[].is_exclusive` (Booleano - NUEVO).

## 3. Algoritmo de Precedencia y Acumulación
El `RuleEvaluator.ts` procesa las reglas en este estricto orden:

### Paso 1: Ordenamiento
Las reglas se ordenan descendentemente por `priority` (100 primero, 1 último).
En caso de empate en prioridad, la regla con la `version` más alta gana.

### Paso 2: Evaluación
El motor evalúa las reglas. Si una regla hace "Match" con el contexto, sus acciones se agregan a la cola de resultados.

### Paso 3: Exclusión
Si la regla ganadora (Match) contiene una acción con `is_exclusive = true`, el motor aplicará el resultado de esta regla y **descartará silenciosamente** cualquier otra regla del mismo tipo (`pricing`, `promotion`), independientemente de si hacían Match o no.

### Paso 4: Parada en Seco (Stop Processing)
Si una regla tiene `stop_processing = true`, el motor detiene inmediatamente el bucle de evaluación. Esta bandera es común en reglas de `eligibility`. (Ej. Si se detecta "Cliente Vetado" -> `stop_processing`, no tiene caso evaluar si tiene INE vigente).

### Paso 5: Acumulación (Por Defecto)
Si las reglas que hacen Match no tienen exclusión ni detención, sus resultados **se acumulan**.
(En el ejemplo del Gobierno y Temporada Baja, si ambas reglas son estándar, se acumularán sumando un 25% de descuento total).

## 4. Trazabilidad del Desempate
El `Audit Trail` guardará no solo las reglas que aplicaron, sino que anotará si una regla fue excluida por otra.
(Ver `AUDIT_TRAIL_STRATEGY.md`).
