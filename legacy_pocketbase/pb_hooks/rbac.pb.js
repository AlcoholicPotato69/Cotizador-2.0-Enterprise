/// <reference path="../pb_data/types.d.ts" />

function calculateEffectivePermissions(userRecord) {
    let permissions = [];
    
    // 1. Append direct permissions
    let directPerms = userRecord.get("direct_permissions");
    if (typeof directPerms === 'string' && directPerms.trim() !== '') {
        try { directPerms = JSON.parse(directPerms); } catch(err) { directPerms = []; }
    }
    if (Array.isArray(directPerms)) {
        permissions = permissions.concat(directPerms);
    }
    
    // 2. Append role permissions
    let roleIds = userRecord.get("roles");
    if (typeof roleIds === 'string' && roleIds.trim() !== '') {
        try { roleIds = JSON.parse(roleIds); } catch(err) { roleIds = []; }
    }
    if (Array.isArray(roleIds) && roleIds.length > 0) {
        for (let rid of roleIds) {
            try {
                const role = $app.findRecordById("roles", rid);
                if (role) {
                    let rolePerms = role.get("permissions");
                    if (typeof rolePerms === 'string' && rolePerms.trim() !== '') {
                        try { rolePerms = JSON.parse(rolePerms); } catch(err) { rolePerms = []; }
                    }
                    if (Array.isArray(rolePerms)) {
                        permissions = permissions.concat(rolePerms);
                    }
                }
            } catch(err) {
                console.error("Error fetching role for RBAC calculation:", rid, err);
            }
        }
    }
    
    // 3. Deduplicate
    const uniquePerms = [...new Set(permissions)];
    userRecord.set("effective_permissions", uniquePerms);
}

/**
 * PB HOOK: Calculate Effective Permissions for Users
 * This is the core of the RBAC engine. 
 * Runs before any user is saved (Created or Updated) via HTTP Request
 */
function handleUserSave(e) {
    calculateEffectivePermissions(e.record);
    return e.next();
}

onRecordCreateRequest(handleUserSave, "users");
onRecordUpdateRequest(handleUserSave, "users");

/**
 * PB HOOK: Cascade Role Updates
 * If a role is modified, we must recalculate effective_permissions 
 * for all users that hold that role.
 */
function cascadeRoleUpdate(e) {
    const roleId = e.record.id;
    
    try {
        // Find all users who have this role
        const users = $app.findRecordsByFilter("users", `roles ~ '${roleId}'`);
        
        for (let user of users) {
            calculateEffectivePermissions(user);
            $app.save(user);
        }
    } catch(err) {
        console.error("Error cascading role update to users:", err);
    }
}
onRecordUpdate(cascadeRoleUpdate, "roles");

/**
 * PB HOOK: Audit Logging
 * Logs role modifications and user permission changes
 */
function auditLogRoleUpdate(e) {
    try {
        const authRecord = e.auth || null;
        const actorId = authRecord ? authRecord.id : null;
        
        // Only log if we have an actor (skip system-level cascade saves)
        if (actorId) {
            const auditCollection = $app.findCollectionByNameOrId("audit_logs");
            const logRecord = new Record(auditCollection);
            
            logRecord.set("actor_id", actorId);
            logRecord.set("action", "ROLE_UPDATED");
            
            const payload = {
                role_id: e.record.id,
                role_name: e.record.get("name"),
                new_permissions: e.record.get("permissions")
            };
            // Note: Use details_json or payload based on the schema.
            // We use details_json to match the audit_logs schema seen in contracts.pb.js
            logRecord.set("details_json", JSON.stringify(payload));
            logRecord.set("entity_type", "roles");
            logRecord.set("entity_id", e.record.id);
            
            $app.save(logRecord);
        }
    } catch(err) {
        console.error("Error writing audit log:", err);
    }
}
onRecordUpdate(auditLogRoleUpdate, "roles");
