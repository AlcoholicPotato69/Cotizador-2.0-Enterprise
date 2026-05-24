# LONG TERM MAINTAINABILITY ANALYSIS

La Opción A generaría deuda técnica inmanejable:
1. **Testing:** Escribir pruebas E2E contra PocketBase puro es posible, pero las pruebas unitarias de los hooks de Goja son casi imposibles sin emular todo PocketBase.
2. **Refactorización:** Mover lógica de negocio entre colecciones requeriría migraciones destructivas.

La Opción B (API Layer) resuelve la mantenibilidad a 5 años:
1. **Testing Unitario:** La API Layer (ej. TypeScript/NestJS) permite probar el *Approval Engine* o el *Snapshot Engine* inyectando mocks de la base de datos (PocketBase actuando solo como repositorio).
2. **Onboarding de Desarrolladores:** Es mucho más fácil encontrar ingenieros Node.js/NestJS que especialistas en Goja/PocketBase internals.
