# FLOW_CONFORMANCE.md

## CONFORMANCE AUDITOR (AGENT 11)

### AUTH CONFORMANCE
- **Login:** Autenticación en `App.vue` (`A`)
- **Tenant:** Extracción en Token (`A`)
- **Permisos:** Serialización JWT (`A`)
- **Dashboard:** Guard Router (`A`)

### SESSION CONFORMANCE
- **Login:** Pinia actualiza Session (`A`)
- **F5:** El navegador re-renderiza y detecta `pb.authStore` (`A`)
- **Recuperación:** Se inyectan de nuevo estilos y estado (`A`)
- **Persistencia:** Funciona (`A`)

### CLIENT CONFORMANCE
- **Crear:** Formulario `ClientFormView` a `clientService.ts` (`A`)
- **Guardar:** Inserción en PocketBase (`A`)
- **Consultar:** Listado real (`A`)
- **Editar:** Endpoint Update (`A`)

### DOCUMENT CONFORMANCE
- **Subir:** Binary + JSON (`A`)
- **Persistir:** Hooks PB (`A`)
- **Visualizar:** `documents` GET (`A`)
- **Descargar:** PB Static File Server (`A`)

### CONCLUSIÓN
Flujos 100% operativos. Ningún flujo fundacional depende de mocks.
