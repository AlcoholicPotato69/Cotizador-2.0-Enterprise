# AUDIT TRAIL STRATEGY

## 1. Objetivo General
Cumplir con el mandato de Trazabilidad: **"Toda decisión tomada por el sistema debe poder explicarse."**

Si una auditoría financiera externa pregunta por qué una cotización cobró $20,000 en lugar de $25,000, el sistema no debe responder "porque el subtotal calculado dio eso". Debe ser capaz de exhibir qué reglas provocaron el cambio.

## 2. Las 7 Pistas de Auditoría

### 2.1 Pricing Audit (`pricing_audit`)
Congela en la cotización las reglas de cargo aplicadas.
**Estructura:** `[{ rule_id: "...", rule_name: "Recargo Fin de Semana", rule_version: 2, amount: 2500, type: "surcharge" }]`

### 2.2 Promotion Audit (`promotion_audit`)
Congela los descuentos aplicados.
**Estructura:** `[{ rule_id: "...", rule_name: "Descuento Gubernamental", rule_version: 1, amount: -5000, type: "discount" }]`

### 2.3 Tax Audit (`tax_audit`)
Congela los impuestos activos durante el cobro.
**Estructura:** `[{ tax_name: "IVA", rate: 16, amount: 3200 }]`

### 2.4 Eligibility Audit (`eligibility_audit`)
Explica por qué un cliente fue autorizado para operar.
**Estructura:** `[{ rule_name: "Requisito INE Moral", rule_version: 3, result: "passed" }]`

### 2.5 Contract Audit (`rules_applied_audit`)
Explica qué reglas forzaron la inclusión de qué cláusulas especiales.
**Estructura:** `[{ rule_name: "Cláusula de Ruido", rule_version: 1, clause_id: "cl_112" }]`

### 2.6 Permissions Audit
(A futuro) Todo acceso al Tenant Administration Center quedará registrado para saber "quién archivó la regla de IVA".

### 2.7 Document Audit
(A futuro) Registra la línea de tiempo de revisión de documentos del cliente (ej. "INE Validada por Maria López").

## 3. Reconstrucción Histórica
Las 7 pistas de auditoría son inyectadas en las tablas `cotizaciones` y `contratos` en el momento de creación (`saveQuote`). La base de datos asume el peso de la historia, permitiendo reconstruir exactamente los árboles de decisiones incluso 10 años después.
