# Space Catalog Engine

## 1. Visión General
El **Space Catalog Engine** es el módulo encargado de gestionar el inventario comercializable de los tenants. En la nueva arquitectura *Configuration-Driven*, el sistema abandona los tipos y estructuras rígidas (como el booleano `aplica_premontaje`) y adopta un modelo jerárquico dinámico.

## 2. Abstracción Jerárquica
La clasificación del inventario se delega completamente a la base de datos a través de agrupaciones configurables.

- **Tenant** (Ej. Poliforum)
  - **Categoría** (Ej. Espacios Físicos)
    - **Subcategoría** (Ej. Salones Cerrados)
      - **Espacio** (Ej. Salón C1, Salón C2)
  - **Categoría** (Ej. Publicidad)
    - **Subcategoría** (Ej. Digital)
      - **Espacio** (Ej. Pantalla Entrada Principal)

## 3. Propiedades Dinámicas (EAV Model)
Ya que un "Salón" necesita almacenar `capacidad_personas` pero una "Pantalla" requiere `resolucion_pixeles` y `duracion_spot`, el esquema de espacios implementará propiedades dinámicas (JSON estructurado u EAV) administrables desde el Tenant Administration Center.

## 4. Disponibilidad y Conflictos (Inventory Engine)
El sistema controla las lógicas de ocupación:
- **Reserva Dura**: Un contrato firmado bloquea las fechas exactas.
- **Reserva Blanda**: Una cotización aprobada (y no vencida) reserva tentativamente el espacio.
- **Regla de Concurrencia**: Dos prospectos no pueden tener cotizaciones vigentes que solapen el mismo espacio físico en la misma fecha (Configurable).

## 5. Integración con el Pricing Rules Engine
El Catálogo de Espacios provee el `precio_base_sugerido`. Sin embargo, es el **Pricing Rules Engine** quien define si hoy es temporada alta, o si aplica recargo por horas extra. El Catálogo es "tonto" matemáticamente, solo sirve como fuente de datos puros.
