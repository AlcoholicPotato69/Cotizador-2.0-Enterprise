# Architecture Gap Analysis (Cotizador 2.0 Enterprise)

## 1. Arquitectura Actual (As-Is)
Hasta la Fase 6, hemos construido un MVP funcional pero parcialmente rígido:
- **RBAC**: Es 100% Permission-First (cumple con el requerimiento).
- **Clientes**: Poseen un booleano `perfil_validado` manejado manualmente.
- **Espacios**: Poseen tipos hardcodeados en frontend (Salón, Cartelera) y un JSON simple `config_b2b` para reglas.
- **Cotizaciones**: Calculan el 16% de IVA en código y leen el precio base directamente.
- **Contratos**: Utilizan una plantilla HTML hardcodeada en `ContractEngine.ts`.
- **Tenants**: Solo aíslan datos. No tienen configuraciones de branding, impuestos o plantillas.

## 2. Arquitectura Objetivo (To-Be: Configuration-Driven Platform)
El nuevo mandato exige un sistema donde **nada** comercial ni operativo esté en código.
1. **Tenant Administration Center**: Panel central de control (Branding, Impuestos, Plantillas, Reglas).
2. **Client Eligibility Engine**: Motor central que devuelve `{ eligible, canQuote, canContract, reasons }` evaluando vigencias y reglas del tenant.
3. **Promotion & Pricing Rules Engine**: Constructor visual de reglas lógicas ("SI X ENTONCES Y").
4. **Configuration Over Code**: Impuestos, variables de contrato, reglas de premontaje y categorías de espacios viven como registros en BD.

## 3. Gaps Detectados (Brechas Críticas)

| Componente | Estado Actual | Brecha hacia el Objetivo | Riesgo Técnico |
|------------|---------------|--------------------------|----------------|
| **Eligibility** | `perfil_validado: boolean` (Hardcode) | Falta el Motor Central. Falta evaluación de vencimiento de documentos y adeudos por Tenant. | ALTO. Permite cotizar a clientes con documentos vencidos. |
| **Pricing Rules** | `config_b2b` y Frontend Math (Hardcode) | Falta Rule Engine. El IVA está hardcodeado (16%). Faltan descuentos dinámicos. | ALTO. Impide lanzar promociones o subir IVA sin tocar código. |
| **Promotions** | Inexistente | Falta motor visual de reglas lógicas. | MEDIO. |
| **Templates** | `ContractEngine.ts` (Hardcode HTML) | Las plantillas deben vivir en PocketBase y ser editables/versionables por tenant. | ALTO. Un cambio de cláusula requiere redespliegue. |
| **Categorías** | Array en UI (`Salón`, `Pantalla`) | Las categorías/subcategorías deben ser dinámicas en la BD. | MEDIO. |

## 4. Componentes Válidos (Se conservan)
- **Infraestructura Base de PocketBase**: Sigue siendo válida.
- **Tenant Isolation (RLS)**: El filtrado de datos `@request.auth.allowed_tenants` es correcto y se conserva.
- **Permission-First RBAC**: El diseño de la Fase 5 (Multirol, Permisos Efectivos, `pb_hooks/rbac.pb.js`) es **completamente válido** y cumple con los requisitos del Tenant Administration Center para no hardcodear roles.
- **UI Shell**: El Sidebar/Header de PrimeVue y Pinia Stores son útiles como chasis.

## 5. Componentes a Rediseñar (Reescritura Obligatoria)
1. **Base de Datos**: Se deben crear colecciones para: `tax_rules`, `pricing_rules`, `promotions`, `document_requirements`, `templates`, `tenant_config`, `categories`.
2. **`QuotesView.vue`**: Se debe borrar la matemática interna y delegarla al Pricing Engine / PB Hooks.
3. **`ContractEngine.ts`**: Se debe borrar la plantilla interna. El Engine solo mapeará variables contra un `html_content` descargado de la BD.
4. **`ClientsView.vue`**: Se debe integrar con el Client Eligibility Engine en lugar de un switch manual.

## 6. Propuesta de Re-Alineación y Cronograma
Debemos ejecutar un "Architectural Reset" de los dominios comerciales:
- **Paso 1**: Modelar el Configuration Schema (Tenants, Plantillas, Impuestos, Categorías).
- **Paso 2**: Implementar el *Client Eligibility Engine* (Evaluador de reglas documentales).
- **Paso 3**: Implementar el *Pricing & Promotion Engine* (Estructuras JSON para el Rule Builder).
- **Paso 4**: Refactorizar Cotizaciones y Contratos para consumir los motores anteriores.
- **Paso 5**: Construir el UI del *Tenant Administration Center*.

**Impacto**: Requiere desechar la lógica matemática de la Fase 4 y 6, y la validación manual de la Fase 2, retrasando la entrega visual pero garantizando un sistema 100% mantenible por operaciones.
