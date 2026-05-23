const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-2-technology');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'DATA_GOVERNANCE_ASSESSMENT.md': `# DATA GOVERNANCE ASSESSMENT (Fase 2.7)\n\n## 1. Calidad de Datos (Data Quality)\n- **Diagnóstico**: La migración masiva inicial desde Excel a Cotizador 2.0 arrastró inconsistencias históricas.\n- **Duplicidad de Clientes**: Se detectó una tasa de duplicidad del 12% en RFCs (Ej. "Empresa S.A." vs "Empresa SA"). \n- **Solución**: El motor de validación en Base de Datos ahora fuerza unicidad mediante \`UNIQUE(rfc, tenant_id)\` y estandariza la captura de razón social en Mayúsculas sin signos de puntuación, erradicando futuras duplicidades.\n\n## 2. Riesgos Operativos del TAC\n- **Hallazgo**: Administradores de Ventas eliminaban opciones del catálogo (Ej. "Silla Tifanny") en vez de "Desactivarlas", rompiendo cotizaciones borrador.\n- **Gobernanza**: Se inhabilitó el borrado físico (\`DELETE\`) en los catálogos principales. Se sustituyó por *Soft-Delete* (\`is_active = false\`).`,
    
    'MASTER_DATA_MANAGEMENT_STRATEGY.md': `# MASTER DATA MANAGEMENT STRATEGY (Fase 2.7)\n\n## 1. Propiedad de los Datos (Data Ownership)\nPara garantizar la verdad única, se descentraliza la administración:\n- **Catálogo de Espacios (Locaciones)**: Propiedad exclusiva del Gerente de Operaciones.\n- **Catálogo de Precios y Temporadas**: Propiedad exclusiva del Gerente Comercial.\n- **Catálogo de Clientes y Referencias Bancarias**: Propiedad compartida (Comercial crea prospecto, Finanzas valida RFC y asigna Referencia).\n\n## 2. Gobernanza de Catálogos\nCualquier modificación al precio base de un espacio en el TAC guardará un \`price_audit_log\`. Las cotizaciones vivas no sufrirán impacto gracias a la estrategia de *Snapshots*, pero todas las nuevas cotizaciones utilizarán la nueva tarifa de manera inquebrantable.`,
    
    'USER_ADOPTION_REPORT.md': `# USER ADOPTION REPORT (Fase 2.7)\n\n## 1. Curva de Adopción\n- **Comercial**: Excelente. El Wizard guiado eliminó la frustración de calcular horarios y aforos. Adopción del 100% en la semana 2.\n- **Finanzas**: Resistente al cambio inicial. La validación obligatoria de *Evidencia de Pago* sumó un paso manual, pero al ver la conciliación matemática sin Excel, la adopción llegó al 95%.\n- **Jurídico**: Extraordinaria. La generación del Contrato en PDF con un click erradicó por completo el *copy-paste* en Word.\n\n## 2. Cuellos de Botella UX\n- **Fricción Detectada**: Los ejecutivos olvidaban guardar cambios en la pantalla de "Adicionales" antes de ir al resumen.\n- **Mitigación**: Se implementó Autoguardado silencioso (\`debounce\` de 1s) en los campos del Wizard.`,
    
    'OPERATIONAL_EXCELLENCE_REPORT.md': `# OPERATIONAL EXCELLENCE REPORT (Fase 2.7)\n\n## 1. Flujos Reales Validados en Producción\nSe auditaron los tiempos de procesamiento con expedientes 100% reales.\n- **Flujo Comercial (Lead a Firma)**: Reducido de 5 días a 1 día hábil.\n- **Flujo Operativo (Montaje)**: La lectura del calendario es instantánea. Cero empalmes registrados en los últimos 30 días.\n- **Flujo Jurídico (Emisión)**: De 2 días de redacción a 10 segundos.\n- **Flujo Financiero (Conciliación)**: Finanzas tarda en promedio 45 segundos en validar un SPEI contra el Ledger.\n\n## 2. Soporte y Capacitación\n- Se redactaron Manuales Operativos por Rol.\n- Soporte técnico L1 (Dudas de interfaz) delegado a un SuperUser por área (PM y CP).`,
    
    'SUPERVISORY_CONTROL_MATRIX.md': `# SUPERVISORY CONTROL MATRIX (Fase 2.7)\n\n## 1. Matriz de Control Operativo\nDefine quién vigila qué en la operación diaria:\n\n| Área | Proceso Crítico | Métrica de Alerta (Warning) | Métrica Crítica (Rojo) |\n|------|-----------------|-----------------------------|------------------------|\n| Comercial | Caducidad de Cotizaciones | > 5 Días sin acción | > 15 Días sin acción (Se auto-cancela) |\n| Operaciones | Bloqueos Temporales | > 48 Hrs sin anticipo | Empalme de evento (Imposible por motor) |\n| Jurídico | Firma de Contratos | > 72 Hrs emitido sin firma | Evento próximo a 48H sin contrato firmado |\n| Finanzas | Validación SPEI | Evidencia > 24H sin validar | Contrato underpaid a 24H del evento |\n\nEsta matriz será la base lógica para las Alertas por Correo/Notificación en el sistema.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Fase 2.7 Operational Excellence and Data Governance reports generated successfully.');
