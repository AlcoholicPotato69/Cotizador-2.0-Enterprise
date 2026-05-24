# FRONTEND ACCESS ARCHITECTURE REVIEW

## Situación Actual
El proyecto Cotizador 2.0 Enterprise creció de ser un "cotizador simple" a un **ERP/CRM integral** con 19 dominios de alta complejidad (Firmas electrónicas, Facturación CFDI, Cadenas Hash, Approval DAGs).
Actualmente se asume la arquitectura clásica de PocketBase: `Frontend Vue -> PocketBase -> SQLite`.

## El Problema Estructural
Mantener la Opción A (Frontend -> PocketBase) obliga a que TODO el "músculo" transaccional del negocio (las reglas de negocio, validaciones complejas, conexiones a Intelisis y DocuSign) viva en **Hooks de Goja (JavaScript puro ejecutado dentro de Go)** dentro de PocketBase.
Goja es excelente para validaciones ligeras, pero **no está diseñado** para ser la capa de orquestación central de un ERP Enterprise:
- No tiene acceso completo al ecosistema NPM (ej. librerías de XML para CFDI, criptografía pesada, AWS SDK).
- Su testabilidad es pobre (No se pueden escribir tests unitarios de Jest/Mocha fácilmente para Goja hooks).
- Expone la base de datos directamente al cliente (requiriendo reglas API inmensamente complejas).

## El Veredicto Arquitectónico
La arquitectura de acceso directo desde el Frontend es insostenible para el Roadmap planteado.
Se requiere un **BFF (Backend for Frontend) o API Layer** (Opción B) que actúe como escudo y orquestador.
