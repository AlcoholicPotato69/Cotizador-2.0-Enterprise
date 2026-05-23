# SPACE AVAILABILITY ENGINE

## 1. Misión
Garantizar la protección matemática de la Agenda Comercial. Evitar dobles reservas y gestionar conflictos temporales sin la intervención manual de los ejecutivos de cuenta.

## 2. Principio de Interrogación Temporal
Toda búsqueda de espacio en el Wizard de Cotizaciones pasará por este motor.
La función núcleo será: `checkAvailability(espacio_id, fecha_inicio, fecha_fin, occupancy_policy)`

### Resolución de Conflictos (Lógica No Estática)
El Availability Engine **no tomará decisiones cableadas**. En caso de un choque temporal (Ej. Cliente A intenta reservar el sábado, pero ya hay una boda), el Availability Engine lanzará una consulta al **Universal Rule Engine**.

**Ejemplo de Regla Configurativa**:
> "IF `nuevo_evento.tipo` == 'Institucional Gubernamental' AND `evento_existente.status` == 'tentative', THEN `force_override` = TRUE".

## 3. Gestión de la Política de Ocupación
Las políticas (`exclusive`, `shared`, `segmented`) no se asumen. Viven en el catálogo del espacio en el Tenant Administration Center (`espacios.occupancy_policy`). 
Si el administrador de Plaza Mayor decide que el "Vestíbulo Principal" pasa de `exclusive` a `segmented` para meter 3 expositores simultáneos, lo hará editando el catálogo sin tocar código, y el Availability Engine ajustará sus validaciones en tiempo real.

## 4. Inyección Automática de Bloqueos (Operational Injection)
Cuando una Cotización pasa a estado `reserved`, el motor revisa el `space_snapshot`. Si el catálogo indica que el salón exige premontaje, el sistema crea en la Agenda:
- Registro A: `Event` (10 Mayo 08:00 a 20:00, Comercial, Status: reserved)
- Registro B: `Operational_Block` (09 Mayo 12:00 a 23:59, Premontaje, Status: blocked)
- Registro C: `Operational_Block` (11 Mayo 08:00 a 14:00, Desmontaje, Status: blocked)

Ningún vendedor podrá tocar las horas de los registros B y C, porque el Availability Engine retornará colisión.
