# FUTURE MAINTENANCE AUDIT

## 1. Pregunta Central
¿Puede un administrador funcional operar y evolucionar el negocio sin depender del desarrollador original?

**Respuesta (Fase D)**: **SÍ.**

## 2. Justificación Técnica
La plataforma Cotizador 2.0 ha trasladado el peso del "mantenimiento" de los programadores a los Administradores de Negocio (Directores Comerciales, Finanzas, Legal) gracias al **Tenant Administration Center**.

Si ocurren los siguientes eventos, un desarrollador NO tiene que intervenir:

- **Escenario 1**: Hacienda cambia el IVA del 16% al 15%.
  - *Mantenimiento*: El Admin entra al TAC -> Ajustes de Tenant -> Impuestos -> Clona regla "IVA", pone 15%, y archiva la anterior.

- **Escenario 2**: El equipo Comercial saca una promo por el "Buen Fin" de un descuento fijo de $5,000 MXN en Salones.
  - *Mantenimiento*: El Admin entra al TAC -> Universal Rule Engine -> Crea regla tipo `promotion` -> Pone condición "Espacio = Salón AND Mes = Noviembre" -> Pone acción "Descuento -$5,000". Se activa inmediatamente.

- **Escenario 3**: El área Legal decide cambiar una cláusula de responsabilidad civil en los contratos de Plaza Mayor.
  - *Mantenimiento*: El Admin entra al TAC -> Editor de Plantillas -> Selecciona "Contrato Salón Físico V1" -> Clona a "V2" -> Edita texto -> Guarda. A partir de mañana todas las nuevas firmas usarán V2, pero las anteriores quedan en V1 (gracias al Snapshot embedding).

## 3. Riesgos Restantes
El único riesgo de cuello de botella está en la **Curva de Aprendizaje del Rule Simulator**.
Para que el Administrador Funcional sea totalmente independiente, el *Tenant Administration Center* debe ser extremadamente intuitivo en la construcción del JSON de condiciones. Si el UI es complejo, los administrativos le pedirán a un desarrollador que cree las reglas en su nombre.

**Mitigación**: Hemos exigido un UI altamente visual (Selects, Drag & Drop de condiciones) para la Fase Final del TAC.
