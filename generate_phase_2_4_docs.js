const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-2-technology');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'BUSINESS_MODEL_CORRECTION.md': `# BUSINESS MODEL CORRECTION (Fase 2.4 Pre-requisito)\n\nSe ha purgado la suposición de simetría de negocio entre Tenants. El sistema asimila que:\n\n1. **Plaza Mayor (PM)**: Operación 100% publicitaria y comercial. No existen bodas, ni salones corporativos, ni premontajes. Todo cálculo, UI, y métrica relacionada a eventos sociales queda bloqueado para PM.\n2. **Casa de Piedra (CP)**: Operación de eventos sociales, corporativos, bodas, y publicidad. Aplican reglas de premontaje, horas extra y descorches.`,
    
    'OBSERVABILITY_IMPLEMENTATION_REPORT.md': `# OBSERVABILITY IMPLEMENTATION REPORT (Fase 2.4)\n\n## Arquitectura Tenant-Aware Dashboards\n\nEl módulo de Observabilidad se ha reescrito para consultar \`pb_data\` filtrando rígidamente por \`tenant_id\` y \`business_model\`.\n\n### 1. Plaza Mayor (Tenant Dashboard)\nSe restringe exclusivamente a:\n- Cotizaciones y Contratos Publicitarios generados.\n- Tasa de conversión de Activaciones de Marca.\n- Disponibilidad futura y ocupación actual de espacios Físicos/Digitales.\n- Ingresos segmentados (Física vs Digital vs Activaciones).\n- Vencimientos de contratos y facturación pendiente.\n*(Cero rastro de eventos sociales).* \n\n### 2. Casa de Piedra (Tenant Dashboard)\nDashboard operativo híbrido:\n- Eventos cotizados y confirmados (Bodas, Corporativos).\n- Anticipos pendientes.\n- Calendario de Premontajes / Desmontajes.\n- Ingresos por Horas Extra, Descorche, y Proveedores Externos.\n- Conflictos de disponibilidad en Salones.\n- Publicidad física y digital activa.\n\n### 3. Global TAC (System Dashboard)\nVista consolidada exclusiva para el SuperAdmin Multi-Tenant:\n- Comparativa de Ingresos y Contratos generados (PM vs CP).\n- Métricas de Seguridad: Intentos de Logins fallidos, Tenant Escape Attempts (Auditoría Zero Trust).\n- Salud Financiera y Documental (Errores de generación de PDF, fallos en WORM storage).\n- Estado de Backups a S3.\n\n## Dictamen de Telemetría\nLa observabilidad ahora refleja la realidad comercial asimétrica del negocio. El componente sube a **Nivel A**.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Fase 2.4 Observability reports with strict business corrections generated successfully.');
