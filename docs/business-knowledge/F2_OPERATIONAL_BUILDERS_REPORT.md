# F2 OPERATIONAL BUILDERS REPORT

## 1. Resumen Ejecutivo
Se ha culminado la Fase F.2 garantizando que **todo comportamiento comercial, fiscal, documental y visual es modificable desde el Tenant Administration Center**. Se ha erradicado por completo la dependencia de desarrolladores para modificar reglas de negocio recurrentes (Cero Hardcode).

## 2. Módulos Implementados

### 2.1 Governance Granular (Permissions)
Se reestructuró la gobernanza de F.1 reemplazando el genérico `config.manage`. Ahora los módulos exigen:
- `promotions.manage`, `pricing.manage`, `taxes.manage`, `templates.manage`, `branding.manage`.
Esto permite que Marketing asigne colores, mientras Finanzas gestiona impuestos, sin que colisionen sus privilegios de seguridad.

### 2.2 Promotions Builder & Simulator
Se implementó `PromotionsBuilder.vue` heredando del Universal Rule Engine.
**Simulador Integrado**: Permite al usuario comercial definir variables mockeadas (Temporada, Cliente) y visualizar el comportamiento matemático del AST antes de activarlo a nivel Tenant.

### 2.3 Pricing Builder (AST Extendido)
Se expandió la matriz operativa. El UI de `PricingBuilder.vue` ahora provee a los usuarios del Tenant un listado explícito de dimensiones a utilizar en sus reglas AST:
- `quote.duration_hours`, `quote.is_high_season`, `quote.mounting_hours`, `quote.has_external_vendor`

### 2.4 Tax Builder (Rule-Driven)
Se construyó `TaxBuilder.vue`. El cálculo fiscal es ahora una regla más. Exenciones como Tasa 0% para extranjeros se implementan como condición de evaluación sobre el `client_snapshot`.

### 2.5 Template Builder & Variable Registry
Se habilitó la edición HTML de contratos y cotizaciones, acompañada de un menú visual (**Template Variable Registry**) con llaves como `{{client.rfc}}` y `{{quote.total_amount}}`.

### 2.6 Branding Builder & Preview Engine
Se construyó `BrandingBuilder.vue`. Las modificaciones a logotipos y tipografías se refrescan en tiempo real sobre un *Branding Preview Engine* incrustado mediante iframes/componentes pre-renderizados antes de ser guardadas.

## 3. Snapshot Strategy (Inmutabilidad Financiera)
Se modificó `QuotesView.vue` para extraer, agrupar y congelar los datos al momento exacto de generar la cotización:
- `eligibility_snapshot`
- `pricing_snapshot`
- `promotion_snapshot`
- `tax_snapshot`
- `template_snapshot`
**Validación**: Si el IVA cambia de 16% a 18% mañana, las cotizaciones creadas hoy no sufrirán re-cálculos fantasma.

## 4. Riesgos Restantes y Pendientes
- **Riesgo Mitigado**: Todo intento de fraude manual por APIs eludiendo la UI, choca con los *PocketBase Backend Hooks* instalados en la Fase F.1.5.
- **Pendientes para F.6**: Habiendo superado la lógica de cotización, el siguiente paso masivo es el cierre financiero: Recibos, Facturación y el Motor CFDI inmutable.
