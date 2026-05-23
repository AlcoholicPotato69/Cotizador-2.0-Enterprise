# Flujos de Negocio - Cotizador 2.0 Enterprise

Este documento detalla los flujos de operación core del sistema, sirviendo como mapa funcional para entender *cómo operan las reglas de negocio* detrás de la arquitectura de software.

## 1. Flujo de Clientes y Validación Documental

**Objetivo**: Garantizar que todo cliente al que se le genere una cotización sea verificado y legítimo.

1. **Alta**: El agente de ventas registra al cliente. El estado inicial es `Pendiente`.
2. **Carga Documental**: El agente sube los documentos (INE, Constancia Fiscal, Acta Constitutiva). Éstos se alojan en la tabla polimórfica `documentos` asociados al cliente.
3. **Validación**: Un usuario con el rol de `Verificador` revisa el expediente en un Dashboard central.
4. **Dictamen**: El Verificador emite un "Dictamen" aprobando o rechazando el perfil. Si se rechaza, ventas debe corregir los documentos. Si se aprueba, el cliente pasa a `Aprobado` y se desbloquea la generación de Contratos.

## 2. Flujo de Cotizaciones (Sales Pipeline)

**Objetivo**: Presupuestar renta de espacios y conceptos asegurando integridad de precios a lo largo del tiempo.

1. **Creación (Wizard)**: 
   - Se selecciona un Espacio.
   - Se seleccionan Fechas (el sistema cruza con el calendario para evitar Overbooking).
   - Se añaden conceptos adicionales del Catálogo.
2. **Snapshot de Precios**: Crítico. Al momento de guardar, los precios del espacio y catálogo se copian estáticamente en la cotización. Modificar el catálogo general mañana no afectará esta cotización histórica.
3. **Aprobación**: La cotización transita a estado `Aprobada`. Esto congela el documento y prohíbe cualquier edición por parte de ventas sin autorizaciones superiores.
4. **Generación PDF**: Se procesa el desglose y se emite la "Cotización Formal PDF" integrando el membrete del Tenant activo.

## 3. Flujo de Contratos

**Objetivo**: Formalizar la venta en un documento legal sin intervención de Word/Excel.

1. **Nacimiento**: Se genera únicamente a partir de una Cotización `Aprobada`.
2. **Plantilla**: El motor selecciona la plantilla predeterminada (Ej: "Contrato Arrendamiento Plaza Mayor v2").
3. **Inyección**: El Template Engine busca las variables (ej. `{{CLIENTE_RFC}}`) y las sustituye por los datos reales de las relaciones en base de datos.
4. **Validación de Firma**: El sistema administra estados: `Generado` -> `Enviado` -> `Firmado`.

## 4. Flujo de Facturación y Recibos

1. **Recibos (Control de Pagos)**: El área de cajas registra pagos parciales ligados a una Cotización/Contrato. El sistema genera el "Recibo" PDF al instante.
2. **Facturas**: Se adjunta el XML y PDF de facturación real (que puede provenir de un sistema contable externo). El Cotizador actúa como repositorio final (Expediente) donde el cliente o auditor puede encontrar toda la traza financiera.

## 5. Agenda (Calendario)

1. **Visualización**: Se cruzan todas las cotizaciones `Aprobadas` y `Finalizadas`.
2. **Métricas**: Vista temporal de espacios ocupados, permitiendo filtrar por Tenant y Tipo de Espacio (Auditorio, Salón, Publicidad).
