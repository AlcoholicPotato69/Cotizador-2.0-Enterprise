# OPTION A VS OPTION B ANALYSIS

## OPTION A (Frontend -> PocketBase)
**Ventajas:**
- Desarrollo rápido inicial (Time-to-Market).
- Menor infraestructura (Un solo binario).
- Realtime nativo directo a los componentes de Vue.

**Desventajas:**
- Lógica de negocio secuestrada en las "API Rules" (SQL strings complejos) y Hooks de Goja.
- Imposible usar librerías complejas de NPM.
- Acoplamiento extremo: El frontend sabe exactamente cómo está estructurada la BD.

**Riesgos:**
- El código se vuelve "Legacy" en 6 meses debido a la complejidad de las reglas en Goja.

## OPTION B (Frontend -> API Layer / BFF -> PocketBase)
**Ventajas:**
- Desacoplamiento total: Si SQLite/PocketBase no da abasto en 3 años, se puede cambiar a PostgreSQL sin tocar el frontend.
- Ecosistema rico: La API (ej. NestJS o Node.js) tiene acceso a miles de paquetes para firmar XML, invocar Webhooks de DocuSign, generar PDFs, etc.
- Testing: Permite TDD y pruebas unitarias puras en la API Layer.

**Desventajas:**
- Más infraestructura (Hay que desplegar el frontend, la API, y PocketBase).
- Hay que escribir las definiciones de API (REST/GraphQL).

**Riesgos:**
- Mayor latencia de red (Frontend <-> API <-> PocketBase), mitigable si API y PB están en la misma red privada (o misma máquina local).

## Conclusión
La **Opción B** es la única arquitectura viable para un producto de grado Enterprise.
