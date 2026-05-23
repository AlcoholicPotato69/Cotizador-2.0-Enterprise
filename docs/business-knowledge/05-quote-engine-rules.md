# 05 - Quote Engine Rules

## 1. Snapshotting (Congelación de Precios)
- **Principio Fundamental**: Cuando una cotización se crea o aprueba, el sistema extrae la información del catálogo (precio base, porcentaje de impuesto, nombre del espacio) y la guarda de forma estática en la cotización (`desglose_precios`).
- Si mañana el IVA cambia o el "Salón" sube de precio, las cotizaciones pasadas no se inmutan.

## 2. Flujo de Estados (`status`)
1. **Pendiente**: Borrador modificable.
2. **Aprobada**: Bloqueada financieramente. Se emitió el PDF final.
3. **Rechazada**: Descartada.
4. **Finalizada**: Ejecutada operativamente y/o pagada.

## 3. Aumentos y Descuentos (`conceptos_adicionales`)
- Permite inyectar conceptos manuales a la cotización (limpieza, catering).
- Pueden ser absolutos ($500) o relativos (10% de descuento).

## 4. Cálculo Impositivo Automático
- Suma (Precio Base + Aumentos - Descuentos) * Suma(Porcentaje Impuestos Aplicables).
