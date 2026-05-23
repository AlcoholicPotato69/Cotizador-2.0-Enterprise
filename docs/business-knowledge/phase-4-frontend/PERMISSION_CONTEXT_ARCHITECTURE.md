# PERMISSION CONTEXT ARCHITECTURE (Fase 4.1)

## 1. Composición de Seguridad (DENY > ALLOW > ROLE)
Todo componente de la UI debe condicionarse así:
```vue
<PrimaryButton v-if="permissions.can('invoice.approve')">Aprobar</PrimaryButton>
```
**Prohibido**: `v-if="user.role === 'admin'"`.
El `usePermissions()` evaluará las reglas granulares inyectadas al loguearse, respetando siempre el modelo de *Effective Permissions Engine* (Fase F).