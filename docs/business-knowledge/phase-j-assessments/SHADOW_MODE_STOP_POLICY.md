# SHADOW MODE STOP POLICY (J.1)

## 1. Interruptores Automáticos (Kill Switches)
Se detendrá INMEDIATAMENTE la ejecución dual y la migración si se detecta:
- **Divergencia Crítica**: Cualquier diferencia (incluso de un centavo) en el Pricing Engine o Financial Validation.
- **Corrupción de Snapshots**: Diferencias estructurales entre el JSON del frontend y el del backend.
- **Ruptura de Tenant Isolation**: Filtrado cruzado de datos.
- **Inconsistencia Contractual**: Diferentes variables renderizadas en el template.

## 2. Tolerancia Cero
No existe margen de error para motores financieros. Un error de redondeo (ej. 0.01 vs 0.010001) abortará la Fase J.1.