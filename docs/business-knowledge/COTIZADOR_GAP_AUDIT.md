# COTIZADOR 1.0 GAP AUDIT

## 1. Objetivo
Ejecutar una auditoría final comparando la lógica operativa histórica (Cotizador 1.0) y los flujos de Plaza Mayor (PM) y Casa de Piedra (CP) contra el nuevo *Universal Rule Engine* y *Master Domain Model* de la versión 2.0.

## 2. Análisis por Motor Operativo (Gap Identification)

### A. Pricing Engine (Precios y Dimensiones Temporales)
**Cotizador 1.0**: Los precios variaban según si era por día, por hora, fines de semana, temporada alta/baja, y cobraba las horas extra y tiempos de montaje diferenciados.
**Cotizador 2.0 (Modelo Actual)**: 
- *Gap detectado*: El modelo actual de `QuoteItem` asume un precio lineal. 
- *Resolución para F.2*: El **Pricing Builder** alimentará al `RuleEvaluator` con un AST capaz de evaluar condicionales sobre: `context.quote.duration_hours`, `context.quote.is_high_season`, `context.quote.mounting_hours`, `context.quote.has_external_vendor`. Todas estas variables de contexto deben integrarse al `Template Variable Registry` y estar expuestas visualmente en el UI del builder.

### B. Tax Engine (Lógica Fiscal)
**Cotizador 1.0**: Múltiples lógicas embebidas en el código PHP/JS (Ej. `if (cliente_extranjero) { iva = 0 } else if (retencion) { ... }`).
**Cotizador 2.0**:
- *Resolución para F.2*: Se PROHÍBE el TypeScript duro. El **Tax Builder** será una extensión del Rule Builder. Un impuesto es simplemente una regla de negocio donde `rule_type = "tax"`, evaluando el `ClientSnapshot` para aplicar el recargo (ej. +16%).

### C. Branding & Template Engine
**Cotizador 1.0**: PDFs hardcodeados, cada cambio de logo requería un deploy.
**Cotizador 2.0**:
- *Resolución para F.2*: 
   1. **Branding Preview Engine**: El UI dividirá la pantalla. A la izquierda los controles (Color, Logo), a la derecha un iframe pre-visualizando un recibo o contrato *dummy* con los estilos aplicados en tiempo real.
   2. **Template Variable Registry**: La base de datos mantendrá un diccionario de variables permitidas (ej. `{{quote.total_amount}}`, `{{client.rfc}}`). El UI del Template Builder desplegará un menú lateral de donde el administrador podrá arrastrar estas variables al HTML.

## 3. Escenarios No Modelados (Nuevos Hallazgos)
1. **Temporadas Dinámicas (High/Low Season)**: El motor requiere una forma de definir qué es temporada alta. 
   - *Solución*: En el Tenant Administration Center, se añadirá una configuración menor de "Temporadas" donde se listen rangos de fechas (Ej. 1 Dic - 31 Dic = Alta). Esto se inyecta en el `context.quote`.

## 4. Conclusión
Todos los requisitos y gaps operativos detectados del Cotizador 1.0 ahora están arquitectónicamente contemplados a través del **Universal Rule Engine**, el **Template Variable Registry**, y las dimensiones inyectadas en el **Contexto de Evaluación**. No existe ningún impedimento estructural para construir la Fase F.2.
