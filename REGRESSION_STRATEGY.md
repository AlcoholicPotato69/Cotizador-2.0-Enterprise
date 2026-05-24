# Estrategia de Regresión - Mandato V5.4

La estrategia de regresión garantiza que la introducción del Mandato V5.4 no degrade ninguna funcionalidad preexistente ni introduzca efectos secundarios no deseados.

## 1. Alcance y Frecuencia
- **Smoke Testing Continuo:** Conjunto de pruebas críticas automatizadas que se ejecutarán en cada `Pull Request` hacia la rama principal. Ningún PR podrá ser fusionado sin esta validación.
- **Regresión Profunda:** Ejecución completa del Test Suite automatizado previo a cualquier release al entorno de producción o pruebas UAT.

## 2. Cobertura de Regresión
- Se ejecutarán pruebas de integración que validen los contratos (API Contracts) de los endpoints actuales, asegurando compatibilidad hacia atrás.
- Los módulos que no sufrieron cambios directos en el Mandato V5.4 pero que comparten dependencias (ej. Módulo de clientes) serán cubiertos al 100% por la automatización de regresión.

## 3. Pruebas Manuales y Exploratorias
- **Timeboxing:** Se asignarán bloques de tiempo limitados a los ingenieros de QA para pruebas exploratorias buscando defectos no anticipados por la automatización.
- **Cross-browser y Dispositivos:** Parte de la regresión manual incluirá la validación visual en diferentes resoluciones, prestando particular atención a tablets y vistas móviles.

## 4. Política de Defectos en Regresión
- Si un defecto detectado califica como "Regresión" (una funcionalidad que antes funcionaba ahora está rota):
  - **Bloqueante/Crítico:** Detiene inmediatamente el release. Debe ser parcheado y la suite de regresión reiniciada.
  - **Medio/Bajo:** Se evaluará en comité de Triage si se atiende antes del release o entra en el backlog técnico como deuda de alta prioridad.
