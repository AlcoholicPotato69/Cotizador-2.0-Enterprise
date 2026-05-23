# EVENT DOMAIN MODEL

## 1. Definición Conceptual
El "Evento" es la materialización en el tiempo y espacio de un "Quote File". Mientras que la Cotización es el acuerdo comercial, el Evento es la ejecución operativa real que afecta la agenda general del Tenant.

## 2. Tipos de Ocupación (Occupancy Types)
La ocupación de un espacio no se rige por hardcodeos ("digital vs físico"), sino por **Occupancy Policies** configurables:
- **`exclusive`**: Bloqueo total. Si el cliente A ocupa el espacio, nadie más puede usarlo en ese milisegundo (Ej. Salón, Stand, Mupi).
- **`shared`**: Permite sobreventa controlada bajo aforos.
- **`segmented`**: Permite múltiples clientes simultáneos dividiendo el tiempo o pantalla (Ej. Pantallas Digitales que rotan 5 marcas distintas).

## 3. The Soft Reservation Lifecycle
Un evento viaja a través de un ciclo de vida estrictamente regido por el motor de reservaciones:

1. **`available`**: El espacio está libre en la fecha/hora.
2. **`tentative`**: La cotización fue generada. Se crea un "Hold" que expira automáticamente si no hay pago en 48 horas.
3. **`reserved`**: El cliente realizó el pago de anticipo (Installment 1). El espacio bloquea a otros clientes que busquen el mismo bloque `exclusive`.
4. **`blocked`**: Ocupación por un Operativo Interno (No comercial).
5. **`maintenance`**: Espacio fuera de servicio (No comercializable).

## 4. Operational Blocks (Tiempos Muertos)
Un evento comercial suele venir acompañado de satélites temporales ("Bloqueos Operativos"). Estos bloques son inyectados automáticamente por el *Universal Rule Engine* dependiendo de lo que el cliente compró:
- **`premontaje`**: Tiempo necesario para armar escenarios o stands antes del inicio comercial.
- **`desmontaje`**: Tiempo post-evento para liberar el recinto.
- **`limpieza`**: Bloque inyectado automáticamente tras terminar desmontaje.
- **`eventos_internos`**: Reservas operacionales del personal (Ej. Capacitación de la empresa).

El *Availability Engine* leerá todos estos bloques satelitales como ocupación dura (`exclusive`) y rechazará cotizaciones que choquen con el desmontaje de un evento previo.
