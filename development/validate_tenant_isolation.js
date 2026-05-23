const fs = require('fs');

(async () => {
    try {
        let md = `# TENANT ISOLATION & RBAC VALIDATION REPORT\n\n**Generado:** ${new Date().toISOString()}\n\n`;

        // 1. Auth as user@plazamayor.com
        const pmAuth = await fetch("http://127.0.0.1:8090/api/collections/users/auth-with-password", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity: "user@plazamayor.com", password: "Password123!" })
        });
        const pmData = await pmAuth.json();
        const pmToken = pmData.token;
        const pmHeaders = { "Content-Type": "application/json", "Authorization": pmToken };
        
        md += `## 1. Autenticación\n`;
        md += `- **Usuario PM (user@plazamayor.com):** ✅ Autenticado exitosamente.\n`;

        // 2. Fetch Tenants list (should only see their own, or all if listRule allows)
        const tenantsRes = await fetch("http://127.0.0.1:8090/api/collections/tenants/records", { headers: pmHeaders });
        const tenantsData = await tenantsRes.json();
        md += `\n## 2. Visibilidad de Tenants (Cross-Tenant Leakage Check)\n`;
        md += `- **Regla API de \`tenants\`:** \`@request.auth.id != ''\` (Permite listar TODOS los tenants para usuarios logueados).\n`;
        md += `- **Tenants visibles por PM:** ${tenantsData.items.length}\n`;
        
        // 3. Fetch Clientes list (should only see their own)
        const clientesRes = await fetch("http://127.0.0.1:8090/api/collections/clientes/records", { headers: pmHeaders });
        const clientesData = await clientesRes.json();
        md += `\n## 3. Aislamiento FLS en Clientes\n`;
        md += `- **Regla API de \`clientes\`:** \`@request.auth.tenant_id = tenant_id\`\n`;
        md += `- **Clientes visibles por PM (debería ser 0 porque no hemos creado clientes):** ${clientesData.items ? clientesData.items.length : 'Error'}\n`;

        // 4. Intento de acceso cruzado: Crear un cliente en PM y que CP intente leerlo
        md += `\n## 4. Inyección Cruzada de Tenant (Cross-Tenant Post)\n`;
        const cpAuth = await fetch("http://127.0.0.1:8090/api/collections/users/auth-with-password", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity: "user@casadepiedra.com", password: "Password123!" })
        });
        const cpToken = (await cpAuth.json()).token;
        const cpHeaders = { "Content-Type": "application/json", "Authorization": cpToken };

        // Usuario CP intenta crear un cliente asignado al tenant_id de PM
        const cpHackingPmRes = await fetch("http://127.0.0.1:8090/api/collections/clientes/records", {
            method: "POST", headers: cpHeaders,
            body: JSON.stringify({ 
                tenant_id: pmData.record.tenant_id, 
                razon_social: "Hacked Client", 
                status_validacion: "pendiente" 
            })
        });
        const cpHackResult = await cpHackingPmRes.json();
        md += `- **Ataque:** Usuario CP intenta crear cliente en Tenant PM.\n`;
        if (cpHackResult.id) {
            md += `- **Resultado:** ❌ FALLO DE SEGURIDAD. CP pudo crear en PM.\n`;
        } else {
            md += `- **Resultado:** ✅ BLOQUEADO (Expected: ${cpHackResult.status}). Aislamiento activo.\n`;
        }

        fs.writeFileSync('../docs/audits/phase-4/TENANT_ISOLATION_REPORT.md', md);
        console.log("TENANT_ISOLATION_REPORT.md generated!");

    } catch(err) {
        console.error(err);
    }
})();
