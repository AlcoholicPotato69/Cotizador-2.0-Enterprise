# Document Expiration Engine

## 1. Visión General
El **Document Expiration Engine** es el vigilante asíncrono del sistema. En un modelo multi-tenant empresarial, la validez de los expedientes de clientes (INE, Contratos Maestros, Constancias Fiscales) es perecedera. Este motor detecta vencimientos y actúa en consecuencia.

## 2. Objetivo Principal
Automatizar la degradación de la elegibilidad de un cliente al vencer sus requisitos, y disparar las notificaciones proactivas necesarias sin intervención humana.

## 3. Funciones del Motor

### A) Detección y Degradación
El motor evalúa periódicamente (via Cron Job en backend o trigger de evaluación diferida) los documentos aprobados en los expedientes de clientes.
- Si un documento posee `fecha_vencimiento` y se supera la fecha del sistema, su estado cambia automáticamente a `EXPIRED`.
- Esto desencadena un recálculo en el **Client Eligibility Engine**.

### B) Motor de Notificaciones Automáticas (Warning Window)
Desde el Tenant Administration Center, los administradores configuran ventanas de aviso:
- "Avisar 15 días antes de vencer Constancia Fiscal".
- "Avisar 30 días antes de vencer Contrato Anual".

Cuando la regla se cumple, el motor emite:
- Alertas en el Dashboard del agente comercial (`user`).
- Alertas al área de Cumplimiento/Legal (`verificador`).

## 4. Impacto Transversal (Reglas Críticas)
La degradación disparada por este motor tiene consecuencias operativas inmediatas:
1. **Cotizaciones**: Un cliente degradado a "Documentation Expired" será bloqueado por el Eligibility Engine, imposibilitando que su agente le genere nuevas cotizaciones.
2. **Contratos**: **REGLA CRÍTICA**. Un contrato NO puede generarse si el cliente perdió elegibilidad (Ej. su INE expiró hoy), INCLUSO si su Cotización había sido aprobada la semana pasada. El Document Expiration Engine funciona como un "Kill Switch" legal justo antes de la firma.

## 5. Excepciones
Un administrador con permisos `config.eligibility.override` puede autorizar una prórroga temporal en el sistema, lo que extenderá virtualmente la validez del documento en los motores lógicos y reactivará los flujos.
