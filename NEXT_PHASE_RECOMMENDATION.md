# NEXT PHASE RECOMMENDATION

## Pasos Inmediatos (Fase de Estabilización)

No se debe avanzar a Invoicing ni a Payment Tracking. Se debe consolidar lo existente.

1. **Reactivación y Auditoría de RBAC (Prioridad 1 - Blocker)**
   - Revisar por qué `rbac.pb.js` está deshabilitado.
   - Reparar la validación y habilitar las pruebas de Zero Trust.

2. **Certificación de Firmas E2E (Prioridad 2)**
   - Certificar la "Signature Architecture".
   - Simular una caída del proveedor DocuSign y confirmar que el `Failover` redirige correctamente a `ManualProvider`.
   - Garantizar la preservación inmutable del hash en `contract_evidence`.

3. **Implementación de Retention & Expiration Engines (Prioridad 3)**
   - Codificar los workers o cron hooks faltantes en `pb_hooks` que definan qué ocurre cuando un documento expira.
   - Definir políticas de retención.

4. **Sanitización del Frontend (Prioridad 4)**
   - Eliminar `DevToolbar.vue` con *mocks* de SSE en ambientes de producción.
   - Conectar las suscripciones de PocketBase Realtime para notificaciones reales.

### Certificación Final Requerida
Antes de abrir el dominio de facturación, se debe presentar evidencia de ejecución (*runtime audit*) para firmar contratos exitosamente usando *snapshots*, manteniendo *Source Purity*.
