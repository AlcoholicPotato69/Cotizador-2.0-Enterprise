# DEPENDENCY RISK MATRIX

## Regla Validada
**NO DIRECT CROSS-DOMAIN DEPENDENCIES** -> CUMPLIDO.
**NO DOMAIN MAY READ FUTURE DOMAIN DATA** -> CUMPLIDO.

## Dependencias Ocultas o Peligrosas Mitigadas
1. **Facturación vs Clientes Vivos:**
   - **Riesgo:** Si un cliente cambia su Razón Social hoy, facturas antiguas de contratos pasados cambiarían, destruyendo el compliance fiscal.
   - **Solución (Implementada):** Facturación DEPENDE de `contract_versions.snapshot_data`. Acoplamiento Peligroso ELIMINADO.
2. **Espacios vs Contratos:**
   - **Riesgo:** Liberar un espacio implica cancelar el contrato, o cancelar el contrato libera el espacio obligatoriamente, impidiendo entregas tardías.
   - **Solución (Implementada):** La Ocupación es un dominio puente independiente de la entidad legal.
3. **Firmas vs Flujos:**
   - **Riesgo:** Ciclos infinitos de rechazos de firma saturando la colección de contratos.
   - **Solución (Implementada):** Firmas son manejadas por el `Approval Engine`, aislando la lógica de rechazo de la lógica del contrato.

**Conclusión de la Matriz:** Cero dependencias circulares detectadas. La cascada unidireccional de 19 pasos es estable.
