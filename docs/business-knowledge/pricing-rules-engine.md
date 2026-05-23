# Pricing Rules Engine

## 1. Visión General
El **Pricing Rules Engine** es un sub-motor construido sobre el `Universal Rule Engine`. Su propósito principal es determinar el "Precio Dinámico" de un espacio o servicio en tiempo de cotización. A diferencia del Promotion Engine que aplica descuentos sobre un total, el Pricing Rules Engine altera el *Precio Base* de los elementos del catálogo o inyecta recargos/modificadores obligatorios (como "Premontajes").

## 2. Configuración sobre Código
Todas las reglas que impactan las matemáticas del precio residen en la base de datos y son configurables desde el *Tenant Administration Center*.
Se eliminan lógicas como `if (config_b2b.aplica_premontaje) { precio += 25% }`.

## 3. Comportamiento y Casos de Uso

### A) Precio Especial por Categoría / Zona
- **Condición**: `context.espacio.categoria == "Digitales"`
- **Acción**: Aplica "Precio de Lista Promocional" (Sobrescribe el precio base de todos los espacios que cumplan el criterio).

### B) Recargos Operativos (Salones)
**Premontaje (Ejemplo Casa de Piedra):**
- **Condición**: `context.cotizacion.requiere_premontaje == true` AND `context.espacio.tipo == "Salon"`
- **Acción**: Inyecta un recargo del `25%` sobre la tarifa base del día.

**Horas Extra:**
- **Condición**: `context.cotizacion.horas_extra > 0`
- **Acción**: Multiplica el valor configurado de `tarifa_hora_extra` por la cantidad.

### C) Variabilidad por Temporada (Surge Pricing)
- **Condición**: `context.cotizacion.fecha_evento BETWEEN ("2026-11-15", "2026-12-31")`
- **Acción**: Aplica modificador de "Temporada Alta" (`+15%` al precio base).

## 4. Prioridad y Conflictos
Al igual que las promociones, las reglas de precio se evalúan por prioridad. 
Una regla de "Sobrescribir Precio por Bloqueo Comercial" con Prioridad 100 y `stop_processing=true` anulará cualquier cálculo base o por temporada que tenga prioridad menor.

## 5. Integración
El flujo del Quote Engine realiza los siguientes pasos para obtener el precio matemático:
1. Lee la tarifa base del catálogo.
2. Llama al **Pricing Rules Engine** -> Modifica la tarifa base según temporadas y agrega recargos operativos (Premontaje).
3. Obtiene el Subtotal.
4. Llama al **Promotion Engine** -> Aplica descuentos.
5. Llama a las **Configuraciones de Impuestos** (Ej. `+16% IVA`).
6. Obtiene el Gran Total Inmutable (Snapshot).
