# 03 - Casa de Piedra Domain

## 1. Propósito
Casa de Piedra se especializa en la renta de espacios para eventos temporales (Salones, Jardines, Terrazas) y el cobro por métricas basadas en tiempo (días de montaje, horas extra de evento, días de desmontaje).

## 2. Reglas de Negocio (Business Rules)

### 2.1 Premontajes y Desmontajes
- **Regla Histórica**: Cuando un cliente requiere preparar un salón días antes del evento (armar escenarios, iluminación), se le cobra una tarifa reducida de "Premontaje".
- **Fórmula**: Históricamente fijado en un **25%** (`premontaje_pct = 25`) del precio base del salón por cada día de montaje extra.
- **Cortesías**: Existe el concepto de `premontaje_cortesia_dias` (Días gratuitos de montaje concedidos por gerencia).
- **Impacto en Agenda**: Un día marcado como "Premontaje" bloquea el espacio en el calendario para otros eventos. Las fechas de premontaje se almacenan en arreglos como `premontaje_fechas`.
- **Días Inhabilitados**: Se puede configurar qué días de la semana no se permite montar.

### 2.2 Horas Extra (Permanencia)
- **Regla Histórica**: Los eventos tienen una duración máxima predefinida. Si el cliente excede el tiempo, se cobra "Hora Extra".
- **Cálculo**: Es un ítem de aumento dinámico agregado a `conceptos_adicionales` de la cotización, dependiente de tarifas preconfiguradas o un monto manual que afecta el `precio_final`.

### 2.3 Convenios B2B
- Modifican el comportamiento del PDF: Aparecen como `Carta Convenio` en lugar de `Cotización`.
- Tienen características de:
  - `bloqueo_indefinido`: Bloquea las fechas sin una fecha de término explícita (para clientes recurrentes).
  - `requiere_evidencia`: Obliga a cargar fotos como "testigo" de que el convenio se ejecutó.
  - Generan "Entregables" que amortizan el balance del convenio (`convenio_monto_entregado` vs `convenio_base_total`).

### 2.4 Control de Accesos por Rol
- **Admin**: Todo permitido.
- **Ventas Casa de Piedra**: Solo pueden ver y cotizar espacios con `tenant = 'casa_de_piedra'`.

## 3. Riesgos
Si no se aíslan las reglas de Convenios o Premontajes en motores independientes, el código de "Cotizador" de Plaza Mayor se ensuciará con variables como `is_premontaje` que no tienen sentido en espacios publicitarios.
