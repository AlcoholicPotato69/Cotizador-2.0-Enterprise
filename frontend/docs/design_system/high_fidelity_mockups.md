# High-Fidelity Mockups (Descripciones Visuales)

Dado el nivel "High-End", la interfaz final debe manifestarse como una experiencia pulida, donde cada píxel tiene un propósito. A continuación se describen vívidamente las pantallas clave en ambos temas.

## Pantalla Principal: Dashboard de Cotizaciones

### Tema: Plaza Mayor (Vista Corporativa)
**Layout:** 
Al abrir el dashboard, el usuario es recibido por un lienzo blanco inmaculado. La barra de navegación lateral izquierda tiene un fondo gris perla `#F3F4F6` con una delgada línea divisoria vertical sólida de 1px a la derecha.

**Interacciones y Componentes:**
- **Tarjetas de Resumen (KPIs):** Cuatro cajas rectangulares, esquinas casi afiladas (radius 2px). Cada tarjeta tiene un título en mayúsculas pequeñas (overline) en gris claro, seguido por números grandes y audaces en negro absoluto. Un pequeño indicador de porcentaje en Accent `#2FAF67` a la derecha.
- **Tabla de Cotizaciones:** Las filas alternan sutilmente entre blanco puro y un ultimísimo gris. No hay líneas verticales. El botón de "Nueva Cotización" es un bloque sólido en Primary `#0E7A43`, con texto blanco en una tipografía sans-serif geométrica. Al hacer hover, el color cambia fluidamente a `#0B6537` sin alterar su posición geométrica.

### Tema: Casa de Piedra (Vista de Lujo)
**Layout:** 
La pantalla respira un ambiente más íntimo. El fondo principal es un blanco marfil muy ligero (`#FAFAF9`), evocando un papel de alta calidad. La barra lateral flota sobre este fondo como un panel semitransparente (glassmorphism sutil) con un ligero blur detrás.

**Interacciones y Componentes:**
- **Tarjetas de Resumen (KPIs):** Las tarjetas parecen estar hechas de un material premium, con bordes redondeados (radius 12px) y una sombra difusa, teñida sutilmente con café (`#8B7355` al 5% de opacidad), dándoles una sensación de gravedad y flotabilidad (Antigravity).
- **Tabla de Cotizaciones:** Las filas de la tabla son tarjetas independientes que flotan levemente al pasar el mouse por encima (efecto de elevación de 2px hacia arriba con una sombra expandida). El botón "Nueva Cotización" presenta un gradiente apenas perceptible del Primary `#8B7355` a un tono ligeramente más claro, con un contorno (border) interior dorado (`#B89A67`) que simula un bisel iluminado.

## Pantalla de Detalles de Cotización

**Plaza Mayor:**
Un panel lateral (drawer) entra desde la derecha con un movimiento rápido y nítido. La información está organizada en bloques de información (Data Grid) perfectos. La jerarquía tipográfica es brutal y directa.

**Casa de Piedra:**
El modal de detalle emerge desde el centro de la pantalla escalando suavemente y difuminando fuertemente el fondo (backdrop blur). La tipografía del título del evento cotizado utiliza una fuente Serif elegante, mientras que los detalles de precios están en una Sans-Serif cálida. Los campos y totales están separados por finas líneas divisorias que se desvanecen en los extremos.
