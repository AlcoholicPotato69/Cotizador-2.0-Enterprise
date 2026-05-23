# FASE F.2.0: CONFIGURATION AUDIT GATE

## 1. Configuration Over Code Audit
A continuación, se responde explícitamente a las 5 preguntas de gobernanza para cada uno de los Builders de la Fase F.2:

1. ¿Requiere programación? 
2. ¿Existen fórmulas hardcodeadas?
3. ¿Existen reglas de tenant en código?
4. ¿Dependencia del desarrollador original?
5. ¿Configuración fuera del TAC?

### Promotions Builder & Pricing Builder
- **1, 2, 3, 4, 5**: **NO**. Ambos heredarán el núcleo del `RuleBuilder.vue` (Universal Rule Engine) ya construido en F.1. Los cálculos (ej. `discount_percentage`) se resuelven a través de la interpretación del `AST` (Árbol de Lógica) almacenado en la base de datos.
- *Hallazgo*: Para asegurar que no haya dependencia técnica, el motor de matemáticas del backend (`RuleEvaluator.ts`) debe soportar una operación de "Buy X Get Y" (Ej. Promoción de Días de Montaje gratis). Se añadirá soporte a `action_type: 'time_discount'` en F.2.

### Tax Builder
- **1, 2, 3, 4, 5**: **NO**.
- *Hallazgo*: Los impuestos no siempre son globales. Ejemplo: "Tasa 0% IVA para extranjeros". El Tax Builder deberá usar un micro-motor de reglas para determinar condicionalmente la aplicación de un impuesto según el país de origen (ubicado en el `ClientSnapshot`).

### Branding Builder & Template Builder
- **1, 2, 3, 4, 5**: **NO**.
- *Hallazgo*: Para evitar hardcodear variables como `[NOMBRE_CLIENTE]`, el Template Builder usará un motor estándar como Handlebars o Mustache. Las plantillas vivirán en la base de datos (`templates_registry`) y el TAC expondrá una lista de variables inyectables dinámicas.

---

## 2. Business Logic Preservation Audit (PM vs CP)
Se ha contrastado el modelo actual contra las operativas reales de Plaza Mayor (PM) y Casa de Piedra (CP).

### Escenarios Modelados y Protegidos:
- **Tiempos de Montaje/Desmontaje (PM)**: Cubierto en F.1 con *Operational Blocks*.
- **Sobreventa de Publicidad Digital (PM)**: Cubierto en F.1 con *Occupancy Policies (Shared/Segmented)*.

### Hallazgos de Lógica Faltante:
   - *Mitigación en F.2*: El Rule Engine debe poder evaluar `context.quote.has_external_vendor == true` para disparar un recargo automático.
2. **Condicionantes de Pago en Cuotas (PM & CP)**: Los contratos obligan a calendarios de pago variables (Ej. 20% anticipo, 80% antes del evento). 
   - *Mitigación en F.2*: Se debe modelar un `PaymentScheduleBuilder` o integrarlo al `Rule Engine` para que el esquema de parcialidades sea dinámico por Tenant.

---

## 3. Builder Stress Testing Plan
Antes de considerar los Builders F.2 como terminados, se ejecutarán las siguientes pruebas de estrés:

### Promotions & Pricing Builder
- **Test de Colisión de Promociones**: Inyectar 3 promociones válidas simultáneas. Verificar que el sistema respeta la bandera `is_exclusive` (descartando las demás) y aplica la de mayor `priority`.
- **Test de Recargos Compuestos**: Aplicar un recargo fijo ($5,000) y un porcentaje (10%). Validar el orden de operaciones matemáticas y redondeo fiscal.

### Tax Builder
- **Test de Exención (Tax-Exempt)**: Crear una cotización con un cliente "Extranjero" y validar que el impuesto condicional (IVA 16%) es excluido automáticamente por la regla.

### Branding Builder
- **Test de Aislamiento Visual**: Generar cotizaciones simultáneas bajo Tenant PM (Azul/Verde) y Tenant CP (Vino/Oro) asegurando que el PDF generado inyecta estrictamente los estilos de la base de datos sin cruces.

### Template Builder
- **Test de Inyección de Código (Tampering)**: Intentar guardar una plantilla con un tag malicioso `<script>alert('xss')</script>`. Validar que el Backend sanitiza y escapa el input antes de la pre-visualización.
- **Test de Variables Rotas**: Intentar compilar una plantilla con una variable inexistente `{{variable_falsa}}` y validar que el sistema no colapsa, mostrando un *Fallback* seguro.
