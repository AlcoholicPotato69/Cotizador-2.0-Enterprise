/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // 1. Create Roles Collection
  const rolesCollection = new Collection({
    id: "roles_rbac_catalog_0",
    name: "roles",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "rol_name_col",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: 255, pattern: "" }
      },
      {
        system: false,
        id: "rol_slug_col",
        name: "slug",
        type: "text",
        required: true,
        presentable: false,
        unique: true,
        options: { min: null, max: 100, pattern: "^[a-z0-9_]+$" }
      },
      {
        system: false,
        id: "rol_perms_col",
        name: "permissions",
        type: "json",
        required: true,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "rol_tenant_col",
        name: "tenant",
        type: "relation",
        required: false,
        presentable: false,
        unique: false,
        options: {
          collectionId: "tenants_catalog_00",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      }
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_roles_slug` ON `roles` (`slug`)"],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.effective_permissions ?~ 'config.roles.manage'",
    updateRule: "@request.auth.effective_permissions ?~ 'config.roles.manage'",
    deleteRule: "@request.auth.effective_permissions ?~ 'config.roles.manage'",
    options: {}
  });

  dao.saveCollection(rolesCollection);

  // 2. Create Audit Logs Collection
  const auditCollection = new Collection({
    id: "audit_logs_system_00",
    name: "audit_logs",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "aud_actor_col",
        name: "actor",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "aud_action_col",
        name: "action",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "aud_payload_col",
        name: "payload",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    indexes: [],
    listRule: "@request.auth.effective_permissions ?~ 'control.access'",
    viewRule: "@request.auth.effective_permissions ?~ 'control.access'",
    createRule: null, // Only backend hooks can create audits
    updateRule: null,
    deleteRule: null,
    options: {}
  });

  dao.saveCollection(auditCollection);

  // 3. Update Users Collection to use the new RBAC engine
  const users = dao.findCollectionByNameOrId("users");

  // Remove the old simple 'role' text/select field if it exists
  try {
    users.schema.removeField("usr_role_col");
  } catch (e) {}

  users.schema.addField(new SchemaField({
    system: false,
    id: "usr_roles_rel",
    name: "roles",
    type: "relation",
    required: false,
    presentable: false,
    unique: false,
    options: {
      collectionId: rolesCollection.id,
      cascadeDelete: false,
      minSelect: null,
      maxSelect: null,
      displayFields: ["name"]
    }
  }));

  users.schema.addField(new SchemaField({
    system: false,
    id: "usr_direct_perms",
    name: "direct_permissions",
    type: "json",
    required: false,
    presentable: false,
    unique: false,
    options: {}
  }));

  users.schema.addField(new SchemaField({
    system: false,
    id: "usr_effective_perms",
    name: "effective_permissions",
    type: "json",
    required: false,
    presentable: false,
    unique: false,
    options: {}
  }));

  // Ensure allowed_tenants exists
  let hasTenants = false;
  for (let field of users.schema.fields()) {
    if (field.name === 'allowed_tenants') hasTenants = true;
  }
  if (!hasTenants) {
    users.schema.addField(new SchemaField({
      system: false,
      id: "usr_tenants_col",
      name: "allowed_tenants",
      type: "relation",
      required: false,
      presentable: false,
      unique: false,
      options: {
        collectionId: "tenants_catalog_00",
        cascadeDelete: false,
        minSelect: null,
        maxSelect: null,
        displayFields: ["name"]
      }
    }));
  }

  dao.saveCollection(users);

}, (db) => {
  const dao = new Dao(db);
  
  // Revert users changes
  const users = dao.findCollectionByNameOrId("users");
  users.schema.removeField("usr_roles_rel");
  users.schema.removeField("usr_direct_perms");
  users.schema.removeField("usr_effective_perms");
  dao.saveCollection(users);

  // Delete roles and audit collections
  try {
    const rolesCollection = dao.findCollectionByNameOrId("roles");
    dao.deleteCollection(rolesCollection);
  } catch(e) {}
  try {
    const auditCollection = dao.findCollectionByNameOrId("audit_logs");
    dao.deleteCollection(auditCollection);
  } catch(e) {}
});
