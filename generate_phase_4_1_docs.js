const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs', 'business-knowledge', 'phase-4-frontend');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {
    'RESPONSIVE_DESIGN_STANDARD.md': `# RESPONSIVE DESIGN STANDARD (Fase 4.1)\n\n## Breakpoints y Grid\n- **Mobile (< 640px)**: 1 columna. App Shell colapsa el Sidebar en un *Drawer* hamburguesa. Tablas cambian a vista de *Cards* verticales.\n- **Tablet (640px - 1024px)**: 2 columnas. Sidebar minimizado a iconos.\n- **Laptop (1024px - 1280px)**: Sidebar completo, Dashboards y Calendarios con scroll horizontal dinámico.\n- **Desktop (> 1280px)**: Aprovechamiento del *Ultra-Wide* para métricas adicionales y visores de PDF *Side-by-Side*.`,
    
    'THEME_VARIANT_ARCHITECTURE.md': `# THEME VARIANT ARCHITECTURE (Fase 4.1)\n\n## Conmutación de Temas (Vue Composition API)\nEl \`ThemeProvider\` inyecta CSS Custom Properties dinámicamente según 2 ejes:\n1. **Mode**: Light vs Dark.\n2. **Tenant**: \n   - Plaza Mayor: \`--color-primary\` = Rojo Corporativo.\n   - Casa de Piedra: \`--color-primary\` = Café Corporativo.\nLa UI observará la tienda de Pinia (\`useTenant() y useTheme()\`) y repintará el sistema de inmediato.`,
    
    'GLOBAL_ERROR_HANDLING_ARCHITECTURE.md': `# GLOBAL ERROR HANDLING ARCHITECTURE (Fase 4.1)\n\n## 1. Interceptor Central\nTodo fallo en la SPA es atrapado por el \`Axios Interceptor\` / \`fetch interceptor\`.\n- **API Errors (500)**: \`GlobalToast.danger("Error de conexión con el Servidor")\`.\n- **Validation Errors (400)**: Se inyectan en \`useForm()\` para iluminar en rojo los Inputs específicos.\n- **Permission Errors (403)**: \`GlobalToast.warning("Sin acceso")\` y redirección a *Dashboard*.\n- **Network Errors (Offline)**: Pantalla de *Offline Skeleton*.`,
    
    'AUTHENTICATION_ARCHITECTURE.md': `# AUTHENTICATION ARCHITECTURE (Fase 4.1)\n\n## Flujo Zero-Trust con PocketBase\n1. **Login**: Frontend envía credenciales. PocketBase Auth retorna Token JWT.\n2. **Persistencia**: Token se guarda en \`localStorage\` con *httponly/secure* wrapper vía *Pinia*.\n3. **Refresh**: Validación silenciosa del Token al iniciar el *AppShell*.\n4. **Logout**: Limpieza del *Token* local y anulación en PB (Forced Logout).`,
    
    'SESSION_MANAGEMENT_ARCHITECTURE.md': `# SESSION MANAGEMENT ARCHITECTURE (Fase 4.1)\n\n## 1. Validación Activa\nSi el usuario deja la pestaña inactiva por X tiempo o el token JWT expira, el *Axios Interceptor* capturará el error 401 y disparará la acción \`authStore.logout()\`, forzando el retorno al Login.\n## 2. Invalidation Hook\nCualquier cambio a la contraseña o rol del usuario invalida automáticamente todos sus *Tokens* emitidos en la Base de Datos, matando la sesión inmediatamente.`,
    
    'PERMISSION_CONTEXT_ARCHITECTURE.md': `# PERMISSION CONTEXT ARCHITECTURE (Fase 4.1)\n\n## 1. Composición de Seguridad (DENY > ALLOW > ROLE)\nTodo componente de la UI debe condicionarse así:\n\`\`\`vue\n<PrimaryButton v-if="permissions.can('invoice.approve')">Aprobar</PrimaryButton>\n\`\`\`\n**Prohibido**: \`v-if="user.role === 'admin'"\`.\nEl \`usePermissions()\` evaluará las reglas granulares inyectadas al loguearse, respetando siempre el modelo de *Effective Permissions Engine* (Fase F).`,
    
    'TENANT_CONTEXT_ARCHITECTURE.md': `# TENANT CONTEXT ARCHITECTURE (Fase 4.1)\n\n## 1. Resolución Automática\nAl loguearse, el sistema determina el \`tenant_id\` asociado al \`user_id\`.\n- \`useTenant()\` expone \`currentTenant\`, \`brandingContext\`, y \`taxProfile\`.\n- Si un SuperAdmin tiene acceso a ambos, el Navbar superior mostrará un *Tenant Switcher*.\n- Todo Fetch de datos enviará \`tenant_id\` como filtro mandatorio, respaldado por las *API Rules* backend.`,
    
    'APPLICATION_SHELL_ARCHITECTURE.md': `# APPLICATION SHELL ARCHITECTURE (Fase 4.1)\n\n## 1. El Marco Operativo (Layout Base)\n- **Sidebar**: Navegación principal dinámica generada desde el \`usePermissions()\`. (Ej. Si no tienes \`invoice.view\`, no ves la pestaña Financiera).\n- **Topbar**: User Profile, Notification Bell y Global Search Bar.\n- **Tenant Badge**: Indicador visual persistente (Arriba a la Izquierda) recordando al usuario si está operando Plaza Mayor (Rojo) o Casa de Piedra (Café).`,
    
    'LANDING_PAGE_ARCHITECTURE.md': `# LANDING PAGE ARCHITECTURE (Fase 4.1)\n\n## 1. Portal de Acceso\n- **Estado Unauthenticated**: Vista institucional pulida con branding corporativo global (o multi-branding) y formulario de Login.\n- **Redirección Mágica**: Si un JWT válido existe, el \`Router Guard\` bloquea el acceso al *Landing* y catapulta al usuario al Dashboard Base dinámico (Publicidad para PM, Eventos para CP).`
};

for (const [filename, content] of Object.entries(docs)) {
    fs.writeFileSync(path.join(targetDir, filename), content, 'utf8');
    console.log(`Generado: ${filename}`);
}

console.log('Phase 4.1 Foundation Architecture documents generated successfully.');
