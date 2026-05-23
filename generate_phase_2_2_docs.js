const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-2-technology');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'DOCUMENT_CLASSIFICATION_POLICY.md': `# DOCUMENT CLASSIFICATION POLICY (Fase 2.2)\n\n## Categorías Documentales\n\n- **Tipo A (Legales)**: Contratos, Convenios Modificatorios, Anexos Legales. \n  *Política*: Retención obligatoria por 10 años fiscales. Acceso restringido a Finanzas/Jurídico.\n- **Tipo B (Financieros)**: Facturas, CFDI, Recibos de Pago, Conciliaciones.\n  *Política*: Retención por 5 años fiscales. Acceso de auditoría.\n- **Tipo C (Operativos)**: Cotizaciones borrador, Simulaciones de disponibilidad, Órdenes de Montaje tempranas.\n  *Política*: Se depuran a los 6 meses de inactividad si el contrato no se firmó.`,
    
    'STORAGE_TIERING_STRATEGY.md': `# STORAGE TIERING STRATEGY (Fase 2.2)\n\n## Arquitectura de Niveles\n\n1. **Hot Storage (S3 Standard)**: Documentos de eventos futuros o recientes (< 30 días). Acceso en milisegundos para descarga rápida en el TAC.\n2. **Warm Storage (S3 Infrequent Access)**: Contratos de eventos pasados pero dentro del año en curso. Ahorro de costos del 40%, recuperación en milisegundos pero con fee de recuperación.\n3. **Archive Storage (S3 Glacier Deep Archive)**: Expedientes finalizados (> 1 año). Almacenamiento ultrabarato. Tiempos de recuperación de hasta 12 horas.`,
    
    'LEGAL_HOLD_IMPLEMENTATION.md': `# LEGAL HOLD IMPLEMENTATION (Fase 2.2)\n\n## 1. Definición del Motor\nSi una auditoría, litigio o requerimiento del SAT ocurre, un usuario con permisos \`legal.manage\` puede activar \`legal_hold = true\` sobre un \`contract_id\` en PocketBase.\n\n## 2. Bloqueos Arquitectónicos\nUna vez activo el Flag, los \`pb_hooks\` interceptan y bloquean con HTTP 403 (Legal Hold Active) cualquier intento de:\n- Ejecutar DELETE sobre los registros de Base de Datos.\n- Editar el \`financial_snapshot\`.\n- Depurar documentos (Pausa el pase a Glacier o la limpieza automatizada de Tipo C).\n- **Resultado**: El expediente se congela legalmente en Base de Datos y en el Bucket S3 hasta que la orden se revoque.`,
    
    'WORM_STORAGE_EVALUATION.md': `# WORM STORAGE EVALUATION (Fase 2.2)\n\n## Análisis de WORM (Write Once Read Many)\n\n- **Objetivo**: Garantizar que ni siquiera un administrador de sistemas con acceso a S3 pueda borrar un PDF Tipo A (Contrato cerrado).\n- **Implementación**: Se evaluó **AWS S3 Object Lock** en modo "Compliance". \n- **Resultado Técnico**: Viable. Al inyectar el binario generado por Playwright, se etiqueta con Object Lock de 10 años. Si alguien (incluyendo la cuenta Root de AWS) intenta borrar el \`.pdf\`, la API de Amazon S3 lo impedirá a nivel infraestructura. \n- **Dictamen**: Nivel A de seguridad documental alcanzado.`,
    
    'CHAIN_OF_CUSTODY_ARCHITECTURE.md': `# CHAIN OF CUSTODY ARCHITECTURE (Fase 2.2)\n\n## Trazabilidad Documental\n\nLa tabla \`document_audit_log\` registrará una bitácora inalterable por cada interacción física con el PDF:\n- \`GENERATED\`: Quién lo emitió y Hash SHA-256 inicial.\n- \`VIEWED\`: Cuándo un rol accedió a su previsualización.\n- \`DOWNLOADED\`: IP de origen, usuario y Timestamp de la descarga física del PDF.\n- \`ARCHIVED\`: Transición automatizada a Cold Storage.\n- \`RESTORED\`: Petición de recuperación desde Glacier con aprobación de admin.\n\nCualquier actividad sobre un documento se anexará a su Cadena de Custodia.`,
    
    'DOCUMENT_RETENTION_POLICY.md': `# DOCUMENT RETENTION POLICY (Fase 2.2)\n\nConsolidación de las directivas:\n1. Los borradores (Tipo C) se limpian por un CronJob en PocketBase a los 180 días.\n2. Los Documentos Financieros (Tipo B) se archivan a los 365 días y expiran a los 5 años.\n3. Los Documentos Legales (Tipo A) se envían a WORM Storage y tienen ciclo de vida de 10 años antes de destrucción criptográfica automatizada.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Fase 2.2 Document Storage and Legal Hold reports generated successfully.');
