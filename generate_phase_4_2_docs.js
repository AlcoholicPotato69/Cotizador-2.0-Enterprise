const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-4-frontend');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'FORM_ENGINE_ARCHITECTURE.md': `# FORM ENGINE ARCHITECTURE (Fase 4.2)\n\n## 1. Composición Estándar\nTodo formulario en la plataforma utilizará la dupla de validación \`Vuelidate\` o \`Zod\` con Vue Composition API. Los componentes base (\`DsInput\`, \`DsSelect\`) aceptan una prop \`error\` que dibuja el borde rojo (\`border-red-500\`) y renderiza un \`span\` con el mensaje de error debajo.\n\n## 2. Dynamic Autosave (Debounced)\nPara Wizards comerciales largos (ej. Cotizaciones), los inputs emitirán eventos debounced (\`500ms\`). El motor detectará \`isDirty\` y ejecutará parches HTTP (\`PATCH\`) silenciosos hacia PocketBase para mitigar pérdidas de información.\n\n## 3. Prevención de Doble Envío\nEl \`DsButton type="submit"\` intercepta el estado \`isLoading\` global del formulario, previniendo inyección duplicada de registros en el backend.`,
    
    'TABLE_ENGINE_ARCHITECTURE.md': `# TABLE ENGINE ARCHITECTURE (Fase 4.2)\n\n## 1. Renderizado y Server-Side Pagination\nPara prevenir colapsos en el navegador con grandes volúmenes de contratos, la \`DsTable\` delega la paginación a PocketBase (\`getList(page, perPage)\`). El componente \`DsPagination\` actualizará la URI (ej. \`?page=2\`) garantizando que los enlaces sean compartibles.\n\n## 2. Filtros Dinámicos (DsFilters)\nUn componente global en la parte superior inyectará \`Query Parameters\` en la URL, los cuales el *Router* interceptará para armar la cadena \`filter\` (\`status = 'approved'\`) requerida por PocketBase.\n\n## 3. Exportación\nLa exportación a CSV/Excel no será iterada en Frontend. \`DsTable\` incluirá una acción "Exportar" que detonará un *Worker* en el backend, o descargará la lista completa si el paginador indica < 500 registros.`,
    
    'STATUS_SYSTEM_ARCHITECTURE.md': `# STATUS SYSTEM ARCHITECTURE (Fase 4.2)\n\n## 1. Estandarización Semántica de Estados\nEl componente \`DsStatusBadge\` mapeará automáticamente valores de backend a colores estandarizados del Design System:\n\n### Contratos & Cotizaciones\n- \`draft\` (Borrador): \`surface-500\` (Gris).\n- \`pending\` (Pendiente Firma/Validación): \`amber-500\` (Naranja).\n- \`approved\` / \`signed\`: \`green-600\` (Verde).\n- \`rejected\` / \`cancelled\`: \`red-600\` (Rojo).\n\n### Financiero (Pagos y Facturas)\n- \`unpaid\`: \`red-600\` (Rojo).\n- \`partial\`: \`amber-500\` (Naranja).\n- \`paid\`: \`green-600\` (Verde).\n- \`validated\` (CFDI): \`blue-500\` (Azul).\n\nEsta arquitectura prohíbe que un módulo defina un "verde" diferente al que usa el resto del sistema, garantizando coherencia visual global.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Phase 4.2 Component Architecture documents generated successfully.');
