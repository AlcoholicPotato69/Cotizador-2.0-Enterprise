# INVOICE DUAL APPROVAL POLICY (Four-Eyes Principle)

## 1. Regla de Aprobación Dual
Para mitigar riesgos de colusión interna o errores en montos elevados, se implementa el principio de "Cuatro Ojos" condicionado:
- Si el `Total` del CFDI es **<= $100,000 MXN**: Requiere 1 aprobación (Usuario A con permiso `invoice.approve`).
- Si el `Total` del CFDI es **> $100,000 MXN**: Requiere 2 aprobaciones secuenciales. (Usuario A pre-aprueba, Usuario B aprueba finalmente). 

El Hook de PB interceptará cualquier intento de que el Usuario A aplique la segunda firma, exigiendo un `user_id` diferente.