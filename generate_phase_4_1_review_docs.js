const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-4-frontend');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'PHASE_4_1_VISUAL_REVIEW.md': `# PHASE 4.1 VISUAL REVIEW\n\n## 1. Login\nEl componente \`LoginView.vue\` fue sometido a validación:\n- **Desktop / Laptop**: Centrado en tarjeta (Card) flotante. Inputs espaciosos (40px height).\n- **Tablet / Mobile**: Contenedor pasa a \`w-full p-4\`, quitando márgenes laterales innecesarios.\n\n## 2. Theme Engine (4-Way Matrix)\nLa conmutación es instantánea usando clases inyectadas en el \`body\`:\n- **PM Light**: Background \`surface-50\` blanco, acentos \`red-600\`.\n- **PM Dark**: Background \`surface-950\` negro matte, acentos \`red-500\`.\n- **CP Light**: Background \`surface-50\` perla, acentos \`amber-700\`.\n- **CP Dark**: Background \`surface-950\`, acentos \`amber-500\`.\n\n## 3. App Shell\nEl \`AppLayout.vue\` soporta:\n- **Sidebar**: Fijo en Desktop (w-64), escondido en Mobile bajo un botón hamburguesa.\n- **Tenant Badge**: Arriba a la izquierda, indicando siempre de qué lado de la barda estamos.\n\n## 4. Design Playground\nVisitable en \`/playground\`. Demuestra los estados activos y pasivos de los componentes de la librería base (\`DsButton\`, \`DsInput\`, \`DsCard\`, etc.).`,
    
    'PHASE_4_1_TECHNICAL_REVIEW.md': `# PHASE 4.1 TECHNICAL REVIEW\n\n## 1. Permission Driven Navigation\nEl archivo \`src/router/navigation.ts\` expone \`getAuthorizedNavigation()\`. Al renderizar el \`Sidebar.vue\`, el ciclo \`v-for\` filtra rutas donde \`permissionStore.can(route.permission)\` sea falso. Al revocar el permiso \`finance.view\` a un rol comercial, el enlace "Finanzas" desaparece del DOM, no solo se oculta con CSS.\n\n## 2. Session Management Cycle\n- **Login**: Inyecta estado en \`authStore\`. Redirige a \`/\`.\n- **Refresh**: El \`App.vue\` montará una validación silenciosa.\n- **Expiración**: El \`sessionStore\` mide 15 minutos de inactividad, invocando \`authStore.logout()\`.\n- **Logout**: Limpia Pinia, destruye caché y redirige a \`/login\`.\n\n## 3. Estrategia DEV vs PROD (Playground)\nLa ruta \`/playground\` es esencial para el equipo UI, pero letal si se expone a clientes.\n**Estrategia Aplicada**: El \`router.beforeEach\` evalúa \`import.meta.env.PROD\`. Si es \`true\` (Compilación a Producción), cualquier intento de navegar a \`/playground\` redirige silenciamente a \`/\`. El compilador de Vite (Tree-Shaking) descartará los componentes exclusivos del Playground.`,
    
    'PERFORMANCE_BUDGET.md': `# PERFORMANCE BUDGET\n\n## 1. Presupuesto Inicial (Vite / Vue 3)\nDado el contexto Enterprise, debemos evitar interfaces pesadas. Se establecen los siguientes límites duros para la compilación (\`npm run build\`):\n\n### Límite de Bundle (JS)\n- **Main Chunk (Vendor + Vue Core)**: Máximo **150 KB** (Gzipped).\n- **Async Chunks (Views)**: Máximo **50 KB** por ruta (Gzipped).\n\n### Límite de Estilos (CSS)\n- **Global Tailwind + Unstyled PrimeVue**: Máximo **25 KB** (Gzipped).\n\n## 2. Estrategia de Cumplimiento\n1. **Code Splitting**: El \`vue-router\` ya implementa \`() => import('./views/X.vue')\`. Cada módulo (Contratos, Cotizaciones) será un chunk independiente.\n2. **Tree-Shaking de PrimeVue**: Al usarlo en modo \`unstyled\`, no se importará el CSS masivo de temas de Prime, ahorrando hasta 100 KB.\n3. **Lucide Icons**: Se importarán explícitamente los iconos necesarios (\`import { ChevronDown } from 'lucide-vue-next'\`), previniendo el peso de la librería completa.`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Phase 4.1 Review documents generated successfully.');
