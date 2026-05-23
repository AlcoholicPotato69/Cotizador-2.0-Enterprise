# TABLE SYSTEM GUIDE

## Patrón Universal de Tablas
Todas las tablas implementan:
1. Búsqueda *debounced*.
2. Paginación Server-Side.
3. Esqueletos (Skeleton Loaders) durante el *fetch*.
4. Estado Vacío (*Empty State*) ilustrado.
No se usarán grids de terceros pesados, se construirá un componente `ds-data-table` base.