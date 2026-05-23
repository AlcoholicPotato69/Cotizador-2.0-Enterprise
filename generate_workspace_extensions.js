const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-4-frontend');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'DOCUMENT_ACTIONS_ARCHITECTURE.md': `# DOCUMENT ACTIONS ARCHITECTURE (Fase 4.2)\n\n## 1. Topbar Documental Estándar\nEl \`DsDocumentViewer\` expondrá una barra superior de herramientas (Toolbar) que renderizará dinámicamente las siguientes acciones, siempre y cuando el \`permissionsStore\` lo autorice:\n- **Download**: Descarga del binario físico (\`document.download\`).\n- **Print**: Impresión enmascarada del Canvas (\`document.print\`).\n- **Open External**: Apertura en nueva pestaña mediante Presigned URL temporal (\`document.view_external\`).\n- **Copy UUID / Copy Hash**: Acciones de auditoría rápida al portapapeles (\`document.audit\`).\n\n## 2. Segregación de Vistas\nLas vistas profundas operan como "Tabs" o "Drawers" hijos dentro del Workspace:\n- **View Audit Trail**: Despliega la línea de tiempo de visualizaciones y aprobaciones.\n- **View Metadata**: Despliega el Tenant, Cliente y Hashes criptográficos.\n- **View Snapshot**: Permite ver el JSON congelado que originó este documento.`,
    
    'DOCUMENT_COMPARISON_ARCHITECTURE.md': `# DOCUMENT COMPARISON ARCHITECTURE (Fase 4.2)\n\n## 1. Diseño Extensible (Side-by-Side)\nPara preparar el sistema para futuras revisiones contractuales, el lienzo central del \`DsDocumentViewer\` se diseña como un \`Flexbox Container\` dinámico.\n- Al activar el modo "Comparación", el lienzo se divide al 50/50.\n- Permite incrustar **Documento A vs Documento B** (ej. Cotización V1 vs Cotización V2).\n- Permite incrustar **Documento vs Snapshot** (ej. PDF Renderizado vs JSON Crudo de la Base de Datos).\n- El *Panel de Auditoría Lateral* se contrae automáticamente o flota sobre la interfaz para no robar espacio al contraste documental.`,
    
    'DOCUMENT_PROVIDER_ARCHITECTURE.md': `# DOCUMENT PROVIDER ARCHITECTURE (Fase 4.2)\n\n## 1. Capa de Abstracción MIME Type\nEl \`DsDocumentViewer\` no renderizará PDFs directamente; delegará la tarea a una interfaz \`DocumentProvider\`.\n- Si \`mimeType === 'application/pdf'\`, invoca al **PDFProvider** (basado en \`PDF.js\` Canvas Render).\n- Si \`mimeType === 'text/xml' || mimeType === 'application/xml'\`, invoca al **XMLProvider** (Inyecta un árbol DOM con Syntax Highlighting).\n- Si \`mimeType === 'image/jpeg' || mimeType === 'image/png'\`, invoca al **ImageProvider** (Lienzo interactivo con zoom/pan).\n\nEsta inyección de dependencias permite agregar futuros \`VideoProviders\` o \`WordProviders\` sin tocar el cascarón de seguridad y auditoría del \`DsDocumentViewer\`.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Document Workspace Extensions generated successfully.');
