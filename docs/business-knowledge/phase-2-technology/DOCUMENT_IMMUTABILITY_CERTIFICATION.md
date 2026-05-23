# DOCUMENT IMMUTABILITY CERTIFICATION (Fase 2.1)

## Pruebas de Estrés Inmutable

- **Caso 1 (Cambio Branding)**: El Tenant "Casa de Piedra" cambió su logo rojo a verde. **Resultado**: El PDF histórico del evento anterior siguió siendo rojo. (Playwright lee el `branding_version` del Snapshot, no el catálogo vivo). PASSED.
- **Caso 2 (Cambio Plantilla)**: Se modificó la cláusula 5 legal. **Resultado**: El contrato de ayer conserva la cláusula antigua. PASSED.
- **Caso 3 (Cambio Reglas/Precios)**: La hora extra subió de $1000 a $1500. **Resultado**: El recibo del contrato histórico refleja $1000 intactos. PASSED.
- **Caso 4 (Cambio Tenant)**: Intento de forzar el `tenant_id` de PM en un contrato de CP. **Resultado**: PB API Rules lo rechazan por *Mismatch*. PASSED.

> **Certificación**: El PDF generado queda matemáticamente congelado en el tiempo.