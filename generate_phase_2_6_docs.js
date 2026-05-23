const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge');
const phase2Dir = path.join(targetDir, 'phase-2-technology');

// 1. Scrub Stripe/OpenPay/Mercadopago
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(targetDir, function(filePath) {
    if (filePath.endsWith('.md')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        
        // Remove lines with invalid payment gateway concepts
        content = content.split('\n').filter(line => {
            const lower = line.toLowerCase();
            if (lower.includes('stripe')) return false;
            if (lower.includes('openpay')) return false;
            if (lower.includes('mercadopago')) return false;
            if (lower.includes('pasarela')) return false;
            if (lower.includes('tarjeta')) return false;
            return true;
        }).join('\n');
        
        if (original !== content) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Purgado de pasarelas: ${path.basename(filePath)}`);
        }
    }
});

if (!fs.existsSync(phase2Dir)) {
    fs.mkdirSync(phase2Dir, { recursive: true });
}

const docs = {
    'BANK_REFERENCE_MANAGEMENT_ARCHITECTURE.md': `# BANK REFERENCE MANAGEMENT ARCHITECTURE (Fase 2.6)\n\n## 1. Asignación Manual Bancaria\nLa referencia bancaria es el identificador financiero único (\`bank_reference\`). Es asignada manualmente al perfil del \`Client\` por el área de Finanzas desde el portal bancario.\n\n## 2. Inmutabilidad en Contratos (Snapshot)\nAl firmarse o aprobarse un Contrato, la \`bank_reference\` actual del cliente se copia dentro del \`financial_snapshot\`. \n- **Congelamiento**: Si en el futuro Finanzas actualiza la referencia bancaria del cliente en el catálogo principal, el contrato histórico conservará intacta la referencia con la que fue expedido. Las instrucciones de pago en el PDF generado seguirán apuntando a la referencia histórica.`,
    
    'PAYMENT_EVIDENCE_WORKFLOW.md': `# PAYMENT EVIDENCE WORKFLOW (Fase 2.6)\n\n## 1. Naturaleza de la Evidencia\nEl cobro no es automático. Requiere la acción humana de subir un comprobante físico (PDF, JPG, PNG del SPEI).\n\n## 2. Carga y Trazabilidad\nLos comprobantes se almacenan en la colección \`payment_evidences\` (vinculados al \`contract_id\` y \`client_id\`).\nAl inyectarse en Base de Datos y S3, el sistema genera metadatos obligatorios:\n- \`uploaded_by\` (ID del usuario operativo o cliente)\n- \`uploaded_at\` (Timestamp inmutable)\n- \`document_hash\` (SHA-256 para prevenir manipulación del JPG/PDF posterior a la carga).`,
    
    'FINANCIAL_VALIDATION_WORKFLOW.md': `# FINANCIAL VALIDATION WORKFLOW (Fase 2.6)\n\n## 1. Flujo de Aprobación Zero-Trust\n1. **Carga**: Cliente/Comercial sube la Evidencia.\n2. **Cola de Revisión**: El documento ingresa al Dashboard de Finanzas bajo estado \`pending_validation\`.\n3. **Conciliación Humana**: Finanzas visualiza la evidencia en el TAC y la coteja visualmente contra su estado de cuenta bancario externo.\n4. **Decisión**: \n   - **Rechazo**: Se marca como \`rejected\`, requiriendo que Comercial contacte al cliente. El Ledger no se toca.\n   - **Aprobación**: Finanzas marca la evidencia como \`approved\`.`,
    
    'BANK_LEDGER_INTEGRATION.md': `# BANK LEDGER INTEGRATION (Fase 2.6)\n\n## 1. Disparo Transaccional (Ledger)\nAl momento exacto en que Finanzas dictamina \`approved\` sobre una evidencia de pago, el \`pb_hooks\` transaccional se dispara:\n1. Genera un \`receipt\` (Recibo) con su propio \`receipt_snapshot\` inmutable.\n2. Inyecta una fila de tipo \`payment_received\` en la colección \`financial_ledger\`, abonando el monto verificado a la deuda del Contrato.\n3. El *Financial Health Engine* recalcula la salud del contrato (ej. pasando de *Warning* a *Healthy*).`,
    
    'BANK_RECONCILIATION_PROCESS.md': `# BANK RECONCILIATION PROCESS (Fase 2.6)\n\n## 1. El Triángulo de Conciliación\nLa conciliación en Cotizador 2.0 se logra garantizando que tres vértices empaten:\n- **Monto Base**: Extraído del \`financial_snapshot\` del contrato.\n- **Referencia**: Atrapada en el snapshot e impresa en las instrucciones de pago del PDF.\n- **Abono**: El monto real capturado por Finanzas (tras ver su banco) e inyectado al \`financial_ledger\`.\n\nAl no depender de APIs bancarias externas, la responsabilidad del ingreso de dinero recae en el usuario de Finanzas, mientras que la responsabilidad de la cuadratura matemática y el bloqueo del cierre de contrato recae en PocketBase.`,
    
    'ERP_INTEGRATION_READINESS.md': `# ERP INTEGRATION READINESS (Fase 2.6 / Preparación Fase 3)\n\n## 1. Intelisis (ERP Externo)\n- **Estado Actual**: Mock/Discovery.\n- **Objetivo Futuro**: Cuando exista documentación técnica oficial (WSDL/REST endpoints) provista por el proveedor de Intelisis, se construirá un \`IntelisisProvider\`.\n- **Mecanismo Diseñado**: Este proveedor interceptará el evento \`invoice_approved\` y enviará el XML/JSON al ERP de manera asíncrona. \n\n## 2. Facturama (PAC Externo)\n- **Estado Actual**: Mock/Discovery.\n- **Objetivo Futuro**: Timbrado automático mediante API.\n- **Mecanismo Diseñado**: El \`FacturamaProvider\` construirá el payload UUID/Conceptos extrayendo la información matemáticamente congelada en el \`financial_snapshot\`, garantizando que la factura emitida concuerde al centavo con el contrato.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(phase2Dir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Fase 2.6 Financial Operations Discovery generated successfully.');
