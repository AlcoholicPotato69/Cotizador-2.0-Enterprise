# PRODUCTION BLOCKERS

## LISTA DE BLOQUEADORES CRÍTICOS

1. **RBAC Inactivo (Zero Trust Violado)**
   - `rbac.pb.js.disabled` deja el backend expuesto.

2. **Ausencia de Motores de Retención y Expiración**
   - El sistema no notifica ni depura, violando reglas de compliance legal y retención de datos.

3. **Falta de Evidencia Reproducible (No Tests)**
   - No hay forma determinística de probar Multi-Signer, Failover o Evidence Vault sin pruebas automatizadas conectadas al SQLite real.

4. **Presencia de Mocks en Frontend**
   - `DevToolbar.vue` inyectando *fake SSE* rompe la integridad del cliente.

## Dependencias Externas y Credenciales Faltantes
- Falta validar conexión real al API de DocuSign. No existen tests contra sandbox externo.

## Riesgos
Avanzar a facturación (Invoice) en este estado propagaría la deuda técnica ("garbage in, garbage out") al carecer de validación inmutable automatizada.
