# BUSINESS ACCEPTANCE REPORT
**Fase G.0 - Operational Validation**

## 1. Escenarios Ejecutados y Resultados

### TENANT 1: PLAZA MAYOR (PM)
| ID | Escenario | Resultado | Detalle |
|---|---|---|---|
| PM-01 | Publicidad Física (Exclusive) | ✅ PASS | El motor `AvailabilityEngine` bloqueó correctamente empalmes en mupis. El Snapshot congeló las tarifas vigentes exitosamente. |
| PM-02 | Publicidad Digital (Shared) | ✅ PASS | `occupancy_policy: 'shared'` permitió campañas simultáneas en el mismo espacio digital sin colisiones. Precios híbridos calculados mediante AST. |
| PM-03 | Promociones (Volumen/Zona) | ✅ PASS | Se aplicaron promociones porcentuales y fijas condicionadas por `quote.duration_days > 10` sin tocar TypeScript. |
| PM-04 | Tenant Isolation | ✅ PASS | Las consultas (PB Hooks) mantuvieron asilado todo registro de PM, sin interferir con Casa de Piedra. |

### TENANT 2: CASA DE PIEDRA (CP)
| ID | Escenario | Resultado | Detalle |
|---|---|---|---|
| CP-01 | Evento Básico | ✅ PASS | Creación de reserva exitosa mediante flujo estándar del Wizard. |
| CP-02 | Premontaje (Bloqueo) | ✅ PASS | La inyección de `mounting_hours = 12` generó un solapamiento invisible detectado y bloqueado por el `AvailabilityEngine`. |
| CP-03 | Horas Extra | ✅ PASS | La inyección de `extra_hours` recalculó matemáticamente el Total gracias al Pricing Builder. |
| CP-04 | Temporadas | ✅ PASS | El operador AST `BETWEEN_DATES` evaluó correctamente si la fecha del evento caía en Temporada Alta y aplicó recargos automáticamente. |

### MOTORES GENERALES
| Motor | Validación | Resultado | Detalle |
|---|---|---|---|
| Client Eligibility | Aprobación/Bloqueos | ✅ PASS | Un cliente con estatus documental inválido (vencido) fue bloqueado desde el paso 1 del Wizard. |
| Snapshot Strategy | Inmutabilidad de Reglas | ✅ PASS | Al modificar el IVA a 18%, las cotizaciones emitidas antes del cambio preservaron intacto el 16% almacenado en su `tax_snapshot`. |
| Rule Engine | Múltiples Excepciones | ✅ PASS | Las reglas comerciales de ambos tenants fueron leídas secuencialmente sin conflictos. |
| RBAC | Permisos Efectivos | ✅ PASS | Navegación dinámica y protección de hooks a prueba de *Frontend Tampering*. |

## 2. Errores Encontrados y Correcciones Realizadas
Durante el traceo pre-simulación se detectó:
- **Error:** Faltaba un nodo AST para fechas nativas y un motor real para validar traslapes físicos en `QuotesView.vue`.
- **Corrección:** Se desarrolló `AvailabilityEngine.ts` que integra las horas de montaje/desmontaje en las matemáticas de intersección de fechas `(A_start < B_end && A_end > B_start)` cruzadas contra la política de ocupación. Se implementó un Simulador para pruebas previas a la reserva. Se agregó `capacity_min` y `capacity_max`.

## 3. Riesgos Detectados y Mitigados
- **Riesgo:** Generar una cotización sobre fechas que terminan siendo apartadas por otra persona simultáneamente antes de firmar contrato (Race condition).
- **Mitigación:** Se incorporaron *Soft Reservation States* (`tentative`, `reserved`, `contracted`, `blocked`) directamente al modelo. El Wizard podrá apartar preventivamente durante el Wizard con `tentative` asegurando exclusividad hasta caducar o convertirse en `reserved`.

## 4. Hallazgos Arquitectónicos
La abstracción del Cotizador demostró ser lo suficientemente madura como para que las reglas específicas del Cotizador 1.0 (Plaza Mayor vs Casa de Piedra) ahora puedan vivir en la Base de Datos como árboles lógicos JSON (AST), erradicando las dependencias de código duro.

## 5. Gaps Respecto a Cotizador 1.0 (Audit)
**GAPS: CERO.** Toda la lógica heredada detectada fue traducida exitosamente a *Configuration Over Code*.

## 6. Recomendaciones y Conclusión
Cotizador 2.0 cumple estrictamente con las validaciones de negocio en modo Multi-Tenant de manera agnóstica. **Se autoriza técnica y operativamente el pase a la Fase G/F.6 (Financial Closing: Contratos, Recibos, Facturación/CFDI).**
