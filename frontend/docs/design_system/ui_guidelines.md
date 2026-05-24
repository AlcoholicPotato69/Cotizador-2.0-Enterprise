# Principios de High-End Visual Design

Este documento establece las bases para una estética visual premium y exclusiva, tomando inspiración de referentes como Stripe, Linear, The Ritz-Carlton y Salesforce. La interfaz debe sentirse costosa, pulida y espacial.

## 1. El Poder del Espacio en Blanco (White Space)
- **Respiración Visual:** El espacio vacío no es ausencia de contenido, es un elemento activo. Utilizamos márgenes generosos (macro-spacing) para agrupar componentes y padding preciso (micro-spacing) dentro de los elementos para asegurar una lectura fluida.
- **Ley de Proximidad:** El espacio dictará la relación entre elementos. Componentes relacionados tendrán menor separación (4px - 8px), mientras que secciones distintas usarán espacios amplios (48px - 96px) para una demarcación elegante.

## 2. Jerarquía Tipográfica
- **Contraste y Ritmo:** Se utiliza un fuerte contraste entre encabezados y cuerpo de texto (peso, tamaño, color). 
- **Selección Tipográfica Premium:** Las fuentes deben reflejar claridad institucional y elegancia. 
  - *Headings:* Tipografía sans-serif geométrica o serif de alto contraste (dependiendo del tema), con tracking ajustado para dar sensación de solidez y peso corporativo.
  - *Body:* Sans-serif altamente legible, optimizada para interfaces digitales, con line-height de `1.5` a `1.7` para facilitar la lectura de datos complejos.

## 3. Antigravity & Sombras (Elevación)
- **Soft Depth (Profundidad Suave):** Las sombras nunca son negras puras ni duras. Se utilizan sombras multicapa con baja opacidad y alto difuminado (blur) para dar la sensación de que los elementos flotan sobre el fondo (efecto Antigravity).
- **Glassmorphism:** Uso sutil de fondos translúcidos y desenfoque de fondo (`backdrop-filter`) para barras de navegación o paneles superpuestos, otorgando un aspecto hipermoderno y limpio.

## 4. Detalles y Microinteracciones
- **Bordes y Delimitadores:** Uso de bordes sutiles (1px sólido con opacidades del 5% al 10%) para enmarcar contenido sin generar ruido visual.
- **Transiciones Fluidas:** Cualquier cambio de estado (hover, focus, active) debe animarse de forma fluida (200-300ms, curva de easing customizada tipo `cubic-bezier(0.25, 1, 0.5, 1)`) para sentirse responsivo pero sin prisa, como una puerta pesada que se cierra suavemente.
