# ADR-006: INFRASTRUCTURE SIMPLIFICATION & LONG-TERM MAINTAINABILITY

**Fecha:** 2026-05-23
**Estado:** FROZEN / APPROVED

## Contexto y Problema
Tras la decisión de migrar el backend hacia una API Layer robusta en el ADR-005, surgió el riesgo inminente de sobrediseñar la infraestructura. Inicializar el ecosistema con contenedores Docker, microservicios y colas asíncronas externas (Redis/RabbitMQ) para un equipo de TI reducido habría introducido una inmensa deuda técnica operativa (mantenimiento de imágenes, redes puente, permisos en volúmenes, etc.). Además, el stack de base de datos debía proveer máxima seguridad en el tipado y migraciones.

## Decisiones Tomadas
Para garantizar la operación por los próximos 5 a 10 años, se congela el Stack Tecnológico y la Política de Infraestructura con las siguientes reglas absolutas:

1. **Docker Status = FORBIDDEN:** La arquitectura debe funcionar nativamente en Windows, eliminando la complejidad de orquestación de contenedores en la Fase inicial.
2. **PostgreSQL Nativo:** Base de datos primaria (`System of Record`) alojada de manera nativa. SQLite, PocketBase, MariaDB prohibidos.
3. **ORM = Prisma:** Se selecciona Prisma ORM sobre TypeORM o Sequelize. Justificación: Mayor robustez en el ecosistema TypeScript, autogeneración de tipos de extremo a extremo, y migraciones más predecibles, disminuyendo los errores humanos.
4. **Backend Framework:** NestJS como el único "Cerebro" del sistema (`Business Backend`).
5. **Backoffice:** Directus, restringido exclusivamente a la gestión de catálogos y consola administrativa; tiene estrictamente prohibido ejecutar lógicas comerciales.
6. **Arquitectura:** Monolítico Modular. No se crearán microservicios independientes; todo vivirá dentro del framework de NestJS, comunicado por Eventos Internos de Dominio (`Event-Driven`).

## Consecuencias
- **Positivas:** Reducción drástica del "Friction Time" de desarrollo. Instalaciones más fáciles. El ORM de Prisma elimina SQL Injection y Type Errors. Las migraciones serán atómicas. Las reglas de "Source Purity" y "Audit Engine" (Hash Chaining) se pueden programar fuertemente acopladas al ciclo de vida de los repositorios de Prisma (Prisma Middleware/Extensions).
- **Negativas/Trade-offs:** Al rechazar Docker, los desarrolladores (o el entorno de CI/CD) requerirán instalaciones idénticas de las versiones de Node.js y PostgreSQL en Windows para asegurar la paridad de entornos.
