# Requisitos de Pruebas End-to-End (E2E) - Mandato V5.4

Este documento establece la cobertura indispensable a nivel de E2E. Ninguna liberación pasará la evaluación de la QA Authority si estos flujos presentan defectos.

## 1. Key User Journeys (KUJs) a Automatizar
1. **KUJ-01: Autenticación Segura.** Login de usuario administrador y asesor comercial, validando persistencia de sesión.
2. **KUJ-02: Flujo Feliz de Cotización.** Creación de una cotización desde cero, agregando al menos 3 productos diferentes con variaciones, aplicación de impuestos, visualización de total y guardado exitoso.
3. **KUJ-03: Flujo de Aprobación por Descuentos.** Creación de una cotización que excede el margen de descuento permitido, la cual debe entrar en estado de `Pendiente de Aprobación`. El supervisor debe poder iniciar sesión, revisar la solicitud y autorizarla.
4. **KUJ-04: Exportación Documental.** Búsqueda de una cotización aprobada, generación y descarga exitosa del archivo PDF comprobando que su tamaño no sea de 0 bytes.

## 2. Gestión de Entorno y Datos
- **Entorno:** Las pruebas E2E deben correr contra un ambiente `staging` o `sandbox` preconfigurado con una base de datos limpia.
- **Data Driven:** Prohibido el uso de credenciales de producción. Los scripts deben inyectar y limpiar sus propios datos de prueba antes y después de cada ejecución para evitar colisiones (Flaky tests).

## 3. Stack Tecnológico de Pruebas
- Preferiblemente **Playwright** o **Cypress** para la ejecución en front-end.
- Las aserciones deben evaluar tanto la respuesta de la API interceptada (código de red 200/201) como la renderización del componente en el DOM.
