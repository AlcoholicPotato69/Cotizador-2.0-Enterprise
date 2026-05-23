# 02 - Plaza Mayor Domain

## 1. Propósito
Plaza Mayor es el recinto principal. Su dominio comercial abarca tanto la renta de espacios físicos para exposiciones masivas, como la comercialización de **Espacios Publicitarios** (Mupis, Pantallas, Pendones) bajo esquemas de temporalidad (semanas, quincenas, meses).

## 2. Reglas de Negocio (Business Rules)

### 2.1 Espacios Publicitarios Físicos vs Digitales
A diferencia de un "Salón" en Casa de Piedra, la Publicidad en Plaza Mayor requiere meta-información profunda:
- **Plano Arquitectónico y Geográfico**: Dónde está ubicado físicamente el anuncio.
- **Medidas / Dimensiones**: Alto y ancho exacto (vital para que el cliente mande a imprimir sus lonas).
- **Materiales Recomendados**: Vinil, Lona Front, Backlight, etc.
- **Circuitos Digitales**: Anuncios en pantallas que rotan cada X segundos (Tótems). Se cobra por frecuencia de aparición (Ej. "1 spot de 10 segundos cada minuto").

### 2.2 Cotizaciones Publicitarias
- **Duración Dinámica**: Las fechas no son "un día de evento", sino "Rango de exhibición" (`fecha_inicio` a `fecha_fin`).
- **Ajustes y Descuentos**: Se usan enumeradores de ajuste (`ajuste_tipo`: porcentaje, monto fijo) para negociar campañas completas de publicidad masiva.
- **Multi-Espacio**: Una sola cotización de Plaza Mayor suele contener 10, 20 o 50 espacios publicitarios al mismo tiempo (Una campaña).
- **Evidencia Fotográfica**: Para cobrar campañas terminadas, el cliente (o el agente) debe subir fotos "testigo" (`evidencias`) de que el anuncio físico se colocó correctamente.

### 2.3 Membretes y Multi-Entidades
Plaza Mayor puede generar PDFs que requieran razones sociales o cuentas bancarias distintas (Ej. Ingresos propios vs fideicomisos), lo cual se modela a través de la inyección del logo y datos fiscales en el Template Engine según el `tenant` (o sub-tenant).

## 3. Casos de Uso Reales
- **Venta de Campaña**: Un cliente renta 5 tótems por 3 meses. El sistema debe bloquear esos 5 tótems en el catálogo para que ningún otro agente pueda venderlos en el mismo rango de fechas.
- **Conflicto de Inventario**: Si el espacio es "compartido" (pantalla digital), el sistema permite "overbooking" controlado hasta llegar al tope de la frecuencia contratada (Ej. Límite de 6 clientes por pantalla rotativa).
