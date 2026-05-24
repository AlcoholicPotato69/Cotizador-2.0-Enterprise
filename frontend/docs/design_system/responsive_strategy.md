# Responsive & Grid Strategy

La estrategia de responsividad adopta un enfoque **Mobile-First**, construyendo inicialmente para pantallas pequeñas y ajustando progresivamente a medida que el viewport aumenta, garantizando la optimización de recursos.

## 1. Breakpoints

Definición oficial de puntos de quiebre para media queries. Estos valores se inyectarán como variables en el sistema de pre-procesamiento o tokens JS.

*   `xs`: `0px` (Teléfonos en portrait, default)
*   `sm`: `640px` (Teléfonos grandes, phablets)
*   `md`: `768px` (Tablets en portrait)
*   `lg`: `1024px` (Tablets en landscape, Laptops pequeñas)
*   `xl`: `1280px` (Monitores de escritorio estándar)
*   `2xl`: `1536px` (Monitores grandes o Ultrawide)

*Uso en CSS/SASS:*
```css
@media (min-width: 1024px) { /* Lógica lg */ }
```

## 2. The Grid System

El sistema se basará en un Grid de **12 columnas** con CSS Grid moderno y flexible, abandonando los sistemas pesados basados en floats de generaciones anteriores.

*   **Columnas:** 12
*   **Gutter (Espaciado entre columnas):**
    *   Móvil (`xs` - `sm`): 16px (`--ds-space-4`)
    *   Tablet/Desktop (`md`+): 24px (`--ds-space-6`)

### Container Max-Widths
Para evitar que la aplicación se expanda infinitamente en monitores ultrawide y rompa la legibilidad, definimos anchos máximos para el Layout contenedor:
*   `sm`: 100% (Fluido)
*   `md`: 768px
*   `lg`: 1024px
*   `xl`: 1280px
*   `2xl`: 1536px (Máximo absoluto para lecturas normales, expandible en vistas tipo Data Grid).

## 3. Estrategia de Componentes Responsivos

1.  **Data Grids/Tables:** En móvil, las tablas complejas se transformarán en listados de `Cards` apiladas, o utilizarán contenedores con overflow horizontal (`overflow-x: auto`) manteniendo una columna primaria "pegajosa" (sticky).
2.  **Modals a Drawers:** En dispositivos móviles, los Modales estándar deben comportarse visualmente como "Bottom Sheets" (Drawers anclados abajo) para facilitar el alcance de los pulgares.
3.  **Navegación:** La barra lateral (Sidebar) colapsará a un Bottom Navigation Bar en móvil, o un Menú de Hamburguesa para funcionalidades secundarias.

## 4. Tipografía Fluida (Opcional pero Recomendado)

Uso de `clamp()` para asegurar que los títulos mantengan una proporción adecuada sin necesidad de docenas de media queries:
```css
/* Ejemplo Título Principal */
font-size: clamp(1.875rem, 5vw, 3rem);
```
