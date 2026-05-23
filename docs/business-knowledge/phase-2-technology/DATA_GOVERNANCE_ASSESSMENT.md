# DATA GOVERNANCE ASSESSMENT (Fase 2.7)

## 1. Calidad de Datos (Data Quality)
- **Diagnóstico**: La migración masiva inicial desde Excel a Cotizador 2.0 arrastró inconsistencias históricas.
- **Duplicidad de Clientes**: Se detectó una tasa de duplicidad del 12% en RFCs (Ej. "Empresa S.A." vs "Empresa SA"). 
- **Solución**: El motor de validación en Base de Datos ahora fuerza unicidad mediante `UNIQUE(rfc, tenant_id)` y estandariza la captura de razón social en Mayúsculas sin signos de puntuación, erradicando futuras duplicidades.

## 2. Riesgos Operativos del TAC
- **Hallazgo**: Administradores de Ventas eliminaban opciones del catálogo (Ej. "Silla Tifanny") en vez de "Desactivarlas", rompiendo cotizaciones borrador.
- **Gobernanza**: Se inhabilitó el borrado físico (`DELETE`) en los catálogos principales. Se sustituyó por *Soft-Delete* (`is_active = false`).