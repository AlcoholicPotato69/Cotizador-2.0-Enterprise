import { pb } from '../services/pb';

export interface EffectivePermissionsParams {
  userId: string;
  tenantId: string;
}

export interface FieldLevelSecurityRules {
  [collection: string]: {
    [field: string]: {
      read: boolean;
      write: boolean;
    }
  }
}

/**
 * HYBRID EFFECTIVE PERMISSIONS ENGINE V2
 * 
 * Implementa el modelo IAM avanzado: DENY > ALLOW > ROLE
 * 
 * @returns Un objeto con el Set de permisos efectivos y el motor FLS
 */
export async function calculateEffectivePermissions(params: EffectivePermissionsParams): Promise<{
  permissions: Set<string>;
  fls: FieldLevelSecurityRules;
  hasPermission: (key: string) => boolean;
}> {
  const { userId, tenantId } = params;
  
  const rolePermissions = new Set<string>();
  const explicitAllows = new Set<string>();
  const explicitDenies = new Set<string>();
  const effectivePermissions = new Set<string>();
  
  const fls: FieldLevelSecurityRules = {};

  try {
    // 1. OBTENER PERMISOS DE ROLES (Nivel base)
    const userRoles = await pb.collection('rbac_user_roles').getFullList({
      filter: `user = "${userId}" && tenant = "${tenantId}"`,
      expand: 'role'
    });

    for (const ur of userRoles) {
      if (ur.expand?.role) {
        const rolePerms = await pb.collection('rbac_role_permissions').getFullList({
          filter: `role = "${ur.expand.role.id}"`,
          expand: 'permission'
        });
        
        for (const rp of rolePerms) {
          if (rp.expand?.permission && rp.expand.permission.active) {
            rolePermissions.add(rp.expand.permission.key);
          }
        }
      }
    }

    // 2. OBTENER PERMISOS DIRECTOS (Nivel Quirúrgico)
    // El schema ahora tiene is_deny = true/false
    const directPerms = await pb.collection('rbac_user_direct_permissions').getFullList({
      filter: `user = "${userId}" && tenant = "${tenantId}"`,
      expand: 'permission'
    });

    for (const dp of directPerms) {
      if (dp.expand?.permission && dp.expand.permission.active) {
        if (dp.is_deny) {
          explicitDenies.add(dp.expand.permission.key);
        } else {
          explicitAllows.add(dp.expand.permission.key);
        }
      }
    }

    // 3. CALCULAR PRECEDENCIA MATEMÁTICA: DENY > ALLOW > ROLE
    // Paso A: Sumar Roles y Allows
    rolePermissions.forEach(p => effectivePermissions.add(p));
    explicitAllows.forEach(p => effectivePermissions.add(p));
    
    // Paso B: Restar Denies absolutos (Tienen la máxima prioridad)
    explicitDenies.forEach(p => effectivePermissions.delete(p));

    // 4. FIELD LEVEL SECURITY (FLS)
    // Conceptualmente, el FLS se deriva de prefijos especiales en los permisos, e.g. "fls.quotes.discount.write"
    effectivePermissions.forEach(p => {
      if (p.startsWith('fls.')) {
        const parts = p.split('.');
        if (parts.length === 4) {
          const [, collection, field, action] = parts; // e.g. fls, quotes, discount, write
          if (!fls[collection]) fls[collection] = {};
          if (!fls[collection][field]) fls[collection][field] = { read: false, write: false };
          if (action === 'read') fls[collection][field].read = true;
          if (action === 'write') fls[collection][field].write = true;
        }
      }
    });

  } catch (err) {
    console.error("Error calculando Hybrid RBAC:", err);
  }

  return {
    permissions: effectivePermissions,
    fls,
    hasPermission: (key: string) => effectivePermissions.has(key)
  };
}
