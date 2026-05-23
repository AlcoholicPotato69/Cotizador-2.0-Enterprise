# POST GO-LIVE STABILITY REPORT (Fase 2.5)

## 1. Proyecciones Base (Tenant-Aware Forecasting)
Las estimaciones asumen una alta transaccionalidad exclusiva para los modelos reales de negocio de cada Tenant.

### Plaza Mayor (PM)
- **Modelo Base**: Campañas publicitarias, activaciones de marca, renta de espacios físicos y digitales.
- **Transacciones Anuales**: ~1,500 Contratos Publicitarios.

### Casa de Piedra (CP)
- **Modelo Base**: Bodas, XV Años, Eventos Sociales, Premontajes y Horas Extra.
- **Transacciones Anuales**: ~800 Contratos Sociales.

## 2. Proyección de Crecimiento Documental y Base de Datos (1, 3, 5 y 10 Años)

### A. Crecimiento de Snapshots (JSON en SQLite)
El `financial_snapshot` y `template_snapshot` pesan en promedio 45KB por contrato.
- **Año 1**: 2,300 contratos = ~103 MB.
- **Año 3**: 6,900 contratos = ~310 MB.
- **Año 5**: 11,500 contratos = ~517 MB.
- **Año 10**: 23,000 contratos = ~1.03 GB.
*Conclusión*: PocketBase (SQLite en modo WAL) maneja cómodamente bases de hasta 100GB. El rendimiento de las lecturas no se degradará en los próximos 10 años.

### B. Crecimiento Documental (PDFs en AWS S3)
Cada contrato firmado (Tipo A) y recibo/conciliación (Tipo B) generan archivos físicos pesados (promedio 2MB).
- **Año 1**: 6,900 PDFs (Asumiendo 3 PDFs por contrato) = ~13.8 GB.
- **Año 3**: 20,700 PDFs = ~41.4 GB.
- **Año 5**: 34,500 PDFs = ~69 GB.
- **Año 10**: 69,000 PDFs = ~138 GB.
*Estrategia Operativa*: Transición a WORM Storage y *S3 Glacier Deep Archive* a los 12 meses garantiza que la factura anual de AWS se mantenga por debajo de $5 USD mensuales a 10 años.

### C. Crecimiento de Logs de Auditoría (`document_audit_log`)
El registro estricto (Chain of Custody) de quién generó, vio, o descargó documentos.
- **Año 1**: ~50,000 registros (20 bytes c/u) = ~1 MB.
- **Año 10**: ~500,000 registros = ~10 MB.
*Estabilidad*: Impacto imperceptible.

## 3. Backups y Restauración
El archivo `pb_data` se comprimirá vía cronjob y se enviará a S3 diario. 
Tiempo estimado de restauración (DRP) en el Año 10 (con una base de 1.5GB): **< 2 minutos**. 

## 4. Dictamen Final
Cotizador 2.0 Enterprise es altamente sostenible a largo plazo sin requerir sharding de bases de datos o clústeres complejos de Kubernetes. La escalabilidad ha sido blindada para la siguiente década.