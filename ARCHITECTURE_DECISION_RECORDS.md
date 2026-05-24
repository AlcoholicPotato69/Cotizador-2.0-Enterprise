# ARCHITECTURE DECISION RECORDS (ADR)

Este documento centraliza las decisiones de diseño arquitectónico fundamentales tomadas durante la congelación de la Etapa 0, garantizando el conocimiento persistente a lo largo de las migraciones futuras.

## ADR-1: Unified Snapshot Engine
**Decisión:** Crear un `SnapshotService` transversal y unificado en lugar de motores de snapshot por dominio.
**Justificación:** Evitar código duplicado. Las cotizaciones, contratos y facturas requieren el mismo nivel de inmutabilidad fotográfica en momentos específicos.
**Consecuencia:** Todos los objetos vivos que necesiten ser inmutables emitirán una copia JSON pura a una colección/almacenamiento de *snapshots* al cambiar a estados finales (`APPROVED`, `SIGNED`).

## ADR-2: Decoupled Approval Engine
**Decisión:** Desacoplar la máquina de estados de aprobación (Workflow) de las entidades de negocio.
**Justificación:** Evita el antipatrón de agregar N columnas a las tablas (ej. `approval_1`, `approval_2`) y permite flujos dinámicos sin alterar la base de datos central.
**Consecuencia:** Uso mandatorio de colecciones de pasos, decisiones y plantillas separadas.

## ADR-3: Space Occupancy Separation
**Decisión:** Un Contrato no implica Ocupación Automática. Se separan en entidades distintas.
**Justificación:** Los espacios físicos pueden entrar en mantenimiento, tener salidas anticipadas o prórrogas que no necesariamente modifican el contrato legal primario.
**Consecuencia:** Toda validación de "Overbooking" consulta `space_occupancy` y sus históricos, NO el estado del contrato.

## ADR-4: Hash Chaining para Auditoría
**Decisión:** Descartar blockchain completo, pero adoptar criptografía en `audit_logs`.
**Justificación:** El sistema requiere detectar manipulaciones manuales directas al SQLite sin sobrecomplicar la arquitectura con sistemas de cola o event sourcing puros.
**Consecuencia:** Cada log depende del hash anterior (`hash_encadenado`).

## ADR-5: Pagos como Evidence Review
**Decisión:** El dominio de pagos será exclusivamente un motor de revisión de evidencias asíncronas (recibos subidos).
**Justificación:** El negocio no cobra directamente mediante pasarelas (Stripe/PayPal) ni automatiza SPEI.
**Consecuencia:** Prohibido escribir código que asuma transacciones sincrónicas o retornos bancarios automáticos. Todo pasa por PENDING -> UNDER_REVIEW -> APPROVED por el rol Financiero.
