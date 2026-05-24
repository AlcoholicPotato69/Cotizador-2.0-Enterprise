# Criterios de Aceptación Globales - Mandato V5.4

Para dar por concluido el mandato y proceder al despliegue, el sistema debe adherirse a los siguientes criterios de calidad.

## 1. Criterios Funcionales
- Todas las Historias de Usuario (User Stories) e incidencias del Mandato V5.4 deben haber cumplido sus propios Criterios de Aceptación.
- El cálculo de las cotizaciones debe arrojar resultados exactos con un margen de tolerancia del 0.00% contra el motor contable de referencia.
- La generación de salidas (PDF/Excel) debe mostrar el formato oficial corporativo actualizado para la versión 5.4, sin descuadres visuales.
- El flujo de aprobación multinivel debe enrutar correctamente las notificaciones al responsable en base al monto total de la cotización.

## 2. Criterios No Funcionales
- **Tiempos de Respuesta:** La carga inicial de la aplicación (FCP) y el cálculo de la cotización deben tardar menos de 2.0 segundos en conexiones de banda ancha estándar.
- **Resiliencia:** Si ocurre una desconexión o fallo en los servicios externos de CRM, el sistema debe informar al usuario elegantemente sin comprometer los datos ya capturados (Graceful Degradation).
- **Usabilidad y Accesibilidad:** La interfaz gráfica no debe presentar desbordamientos (overflows) no deseados. Se requiere cumplimiento de contraste WCAG nivel AA.
- **Compatibilidad de Navegadores:** Se certifica el correcto funcionamiento en las dos versiones más recientes de Google Chrome, Mozilla Firefox y Microsoft Edge (Chromium). Safari será soportado con esquema de best-effort.
