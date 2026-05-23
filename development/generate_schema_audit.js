const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('schema_dump.json', 'utf8'));
    
    // Lista de colecciones esperadas según la arquitectura
    const expectedCollections = [
        "users",
        "roles",
        "tenants",
        "clientes",
        "espacios",
        "cotizaciones",
        "contratos",
        "documentos",
        "rule_registry",
        "security_audit_log",
        "reservations",
        "snapshots",
        "rbac_user_roles",
        "rbac_role_permissions",
        "rbac_permissions",
        "rbac_user_direct_perm"
    ];

    const actualCollections = data.map(c => c.name);
    
    let md = `# DATABASE SCHEMA AUDIT\n\n`;
    md += `**Generado:** ${new Date().toISOString()}\n\n`;
    md += `## Resumen de Colecciones (Físicas vs Esperadas)\n\n`;
    
    md += `| Colección | Estado Físico | Campos | Índices | Reglas (API) | Clasificación |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    
    for (const expected of expectedCollections) {
        const found = data.find(c => c.name === expected);
        if (found) {
            const fieldsCount = found.fields.length;
            const indexesCount = found.indexes ? found.indexes.length : 0;
            const rulesCount = [found.listRule, found.viewRule, found.createRule, found.updateRule, found.deleteRule].filter(r => r != null).length;
            
            md += `| **${expected}** | ✅ Encontrada | ${fieldsCount} | ${indexesCount} | ${rulesCount}/5 | **A** |\n`;
        } else {
            md += `| **${expected}** | ❌ Faltante | 0 | 0 | 0/5 | **D** |\n`;
        }
    }
    
    md += `\n## Detalles por Colección\n\n`;
    
    for (const col of data) {
        if (col.name.startsWith('_')) continue; // Skip internal PocketBase system collections
        
        md += `### Colección: \`${col.name}\`\n`;
        md += `- **ID:** \`${col.id}\`\n`;
        md += `- **API Rules:**\n`;
        md += `  - List: \`${col.listRule}\`\n`;
        md += `  - View: \`${col.viewRule}\`\n`;
        md += `  - Create: \`${col.createRule}\`\n`;
        md += `  - Update: \`${col.updateRule}\`\n`;
        md += `  - Delete: \`${col.deleteRule}\`\n\n`;
        
        md += `#### Campos\n`;
        md += `| Nombre | Tipo | Requerido | Sistema |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        for (const field of col.fields) {
            md += `| \`${field.name}\` | \`${field.type}\` | ${field.required ? 'Sí' : 'No'} | ${field.system ? 'Sí' : 'No'} |\n`;
        }
        
        if (col.indexes && col.indexes.length > 0) {
            md += `\n#### Índices\n`;
            for (const idx of col.indexes) {
                md += `- \`${idx}\`\n`;
            }
        }
        md += `\n---\n\n`;
    }

    fs.writeFileSync('../docs/audits/phase-4/DATABASE_SCHEMA_AUDIT.md', md);
    console.log("DATABASE_SCHEMA_AUDIT.md generated successfully!");

} catch(err) {
    console.error(err);
}
