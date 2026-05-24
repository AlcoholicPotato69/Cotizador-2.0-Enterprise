# Bounded Context Map

Este documento mapea los límites lógicos del Cotizador 2.0 Enterprise y cómo interactúan entre sí bajo los principios de Domain-Driven Design.

## Contextos Identificados
1. **Quote Context** (Core)
2. **Pricing Context** (Supporting)
3. **Catalog Context** (Supporting)
4. **Customer Context** (Supporting)
5. **IAM Context** (Generic)
6. **ERP Integration Context** (Anti-Corruption Layer)

## Relaciones Estratégicas (Context Mapping)

- **Quote Context -> Pricing Context**: *Conformist / RPC*. 
  El Quote Context necesita calcular los totales y consume sincrónicamente un servicio expuesto por Pricing (Open Host Service).

- **Quote Context -> Catalog Context**: *Customer-Supplier*. 
  Quote utiliza los IDs de productos y snapshots de las descripciones proporcionadas por Catalog.

- **Quote Context -> Customer Context**: *Customer-Supplier*. 
  Quote almacena el ID del cliente y snapshot de datos de facturación al momento de generar el documento.

- **ERP Integration Context -> All**: *Anti-Corruption Layer (ACL)*. 
  Actúa como barrera de traducción entre el modelo de datos canónico de nuestro sistema y el modelo de datos heredado del ERP corporativo. Previene que la deuda técnica externa infecte el Cotizador.

- **IAM Context -> All**: *Shared Kernel / Open Host Service*. 
  Todos los contextos extraen y validan la identidad (Actor) apoyados en tokens provistos por el contexto IAM.
