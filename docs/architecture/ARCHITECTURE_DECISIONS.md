# Architecture Decision Records (ADRs)

## ADR 001: Arquitectura Monolito Modular
- **Status**: Aceptado
- **Contexto**: El sistema debe mantener una separación lógica fuerte para un posible futuro particionamiento en microservicios a medida que la empresa crezca. Sin embargo, iniciar con microservicios añadiría una complejidad de despliegue y red (latencia) innecesaria en esta etapa (Premature Optimization).
- **Decisión**: Implementaremos un **Monolito Modular** utilizando módulos de NestJS fuertemente encapsulados, exponiendo únicamente interfaces/servicios formales y ocultando su infraestructura y persistencia interna.

## ADR 002: Base de Datos Única con Esquemas Lógicos Separados
- **Status**: Aceptado
- **Contexto**: Se requiere separar la persistencia de los Bounded Contexts respetando el Monolito Modular sin el costo de mantener instancias RDS/PostgreSQL separadas.
- **Decisión**: Usar una sola instancia de PostgreSQL. Utilizaremos la función nativa de PostgreSQL para crear **schemas** separados (`quote_schema`, `catalog_schema`, `iam_schema`) y el *feature preview* de Prisma `multiSchema` para gobernar estos esquemas bajo un único schema de Prisma, prohibiendo uniones foráneas cruzadas (`foreign keys` cross-schema) desde el lado del código.

## ADR 003: Prisma como ORM Principal
- **Status**: Aceptado
- **Decisión**: Seleccionar Prisma ORM para todas las interacciones de base de datos debido a su robusta seguridad de tipos (type-safety) integral de extremo a extremo, excelente integración de generadores y soporte nativo completo para las características avanzadas de PostgreSQL, como el tipo `JSONB` que será clave para el catálogo de productos dinámico y los metadatos de configuración en el CRM.

## ADR 004: Core Event-Driven (Desacoplamiento Interno)
- **Status**: Aceptado
- **Decisión**: Adoptar un flujo guiado por eventos (Event-Driven Architecture) para los efectos colaterales. A nivel tecnológico, usaremos `@nestjs/event-emitter` en la memoria del monolito. Si en el futuro un módulo es promovido a Microservicio autónomo, el bus de eventos en memoria se reemplazará por Kafka, RabbitMQ o AWS EventBridge transparente al dominio, dado que ya estará modelado asíncronamente.
