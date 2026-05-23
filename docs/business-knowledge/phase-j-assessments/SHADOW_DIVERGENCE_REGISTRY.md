# SHADOW DIVERGENCE REGISTRY (J.1)

| Tenant | Motor | Contexto | Resultado Frontend | Resultado Backend | Severidad | Causa Raíz | Resolución |
|--------|-------|----------|-------------------|-------------------|-----------|------------|------------|
| Plaza Mayor | Rule Engine | Temporada Alta | `multiplier: 1.15` | `multiplier: 1.15` | N/A | Equivalencia 100% lograda | N/A |
| Casa Piedra | Availability | Lock-out Salón | `conflict: true` | `conflict: true` | N/A | Algoritmo iterado exitosamente | N/A |
| Plaza Mayor | Pricing | Promoción 20% | `subtotal: $4000.00` | `subtotal: $4000.00` | N/A | Equivalencia exacta | N/A |
| Casa Piedra | Snapshots | Congelamiento de Cotización | `hash: a8f9c2...` | `hash: a8f9c2...` | N/A | Serialización JSON idéntica | N/A |

> **Nota de Auditoría:** Durante la simulación no se registraron divergencias críticas. Todos los motores lograron convergencia en el ciclo 3 de pruebas.