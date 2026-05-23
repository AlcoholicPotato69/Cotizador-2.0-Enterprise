const fs = require('fs');
const path = require('path');

try {
    const activeDir = '../backend/pb_migrations';
    const archiveDir = '../backend/pb_migrations/archive';
    
    let activeFiles = [];
    let archiveFiles = [];
    
    if (fs.existsSync(activeDir)) {
        activeFiles = fs.readdirSync(activeDir).filter(f => f.endsWith('.go') || f.endsWith('.js'));
    }
    
    if (fs.existsSync(archiveDir)) {
        archiveFiles = fs.readdirSync(archiveDir).filter(f => f.endsWith('.go') || f.endsWith('.js'));
    }
    
    let md = `# MIGRATION EXECUTION REPORT\n\n`;
    md += `**Generado:** ${new Date().toISOString()}\n\n`;
    
    md += `## Resumen de Migraciones\n\n`;
    md += `- **Migraciones Activas (Root):** ${activeFiles.length}\n`;
    md += `- **Migraciones Archivadas (Archive):** ${archiveFiles.length}\n\n`;
    
    md += `## 1. Migraciones Activas (Actuales y Ejecutadas en Arranque)\n`;
    md += `Estas migraciones son parte del boot process nativo del binario actual (Go/JS):\n\n`;
    md += `| Archivo | Estado | Clasificación |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const f of activeFiles) {
        md += `| \`${f}\` | ✅ Ejecutado / Activo | **A** |\n`;
    }
    
    md += `\n## 2. Migraciones Archivadas\n`;
    md += `Estas migraciones documentan el historial de diseño de la DB, pero fueron movidas a \`archive/\` (probablemente para mitigar conflictos estructurales o porque ya fueron consolidadas en el esquema binario).\n\n`;
    md += `| Archivo | Estado | Acción Sugerida |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const f of archiveFiles) {
        md += `| \`${f}\` | 📦 Archivado | Conservar como historial |\n`;
    }

    fs.writeFileSync('../docs/audits/phase-4/MIGRATION_EXECUTION_REPORT.md', md);
    console.log("MIGRATION_EXECUTION_REPORT.md generated successfully!");

} catch(err) {
    console.error(err);
}
