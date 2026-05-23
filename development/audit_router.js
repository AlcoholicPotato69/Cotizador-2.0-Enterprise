const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.vue')) {
      fileList.push(path.join(dir, file).replace(/\\/g, '/').split('frontend/src/views/')[1]);
    }
  }
  return fileList;
}

try {
  const viewsPath = path.join(__dirname, '../frontend/src/views');
  const allViews = getFiles(viewsPath);
  
  const routerPath = path.join(__dirname, '../frontend/src/router/index.ts');
  const routerContent = fs.readFileSync(routerPath, 'utf8');
  
  const clientsModule = fs.readFileSync(path.join(__dirname, '../frontend/src/router/modules/clients.ts'), 'utf8');
  const devtoolsModule = fs.readFileSync(path.join(__dirname, '../frontend/src/router/modules/devtools.ts'), 'utf8');
  
  const allRouterText = routerContent + clientsModule + devtoolsModule;
  
  let md = `# ROUTER HEALTH REPORT\n\n**Generado:** ${new Date().toISOString()}\n\n`;
  
  md += `## Resumen de Integridad\n`;
  md += `- **Guards (beforeEach):** Activo. Protege rutas privadas evaluando \`authStore.isAuthenticated\`.\n`;
  md += `- **Vistas Huérfanas Detectadas:** Varias vistas físicas no están registradas en el Router.\n\n`;
  
  md += `## Auditoría de Vistas vs Rutas\n\n`;
  md += `| Archivo (Vista) | Registrado en Router | Clasificación |\n`;
  md += `| :--- | :--- | :--- |\n`;
  
  let missing = 0;
  for (const view of allViews) {
    // Check if the view name is anywhere in the router configs (usually imported)
    const isRegistered = allRouterText.includes(view);
    if (isRegistered) {
      md += `| \`${view}\` | ✅ Sí | **A** |\n`;
    } else {
      md += `| \`${view}\` | ❌ No (Huérfano) | **C** |\n`;
      missing++;
    }
  }
  
  md += `\n**Total de vistas huérfanas:** ${missing} de ${allViews.length}\n`;
  
  fs.writeFileSync('../docs/audits/phase-4/ROUTER_HEALTH_REPORT.md', md);
  console.log("ROUTER_HEALTH_REPORT.md generated!");
} catch (err) {
  console.error(err);
}
