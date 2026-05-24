# Domain Interaction Rules

Estas reglas gobiernan cómo debe escribirse el código para mantener la arquitectura limpia (Clean Architecture / Hexagonal).

### 1. Regla de Agregados (Aggregates Rule)
Los Agregados (Entidades raíz) **sólo pueden referenciarse entre sí a través de sus IDs primitivos**. 
- **Incorrecto:** La clase `Quote` tiene una propiedad `public customer: Customer`.
- **Correcto:** La clase `Quote` tiene una propiedad `public customerId: string`.

### 2. Consistencia Transaccional Estricta
Una transacción de base de datos (por ejemplo, Prisma `$transaction`) **sólo debe modificar UNA instancia de Agregado por operación**. Si se necesita actualizar datos a través de múltiples límites de contexto, se debe lograr mediante Consistencia Eventual (Domain Events) asegurando la Alta Disponibilidad.

### 3. Lecturas Multi-Dominio (Cross-Context Queries)
Para vistas complejas o Data Tables en el frontend que requieren unir Cotizaciones, Nombres de Cliente y Datos de Producto:
- Quedan **prohibidos** los `JOIN` nativos a nivel de BD o de Prisma (`include`) cruzando esquemas lógicos de módulos distintos.
- **Patrón a utilizar**: Backend-for-Frontend (BFF) o un patrón CQRS en el que un `QueryHandler` en NestJS consume servicios expuestos por los distintos módulos para ensamblar y devolver el DTO hidratado al cliente.

### 4. Inyección de Dependencias Limpia (Ports and Adapters)
Los Servicios de Casos de Uso (Application Services / Use Cases) de un módulo **no** pueden inyectar Repositorios (`PrismaService`) directamente si consultan datos que "pertenecen" a otro módulo. 
Deben inyectar *Ports* (Interfaces de TypeScript), que serán resueltas en la infraestructura mediante inyección de NestJS usando Adapters.
