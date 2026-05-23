const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-3-technology');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'INVOICE_DUAL_APPROVAL_POLICY.md': `# INVOICE DUAL APPROVAL POLICY (Four-Eyes Principle)\n\n## 1. Regla de Aprobación Dual\nPara mitigar riesgos de colusión interna o errores en montos elevados, se implementa el principio de "Cuatro Ojos" condicionado:\n- Si el \`Total\` del CFDI es **<= $100,000 MXN**: Requiere 1 aprobación (Usuario A con permiso \`invoice.approve\`).\n- Si el \`Total\` del CFDI es **> $100,000 MXN**: Requiere 2 aprobaciones secuenciales. (Usuario A pre-aprueba, Usuario B aprueba finalmente). \n\nEl Hook de PB interceptará cualquier intento de que el Usuario A aplique la segunda firma, exigiendo un \`user_id\` diferente.`,
    
    'CFDI_PERMISSION_MATRIX.md': `# CFDI PERMISSION MATRIX\n\n## Granularidad RBAC Fiscal\n\nLa matriz de seguridad se extiende con las siguientes llaves:\n- \`invoice.view\`: Permite ver la lista de facturas (Asignado a Comercial, Operaciones, Finanzas).\n- \`invoice.upload\`: Permite subir XML y PDF (Asignado a Comercial y Finanzas).\n- \`invoice.approve\`: Permite emitir el Vo.Bo. final (Asignado **exclusivamente** a Finanzas y Gerencia).\n- \`invoice.reject\`: Permite rechazar y bloquear un CFDI mal emitido (Asignado a Finanzas).\n- \`invoice.delete\`: **Restringido Globalmente**. Un CFDI validado no se borra, se cancela lógicamente con una evidencia de sustitución SAT.`,
    
    'CFDI_FLS_ARCHITECTURE.md': `# CFDI FLS ARCHITECTURE\n\n## Field Level Security (Nivel Fiscal)\n\nLa colección \`invoices\` aplica restricciones a nivel de campo (FLS):\n- **UUID, XML Raw, SubTotal, IVA, Total**: Solo-Lectura (*Read-Only*) para todos tras su inserción. El Motor de Validación es el único autorizado a poblar estos campos durante el Parseo. Ningún humano puede editar el monto.\n- **PDF URL**: Accesible solo para usuarios con \`invoice.view\`.\n- **Status**: Editable únicamente por usuarios con \`invoice.approve\` o \`invoice.reject\`. Comerciales solo tienen acceso de lectura a este campo.`,
    
    'DOCUMENT_VIEWER_SECURITY.md': `# DOCUMENT VIEWER SECURITY\n\n## 1. Hardening del Frontend PDF Viewer\nPara prevenir extracción y fuga de documentos sensibles (\`invoice.view\`):\n- **Prevención de Descarga Físca**: La URL generada hacia el S3 Bucket es temporal (Presigned URL expirando en 5 minutos).\n- **Marcas de Agua Dinámicas**: El visor \`PDF.js\` inyecta un *Overlay* de texto renderizado en Canvas superpuesto al PDF. La marca de agua cruzará la pantalla con el texto: \`CONFIDENTIAL - VIEWED BY [user_email] - [timestamp] - [ip_address]\`.\n- Si un usuario le toma una fotografía a la pantalla, la marca de agua servirá como huella forense infalible.`,
    
    'CFDI_AUDIT_TRAIL.md': `# CFDI AUDIT TRAIL\n\n## Trazabilidad de Ciclo de Vida\n\nTodo registro de la colección \`invoices\` emitirá logs inmutables hacia \`document_audit_log\`:\n- **[UPLOADED]**: Hash SHA-256 del XML y del PDF, ID del usuario que lo subió y Timestamp.\n- **[VIEWED]**: Cada vez que el visor nativo pide la *Presigned URL*, se registra la IP del espectador.\n- **[DOWNLOADED]**: Si el usuario tiene el privilegio \`invoice.download\` y lo ejerce, se audita la salida física.\n- **[APPROVED] / [REJECTED]**: Firma digital de la decisión con comentario adjunto.\n\nCero repudio: No hay interacción fiscal que quede fuera de la cadena de bloques interna.`,
    
    'TENANT_FISCAL_VALIDATION.md': `# TENANT FISCAL VALIDATION\n\n## 1. El Candado de Identidad del Emisor\nEl *CFDI Validation Engine* incorpora una validación de aislamiento Multi-Tenant crítica para corporativos.\n\nDurante el Parseo del XML:\nSe extrae el campo \`Emisor.Rfc\` del XML subido.\n\nEse valor es comparado estrictamente contra el \`tenant.tax_profile.rfc\` almacenado en la Base de Datos.\n\n### Resultado de la Validación:\nSi un ejecutivo intenta subir una factura emitida por **Plaza Mayor** a un Contrato perteneciente al entorno de **Casa de Piedra**, el sistema generará un rechazo automático de Nivel Arquitectónico (HTTP 403: *Tenant Fiscal Mismatch*).\n\nEs matemáticamente imposible cruzar contabilidades entre inquilinos.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Final CFDI Hardening reports generated successfully.');
