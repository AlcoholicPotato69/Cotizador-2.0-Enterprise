# IMPLEMENTATION_GAP_REGISTER.md

## TECHNICAL DEBT & GAP REGISTER (AGENT 09 & 10)

Documento oficial de desviaciones, elementos huérfanos o ausentes que no pertenecen al núcleo de la Fundación pero requerirán resolución antes de salir a producción final.

### GHOST CODE & ORPHANS
- **Componentes Builder (Vistas Experimentales):** Existen componentes (Ej. `PricingBuilder.vue`, `PromotionsBuilder.vue`, `SpaceBuilder.vue`, `RuleBuilder.vue`) que contienen Mocks e interfaces simuladas de AST y Rules. 
  - *Estado:* Pendientes (C).
  - *Justificación:* Estos módulos pertenecen al **Business Engine** y **Quote Management**, los cuales están bajo embargo directivo absoluto en esta fase.

### PLACEHOLDERS
- **Invoice & Payments:** `InvoiceProvider.ts` posee interfaces falsas para Intelisis/Facturama.
  - *Estado:* Pendientes (C).
  - *Justificación:* Prohibición explícita de desarrollo de pasarelas de pago y facturación.

### MOCK AUTOCORREGIDOS
- **Hash de Documentos:** `documentService.ts` tenía un `Math.random` catalogado como Mock. Fue auto-corregido a `crypto.subtle.digest(SHA-256)`.
- **PB Create Rules (Documents):** Regla `null` fue corregida en PocketBase Runtime para inyectar `@request.auth.tenant_id = tenant_id`.

### CONCLUSIÓN
No existen Gaps en la Fundación. Todos los Gaps detectados recaen estrictamente sobre módulos bloqueados estratégicamente por la Gerencia del Proyecto.
