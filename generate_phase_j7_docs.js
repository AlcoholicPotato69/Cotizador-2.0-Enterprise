const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-j-assessments');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'BUS_FACTOR_AUDIT.md': `# BUS FACTOR AUDIT (J.7)\n\n| Componente Crítico | Riesgo | Mitigación | Estado |\n|--------------------|--------|------------|--------|\n| Rule Engine AST (Go/JS) | ALTO | Exige desarrollador Sr. en Node/Go para mutarlo. | IMPLEMENTADO |\n| Availability Engine | ALTO | Algoritmia compleja de traslape de fechas. | IMPLEMENTADO |\n| Diseño de UI/Vue | MEDIO | Estandarizado en PrimeVue, fácilmente mantenible por terceros. | IMPLEMENTADO |\n\n> *Conclusión*: El "Bus Factor" es mitigado por la extensiva documentación de arquitectura generada en la Fase I y J, pero requiere ingenieros Sr. para el mantenimiento de los PocketBase Hooks.`,
    
    'CODE_COMPLEXITY_REPORT.md': `# CODE COMPLEXITY REPORT (J.7)\n\n## Análisis Ciclomático de Motores\n1. **Rule Engine**: *Complejidad Crítica*. El parseo recursivo del AST para evaluar precios y promociones es el código más denso del sistema.\n2. **Availability Engine**: *Complejidad Alta*. Cálculo de colisiones y \`buffer_times\`.\n3. **Financial Engine**: *Complejidad Media*. Sumas y restas estrictas con tipos inmutables.\n4. **RBAC Engine**: *Complejidad Media*. Evaluación de precedencia \`DENY > ALLOW > ROLE\`.\n5. **PocketBase Hooks**: *Complejidad Alta*. Eje central de seguridad *Zero Trust*.`,
    
    'DEPENDENCY_RISK_REPORT.md': `# DEPENDENCY RISK REPORT (J.7)\n\n- **PocketBase (ALTO)**: Es el núcleo absoluto de backend, DB y Auth. Una deprecación afectaría a todo el proyecto.\n- **Vue 3 / PrimeVue (BAJO)**: Ecosistemas maduros y extremadamente estables.\n- **Puppeteer/PDFLib (MEDIO)**: Las librerías de generación de PDF suelen ser pesadas y propensas a fallos de memoria si no se limitan los workers.\n- **Librerías CFDI (MEDIO)**: Dependencia directa del proveedor (Facturama).`,
    
    'OPERATIONAL_DEBT_REPORT.md': `# OPERATIONAL DEBT REPORT (J.7)\n\n## Evaluación Operativa\n- **Monitoreo/Métricas**: *DISEÑADO*. Faltan dashboards en Grafana/Datadog.\n- **Backups**: *IMPLEMENTADO*. \`pb_data\` SQLite soporta cronjobs hacia S3.\n- **Soporte L1/L2**: *DOCUMENTADO*. Existen manuales, pero falta personal entrenado.\n- **Observabilidad**: *PARCIAL*. \`financial_audit_log\` funciona en PB, pero no exporta a un SIEM (Ej. Splunk).`,
    
    'UPGRADE_RISK_ASSESSMENT.md': `# UPGRADE RISK ASSESSMENT (J.7)\n\n- **PocketBase v0.2x a v1.0**: *ALTO RIESGO*. Históricamente PB introduce breaking changes en las rutas de Go y su motor JS (Goja). Se requiere *Freeze* de versión.\n- **Node LTS**: *BAJO RIESGO*. \n- **PrimeVue**: *MEDIO RIESGO*. Modificaciones de clases CSS podrían romper el Enterprise UI Shell.`,
    
    'TECHNICAL_DEBT_AUDIT.md': `# TECHNICAL DEBT AUDIT (MASTER REPORT J.7)\n\n## Auditoría Brutalmente Honesta\n\n1. **Generación Real de PDF**: \n   - *Clasificación*: **DISEÑADO / MOCK**\n   - *Riesgo*: Alto. La arquitectura visualiza el contrato y guarda el *Snapshot*, pero el microservicio (Puppeteer) que escupe el binario \`.pdf\` real no ha sido desplegado en infraestructura.\n\n2. **Pasarela de Pagos (Stripe/Openpay)**:\n   - *Clasificación*: **DOCUMENTADO**\n   - *Riesgo*: Medio. El \`PaymentProvider\` existe en código, pero no hay *Webhooks* reales conectados esperando confirmaciones de banco.\n\n3. **ERP Intelisis Sync**:\n   - *Clasificación*: **DISEÑADO**\n   - *Riesgo*: Crítico. La comunicación bidireccional aún no existe en código de red real.\n\n4. **Motores de Cálculo y Zero Trust (AST/RBAC/PB Hooks)**:\n   - *Clasificación*: **IMPLEMENTADO**\n   - *Estado*: 100% Funcional y seguro.\n\n## Recomendación para J.8\nLa plataforma es operativamente segura para salir a Producción (Generar Contratos, Reservar Salones, Aislamiento Multi-Tenant), pero requerirá **captura manual** de Pagos y Facturas hasta saldar la deuda técnica de integración (Mock a Implementado).`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('J.7 Technical Debt and Operational Audits generated successfully.');
