# 01 - Business Overview

## 1. Propósito del Sistema
El Cotizador 2.0 Enterprise automatiza y audita la cadena de valor comercial para la renta de espacios (Plaza Mayor y Casa de Piedra). Reemplaza cotizaciones manuales en Excel o Word por un motor unificado que garantiza:
- **Integridad de Precios**: Los comerciales no pueden alterar precios arbitrariamente.
- **Integridad Documental**: El cliente debe ser auditado antes de generar contratos legales.
- **Disponibilidad Real**: Prevención automatizada de dobles reservas.

## 2. Actores (Roles de Negocio)
- **Agente de Ventas**: Captura leads, arma cotizaciones, interactúa con el cliente.
- **Verificador / Compliance**: Revisa actas constitutivas, identificaciones y da "luz verde" al cliente (Dictamen).
- **Gerencia Comercial**: Aprueba descuentos especiales o autoriza cotizaciones con precios modificados.
- **Administración / Cobranza**: Registra recibos, facturas XML y libera el espacio.

## 3. Procesos Principales (El Golden Path)

1. **Onboarding de Cliente**:
   - Registro de RFC, Razón Social.
   - Carga de Expediente (Documentos).
   - *Riesgo*: Sin aprobación del Verificador, el pipeline se congela.

2. **Cotización de Espacios**:
   - Agente selecciona un Salón o Mupi.
   - Selecciona fechas.
   - Agrega "Conceptos del Catálogo" (Sillas, Limpieza, Luz).
   - Aplica "Premontajes" u "Horas extra" (si aplica).
   - Se guarda el `desglose_precios` en formato JSON para que sobreviva aunque cambie el catálogo mañana.

3. **Firma y Contratación**:
   - Se selecciona una Plantilla de Contrato.
   - Se inyectan las variables (`{{CLIENTE_RFC}}`, `{{PRECIO_FINAL}}`).
   - El sistema genera el PDF oficial bloqueado.

4. **Ejecución y Cierre**:
   - El cliente abona el monto.
   - Se timbra la Factura XML.
   - El evento/campaña ocurre.
   - La cotización se marca como `Finalizada`.

## 4. Oportunidades de Mejora respecto al Legacy
- Eliminar la lógica de `if (tenant === 'plaza_mayor')` dispersa en el frontend mediante un diseño basado en configuración por base de datos (Motor Genérico).
- Desacoplar la generación de PDF del navegador del usuario (html2pdf) o construir un Template Engine en Vue que sea predecible y consistente entre navegadores.
