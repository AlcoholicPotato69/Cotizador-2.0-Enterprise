# CODE COMPLEXITY REPORT (J.7)

## Análisis Ciclomático de Motores
1. **Rule Engine**: *Complejidad Crítica*. El parseo recursivo del AST para evaluar precios y promociones es el código más denso del sistema.
2. **Availability Engine**: *Complejidad Alta*. Cálculo de colisiones y `buffer_times`.
3. **Financial Engine**: *Complejidad Media*. Sumas y restas estrictas con tipos inmutables.
4. **RBAC Engine**: *Complejidad Media*. Evaluación de precedencia `DENY > ALLOW > ROLE`.
5. **PocketBase Hooks**: *Complejidad Alta*. Eje central de seguridad *Zero Trust*.