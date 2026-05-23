/**
 * Shared Effective Permissions Engine (PocketBase JS Hooks version)
 * 
 * Calcula los permisos efectivos de un usuario en un tenant específico 
 * interceptando las tablas de RBAC directamente en la base de datos de PocketBase.
 * 
 * @param {string} userId 
 * @param {string} tenantId 
 * @param {any} $app - La instancia de PocketBase (para consultas db)
 * @returns {Set<string>} - Conjunto de llaves de permiso (ej. 'quotes.create')
 */
var protectedCollections = {
  "quotes": { module: "quotes", view: "quotes.read", create: "quotes.create", update: "quotes.update", delete: "quotes.delete" },
  "clients": { module: "clients", view: "clients.read", create: "clients.create", update: "clients.update", delete: "clients.delete" },
  "contracts": { module: "contracts", view: "contracts.read", create: "contracts.create", update: "contracts.update", delete: "contracts.cancel" },
  "document_registry": { module: "documents", view: "documents.read", create: "documents.upload", update: "documents.verify", delete: "documents.reject" },
  "rule_registry": { module: "config", view: "config.read", create: "config.manage", update: "config.manage", delete: "config.manage" },
  "espacios_catalog": { module: "spaces", view: "spaces.read", create: "spaces.manage", update: "spaces.manage", delete: "spaces.manage" }
};

module.exports = {
  protectedCollections: protectedCollections,
  
  enforceRbac: function (e, actionType, $app) {
    var collectionName = e.collection.name;
    var conf = protectedCollections[collectionName];
    if (!conf) return; 

    var authRecord = e.auth;
    if (!authRecord) {
       throw new BadRequestError("Acceso denegado. No autenticado.");
    }
    
    // Bypass RBAC for system superusers
    if (authRecord.collection().name === "_superusers") {
        return;
    }
    
    var userId = authRecord.id;

    var reqData = {};
    try {
        reqData = $apis.requestInfo(e.httpContext).data || {};
    } catch (err) {}

    var tenantId = "";
    if (actionType === "create") {
       tenantId = e.record.get("tenant_id") || e.record.get("tenant") || reqData.tenant_id || reqData.tenant;
    } else {
       tenantId = e.record.get("tenant_id") || e.record.get("tenant") || reqData.tenant_id || reqData.tenant;
    }

    console.log("[RBAC] collection:", collectionName, "action:", actionType, "extracted tenantId:", tenantId);

    if (!tenantId) {
       this.logSecurityAudit("", userId, "TAMPERING_ATTEMPT", collectionName, "Intento sin TenantID", {}, $app);
       throw new BadRequestError("Tenant no identificado en la transacción.");
    }

    var requiredPerm = conf[actionType];
    if (!requiredPerm) return; 

    var hasPerm = this.hasPermission(userId, tenantId, requiredPerm, $app);

    if (!hasPerm) {
       this.logSecurityAudit(tenantId, userId, "ACCESS_DENIED", collectionName, "Denegado", { payload: actionType === 'create' ? null : e.record.id }, $app);
       throw new ForbiddenError("Permisos insuficientes para realizar esta acción. Backend Enforcement Activado.");
    }
  },
  calculateEffectivePermissions: function (userId, tenantId, requiredPermission, $app) {
    var effectivePermissions = {};
    try {
      var userRecord = $app.findRecordById("users", userId);
      if (!userRecord) return effectivePermissions;

      // tenant isolation check
      var uTenantId = userRecord.get("tenant_id") || userRecord.get("tenant");
      if (uTenantId && uTenantId !== tenantId && tenantId !== "") {
          console.log("[RBAC] Cross-tenant attempt detected!", "User:", uTenantId, "Target:", tenantId);
          return {};
      }

      // check if effective_permissions is cached directly on user
      var rawPerms = userRecord.get("effective_permissions");
      var cachedPerms = {};
      if (rawPerms) {
          try {
              if (typeof rawPerms === 'string') {
                  cachedPerms = JSON.parse(rawPerms);
              } else if (Array.isArray(rawPerms) || rawPerms.length) {
                  // It's a []byte array
                  var permsStr = "";
                  for (var i = 0; i < rawPerms.length; i++) {
                      permsStr += String.fromCharCode(rawPerms[i]);
                  }
                  cachedPerms = JSON.parse(permsStr);
              } else {
                  cachedPerms = JSON.parse(JSON.stringify(rawPerms));
              }
          } catch(e) {
              console.log("[RBAC] Error parsing perms byte array", e.message);
          }
      }

      if (rawPerms && rawPerms[requiredPermission] === true) {
          return rawPerms;
      }

      if (cachedPerms && cachedPerms[requiredPermission] === true) {
          return cachedPerms;
      }

      var roleIdArr = userRecord.get("role_id");
      var roleId = Array.isArray(roleIdArr) ? roleIdArr[0] : roleIdArr;
      
      if (roleId && roleId.trim() !== "") {
          try {
              var roleRecord = $app.findRecordById("roles", roleId);
              if (roleRecord) {
                  var permsJson = roleRecord.get("permissions_json");
                  if (permsJson) {
                      if (Array.isArray(permsJson)) {
                          for (var i = 0; i < permsJson.length; i++) {
                              effectivePermissions[permsJson[i]] = true;
                          }
                      } else if (typeof permsJson === 'object') {
                          effectivePermissions = permsJson;
                      }
                  }
              }
          } catch (roleErr) {
              console.log("[PB_HOOK_ERROR] Role not found or error:", roleErr.message);
          }
      }
    } catch (e) {
      console.log("[PB_HOOK_ERROR] Fallo en calculateEffectivePermissions: ", e);
    }
    return effectivePermissions;
  },

  hasPermission: function (userId, tenantId, requiredPermission, $app) {
    var perms = this.calculateEffectivePermissions(userId, tenantId, requiredPermission, $app);
    var isAllowed = !!perms[requiredPermission];
    console.log("[RBAC] hasPermission check for", requiredPermission, "returned:", isAllowed, "perms object:", JSON.stringify(perms));
    return isAllowed;
  },
  
  logSecurityAudit: function (tenantId, userId, action, resource, desc, payload, appRef) {
    try {
      var collection = appRef.findCollectionByNameOrId("audit_logs");
      var record = new Record(collection);
      if (tenantId && tenantId.trim() !== "") {
          record.set("tenant_id", tenantId);
      }
      if (userId && userId.trim() !== "") {
          record.set("actor", userId);
      }
      record.set("action", action);
      record.set("resource", resource);
      record.set("details", desc);
      appRef.save(record);
    } catch(e) {
      console.log("[PB_HOOK_ERROR] Fallo al escribir Security Audit Log:", e.message);
    }
  }
};
