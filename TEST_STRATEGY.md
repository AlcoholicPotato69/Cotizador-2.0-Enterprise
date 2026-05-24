# Estrategia de Pruebas - Mandato V5.4

## 1. Visión General
Esta estrategia define el enfoque de calidad para asegurar que el Mandato V5.4 cumple con los estándares empresariales de estabilidad, rendimiento y seguridad antes de otorgar la **QA_CERTIFICATION**. Como QA Authority, esta estrategia dicta las reglas absolutas de validación.

## 2. Niveles de Prueba
- **Pruebas Unitarias:** Responsabilidad del equipo de desarrollo. Cobertura mínima obligatoria: 80% (líneas y ramas).
- **Pruebas de Integración:** Validar la correcta comunicación entre componentes, microservicios, APIs y persistencia de datos.
- **Pruebas E2E (End-to-End):** Validar los flujos críticos de negocio (KUJs) desde la perspectiva del usuario final en un entorno similar a producción.
- **Pruebas de Rendimiento:** Asegurar tiempos de respuesta aceptables (p.ej. menores a 200ms en endpoints de cotización crítica) bajo concurrencia esperada.
- **Pruebas de Seguridad:** Ejecución de SAST/DAST y validación de políticas de control de acceso.

## 3. Criterios de Entrada y Salida para la QA_CERTIFICATION
- **Entrada a QA:** Código base congelado en el entorno de `staging`, PRs aprobados y fusionados, pruebas unitarias integradas en pipeline en verde.
- **Salida (Certificación):** 100% de la suite E2E superada, 0 defectos con severidad Bloqueante, Crítica o Alta, validación de la Matriz de Certificación de Dominio completada, y firma formal de la QA Authority.
