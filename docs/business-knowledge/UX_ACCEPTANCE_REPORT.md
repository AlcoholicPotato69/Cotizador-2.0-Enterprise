# UX & IAM ACCEPTANCE REPORT
**Fase H - Enterprise UX/UI & Hybrid RBAC**

## 1. Hybrid RBAC & Direct User Permissions
El motor IAM fue reescrito para utilizar precedencia matemática estricta (`DENY > ALLOW > ROLE`). Toda la plataforma ahora utiliza el directivo `v-permission` para inyectar o remover componentes basados en los `effective_permissions`. Los nombres de roles han sido erradicados de la lógica del frontend.

### Validación del Test Suite (4 Casos)
Se ejecutó el trazado matemático a través del `PermissionDebugger.vue`:

| Escenario IAM | Comportamiento del Motor | Resultado Matemático |
|---|---|---|
| **Caso 1:** Usuario de Operaciones recibe acceso a un módulo Comercial | `is_deny = false` (ALLOW directo) se sobrepone a la carencia del rol. | ✅ Se agregó `quotes.create` al Set efectivo. El usuario ve el botón. |
| **Caso 2:** Gerente pierde acceso a borrar contratos (Castigo) | `is_deny = true` (DENY directo) intercepta y borra `contracts.delete`. | ✅ `contracts.delete` es removido del Set, a pesar de que su rol Gerente lo otorgaba. |
| **Caso 3:** Usuario multi-rol (Ventas + Marketing) | El motor sumó los arrays de permisos de ambos roles. | ✅ Fusión sin colisiones. |
| **Caso 4:** Usuario cambia de tenant | Los roles y permisos directos están indexados con la relación `tenant_id`. | ✅ Al cambiar de CP a PM, los `effective_permissions` cayeron a cero (Zero Trust isolation). |

### Field Level Security (FLS)
Se inyectó FLS para habilitar permisos granulares dentro del **Quote File**. Un usuario puede tener permiso general de lectura del expediente, pero un DENY específico en `fls.quotes.discount.write` le impedirá modificar descuentos en la tabla de cotizaciones, bloqueando los inputs directamente.

- **Expediente-Centric Navigation:** La navegación lateral se condensó a 3 ejes principales: *Client File*, *Quote File*, y *Contract File*. Los módulos aislados desaparecieron a favor de navegación profunda.
- **WCAG AA:** Sustitución de grises pálidos por `slate-500` a `slate-800` en textos y paletas semánticas rojo/verde con suficiente ratio de contraste (4.5:1).
- **Dashboard Dinámico de 2 Capas:** Los widgets (Cuentas por Cobrar, Cotizaciones Activas, Verificaciones) primero evalúan si el **Tenant Administration Center** los tiene activados, y en segundo lugar evalúan si el usuario tiene `v-permission` para verlos. Cero hardcodeos de roles.

## 3. Branding Preservation & Snapshots
Se ejecutó la migración `tenant_brand_assets` soportando versionamiento. Los PDFs no usarán estilos nativos, inyectarán un bloque CSS aislado (Iframe rendering strategy) usando el `logo_url` congelado en el `financial_snapshot`. Un contrato emitido hoy conservará visual y numéricamente sus valores en 5 años.

## 4. Riesgos y Recomendaciones
- **Riesgo Detectado:** La hiper-fragmentación de permisos puede volver caótica la administración si la tabla `rbac_user_direct_permissions` crece demasiado.
- **Recomendación (Mitigación):** Utilizar el motor híbrido (ALLOW/DENY directos) **solo para excepciones temporales** (ej. cubrir las vacaciones de otro puesto). Se instruye a los administradores a depender primariamente de la asignación de Roles para mantener un diseño organizacional limpio.

## 5. Conclusión
La Fase H se considera cerrada y operativa. El sistema tiene identidad corporativa agnóstica pero blindada mediante Snapshots y un IAM capaz de aislar módulos a nivel *Field Level Security*.
