const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-3-technology');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'MANUAL_CFDI_WORKFLOW.md': `# MANUAL CFDI WORKFLOW (Fase 3.0)\n\n## 1. Naturaleza del Proceso\nSe bloquea indefinidamente el timbrado automático. La facturación es externa, pero su registro y validación es **interno y obligatorio** para cerrar un expediente.\n\n## 2. Flujo Lineal Inquebrantable\n1. El contrato es cobrado en su totalidad (\`financial_status = paid\`). Solo entonces se habilita el módulo de facturación.\n2. El comercial o financiero genera la factura en el portal externo (SAT/Intelisis/Facturama).\n3. Sube el **XML y PDF** al *Tenant Administration Center*.\n4. El sistema lee el XML, ejecuta validaciones matemáticas y fiscales, y lo pasa a revisión.\n5. Finanzas otorga el *Aprobado Final*.\n6. Se genera el \`invoice_snapshot\`.\n7. El Contrato puede pasar a \`closed\`.`,
    
    'CFDI_VALIDATION_ENGINE.md': `# CFDI VALIDATION ENGINE (Fase 3.0)\n\n## 1. El Motor Interceptor (XML Parser)\nAl intentar subir un XML, el sistema lo parsea antes de guardarlo en Base de Datos y ejecuta 4 candados inflexibles:\n\n- **CANDADO RFC**: Extrae el \`Receptor.Rfc\` del XML. Si no es matemáticamente idéntico al \`rfc\` almacenado en el \`client_snapshot\`, la subida es **Rechazada**. Error: *RFC Mismatch*.\n- **CANDADO MONTO**: Extrae \`SubTotal\`, \`TotalImpuestosTrasladados\` y \`Total\`. Si la suma no empata al centavo con el \`financial_snapshot\` o los abonos validados, la subida es **Rechazada**. Error: *Financial Mismatch*.\n- **CANDADO RAZÓN SOCIAL**: Coteja el \`Receptor.Nombre\` aplicando un *Fuzzy Match* controlado para obviar signos como "S.A." vs "SA".\n- **CANDADO UUID**: Extrae el \`TimbreFiscalDigital.UUID\`. Si ya existe en la colección de facturas, la subida es **Rechazada**. Error: *Duplicated UUID*.\n\nEl XML es la única fuente de verdad; el PDF es tratado como una imagen inerte.`,
    
    'INVOICE_APPROVAL_WORKFLOW.md': `# INVOICE APPROVAL WORKFLOW (Fase 3.0)\n\n## 1. Transiciones de Estado\nLa colección \`invoices\` utiliza los siguientes estados rígidos:\n- \`pending_upload\`: Esperando archivos (estado inicial).\n- \`uploaded\`: Archivos cargados. (Duración en milisegundos).\n- \`validated\`: El *CFDI Validation Engine* dio luz verde matemática.\n- \`approved\`: Un humano en Finanzas visualizó el PDF, revisó el UUID validado y otorgó el Vo.Bo.\n- \`rejected\`: XML inválido o PDF ilegible.\n- \`cancelled\`: Refleja una nota de crédito o cancelación oficial en el SAT.\n\n## 2. Cierre Zero-Trust\nEl ecosistema *PocketBase Hooks* tiene una regla inquebrantable: \nUn \`contract\` no puede actualizar su status a \`closed\` si \`invoicing_status\` no equivale a \`approved\`.`,
    
    'CFDI_ACCEPTANCE_REPORT.md': `# CFDI ACCEPTANCE REPORT (Fase 3.0)\n\n## Dictamen Operativo\nEl rediseño del módulo fiscal bajo una perspectiva 100% manual, guiada y validada logra erradicar el riesgo de deuda técnica y dependencias rotas.\n\n1. **Garantía Fiscal**: Un ejecutivo no puede "equivocarse" subiendo una factura de $10,000 para un contrato de $15,000. El *CFDI Validation Engine* repelerá el XML antes de tocar disco.\n2. **Preparación Futura**: Cuando la integración ERP sea viabilizada, el flujo permanecerá idéntico. En vez de que un humano suba el XML, el API de Intelisis lo inyectará directamente al *Validation Engine*. Todo el ecosistema de aprobación y cierre de contrato sigue intacto.\n\n**Se da por concluida la Fase 3.0 con Nivel A.**`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Fase 3.0 Manual CFDI Operations reports generated successfully.');
