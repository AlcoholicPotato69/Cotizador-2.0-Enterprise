# 04 - Space Catalog Model

## 1. Naturaleza Híbrida del Catálogo
El catálogo de espacios (`espacios`) no asume si está vendiendo un "Metro Cuadrado", un "Salón por día" o una "Pantalla por quincena". 

## 2. Configuración B2B (`config_b2b`)
- Los espacios pueden contener configuraciones JSON complejas para manejar escenarios de tarifas especiales.
- Existen `precios_por_dia` para definir estacionalidades (Ej. más caro en fin de semana).
- Existen `dias_bloqueados` (Ej. No se renta los domingos).

## 3. Manejo de Impuestos
- Un espacio tiene asignados IDs de impuestos (`impuestos_ids`).
- El IVA u otros impuestos no están hardcodeados, sino vinculados relacionalmente.

## 4. Multi-Tenant
- Todo espacio le pertenece a un Tenant específico (`Plaza Mayor` o `Casa de Piedra`).
- El frontend y backend filtran rigurosamente por esta columna. No se cruza inventario.
