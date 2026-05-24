# Principios de Experiencia de Usuario (Enterprise UX)

Este documento define los principios fundamentales de diseño para el Cotizador 2.0 Enterprise. El sistema está diseñado para usuarios internos y operadores que utilizan la plataforma durante jornadas de 8+ horas. El objetivo principal es la eficiencia, la precisión y la reducción del agotamiento mental.

## 1. Minimización de la Carga Cognitiva
*   **Densidad de Información Controlada:** Los usuarios enterprise prefieren alta densidad de datos frente a la necesidad de hacer *scroll* o cambiar de página constantemente. Utilizaremos tipografía legible y espaciado compacto pero estructurado (Data-dense UI).
*   **Jerarquía Visual Estricta:** Destacar lo accionable y atenuar lo referencial. Los botones primarios se reservan para la acción principal de la pantalla; todo lo demás debe ser secundario o terciario.
*   **Estado Contextual Siempre Visible:** El usuario nunca debe preguntarse "Dónde estoy" o "Qué filtro está aplicado". Los filtros activos, la paginación y el breadcrumb deben estar siempre anclados en la parte superior.

## 2. Optimización para Flujos de 8+ Horas (Power Users)
*   **Navegación por Teclado (Keyboard First):** Todas las acciones críticas (guardar, cancelar, nuevo, buscar, cambiar de pestaña) deben tener un atajo de teclado global. Las tablas de datos deben permitir navegación con flechas direccionales.
*   **Reducción de Clics:** Los flujos repetitivos no deben requerir más de 2-3 clics. Promover el uso de acciones masivas (*bulk actions*) y edición en línea (*inline editing*) en lugar de abrir modales para cada modificación sencilla.
*   **Tiempos de Respuesta Visibles:** Ninguna acción debe dejar la interfaz bloqueada sin feedback. Usar *skeleton loaders* para la carga inicial y *spinners* o barras de progreso para acciones transaccionales pesadas.

## 3. Prevención y Recuperación de Errores
*   **Validación Contextual Inmediata:** Los errores en los formularios deben mostrarse a nivel de campo en el momento exacto en que se pierde el foco (onBlur) y nunca esperar hasta el final del formulario (onSubmit).
*   **Deshacer (Undo) vs Confirmar:** Para acciones destructivas (borrar, archivar), priorizar la opción de "Deshacer" en un *Toast notification* en lugar de interrumpir el flujo con un modal de "¿Estás seguro?", excepto en acciones irreversibles a nivel de sistema.
*   **Autoguardado Silencioso:** Los formularios largos y los *wizards* multicapa deben autoguardarse como "Borrador" de manera transparente al usuario para prevenir pérdida de datos por cierres accidentales.
