# API LAYER ARCHITECTURE

## Stack Recomendado
Se recomienda adoptar un marco maduro y tipado como **NestJS (Node/TypeScript)** o **Go nativo** para construir la API Layer. 

## El Rol de PocketBase
PocketBase deja de ser el "Backend" y se convierte en:
1. **Persistence Layer (SQLite Wrapper).**
2. **Storage Layer (S3 / Local para documentos).**
3. **Identity Provider (Manejo de tokens JWT, pero la API los valida).**

## Restricciones Arquitectónicas de la Opción B
1. El código frontend (Vue.js) NUNCA debe invocar el SDK de PocketBase (ej. `pb.collection('quotes').create()`).
2. El Frontend solo realizará peticiones HTTP/REST o GraphQL hacia la API Layer.
3. La API Layer validará el token del usuario (RBAC), ejecutará el *Business Logic*, creará los eventos necesarios (Audit Hash, Approval Steps) e interactuará con PocketBase usando privilegios de Administrador (Service Account) dentro de una red privada.
