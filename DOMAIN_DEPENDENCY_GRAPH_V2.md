# DOMAIN DEPENDENCY GRAPH V2

```mermaid
graph TD
    %% Core & Fundacional
    A[1. Auth] --> B[2. Tenants]
    B --> C[3. RBAC]
    C --> D[4. Settings]
    D --> E[5. Audit Engine]
    E --> F[6. Snapshot Engine]
    F --> G[7. Approval Engine]

    %% Negocio Core
    G --> H[8. Clientes]
    H --> I[9. Espacios]
    I --> J[10. Space Occupancy]
    J --> K[11. Document Domain]

    %% Transaccional
    K --> L[12. Cotizaciones]
    L --> M[13. Contratos]
    M --> N[14. Renovaciones]
    M --> O[15. Firmas]

    %% Financiero y Salida
    M --> P[16. Facturación]
    P --> Q[17. Pagos]
    Q --> R[18. Notificaciones]
    R --> S[19. Reportes]

    %% Dependencias ocultas mitigadas
    O -.->|Congela estado| F
    P -.->|Lee Snapshot| F
    L -.->|Usa| G
    M -.->|Usa| G
```

## Análisis de Acoplamientos Peligrosos Evitados:
- Facturación y Clientes/Espacios están aislados por la barrera del *Snapshot Engine*.
- Ocupación y Contratos están separados; un contrato puede cancelarse sin liberar espacio de inmediato, o liberar espacio sin borrar el contrato.
- Pagos depende de Facturas, pero no procesa dinero, solo aprueba *Documents* subidos a través de *Approval Engine*.
