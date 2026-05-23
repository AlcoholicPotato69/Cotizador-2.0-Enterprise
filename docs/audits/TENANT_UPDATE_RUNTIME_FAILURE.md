# TENANT_UPDATE_RUNTIME_FAILURE.md

## ERROR
HTTP 400 - "Something went wrong while processing your request."
Al editar un Tenant en el Dashboard o vía API Admin. 

## ARCHIVO
`backend/pb_hooks/main.pb.js`

## LÍNEA
Se encontraba fallando implícitamente en la línea interna del compilador JS (reportado como `pb.js:2:3`). La línea fuente que detonaba el error estaba en las declaraciones de interceptores:
`rbac.enforceRbac(e, "update", $app);`

## CAUSA RAÍZ
El motor JavaScript de PocketBase (Goja) no garantiza la retención del contexto léxico global en hooks ejecutados de manera diferida si las variables son declaradas como `var rbac = require(...)` a nivel superior. Al ejecutarse la interceptación `onRecordUpdateRequest`, el recolector de contexto perdía la referencia, detonando: 
`ReferenceError: rbac is not defined`
Esto generaba que el Hook crasheara antes de devolver respuesta, y el motor de PocketBase lo envolvía genéricamente en un Error HTTP 400 vacío sin detalles de validación.

## CORRECCIÓN
Se movió la carga de dependencias (`require`) explícitamente hacia adentro de la función callback de cada hook afectado (Create, Update, Delete, View).

**Código anterior:**
```javascript
var rbac = require(`${__hooks}/utils/permissions.js`);
onRecordUpdateRequest((e) => {
  rbac.enforceRbac(e, "update", $app);
  return e.next();
});
```

**Código corregido:**
```javascript
onRecordUpdateRequest((e) => {
  const rbac = require(`${__hooks}/utils/permissions.js`);
  rbac.enforceRbac(e, "update", $app);
  return e.next();
});
```

## PRUEBA POSTERIOR
Se escribió el script `reproduce_tenant_bug.js` (basado en el SDK de JS) realizando autenticación `admin@acme.com` y enviando una petición PATCH `update(tenant.id, { slug: tenant.slug })`.

## RESULTADO
El servidor respondió `HTTP 200 OK`. `Update SUCCESS`. 
La persistencia de la edición y la re-carga de la colección `tenants` fueron confirmadas sin errores.
