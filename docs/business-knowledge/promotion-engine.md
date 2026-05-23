# Promotion Engine

## 1. Visión General
El **Promotion Engine** es un sub-motor especializado construido sobre el `Universal Rule Engine`. Su propósito es aplicar incentivos comerciales, descuentos y promociones dinámicas a las cotizaciones, eliminando el hardcodeo de la lógica promocional.

## 2. Arquitectura "Configuration-Driven"
En lugar de programar un descuento del "15% por Volumen", el administrador de Casa de Piedra o Plaza Mayor entra al *Tenant Administration Center* y crea un registro de promoción.

### Modelo de Datos (Promoción)
- `nombre`: "Promoción Fin de Año"
- `tipo_descuento`: `percentage` o `fixed_amount`
- `valor`: `20`
- `condicion`: (JSON generado por el Rule Builder)
- `fecha_inicio`, `fecha_fin`: Vigencia de la campaña.
- `tenant`: A qué recinto aplica.
- `priority`: Prioridad de resolución en caso de conflicto.

## 3. Casos de Uso (Mapeados al Rule Engine)

### Descuento por Cantidad
- **Condición**: `context.cotizacion.total_espacios >= 3`
- **Acción**: Aplica `15%` de descuento.

### Promoción por Combinación (Cross-Sell)
- **Condición**: `context.cotizacion.categorias INCLUDES ("Pantalla Digital") AND context.cotizacion.categorias INCLUDES ("Mupi")`
- **Acción**: Aplica `10%` de descuento.

### Promoción Temporal Limitada
- **Condición**: `context.date BETWEEN ("2026-01-01", "2026-01-31")`
- **Acción**: Aplica `20%` de descuento al Gran Total.

## 4. Integración con el Quote Engine
Al momento en que el usuario comercial está operando el "Wizard" de cotizaciones, el sistema envía el estado actual (Carrito/Cotización temporal) al Promotion Engine.
El motor evalúa de forma descendente (por prioridad) todas las reglas de promoción activas.
Si alguna aplica, devuelve un objeto `PromotionApplied` que el Quote Engine muestra desglosado antes del subtotal.

## 5. Simulación Comercial
Antes de activar una regla en producción, el Tenant Administration Center permite ejecutar un "Simulador". El administrador carga una Cotización de prueba y el motor muestra si la regla se activó y cuánto dinero descontó, mitigando el riesgo de errores lógicos.
