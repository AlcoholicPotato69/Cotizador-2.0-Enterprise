/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const collections = [
    // 1. RBAC Permissions (Entidad atómica con metadata)
    new Collection({
      id: "rbac_permissions",
      name: "rbac_permissions",
      type: "base",
      system: false,
      schema: [
        { name: "key", type: "text", required: true, unique: true, options: { pattern: "^[a-z_]+\\.[a-z_]+$" } }, // Ej. quotes.create
        { name: "module", type: "text", required: true }, // Ej. quotes
        { name: "category", type: "text", required: true }, // Ej. commercial
        { name: "description", type: "text", required: false },
        { name: "active", type: "bool", required: true, options: {} }
      ],
      indexes: ["CREATE UNIQUE INDEX idx_rbac_perm_key ON rbac_permissions (key)"]
    }),

    // 2. RBAC Roles (Roles agrupadores por Tenant)
    new Collection({
      id: "rbac_roles",
      name: "rbac_roles",
      type: "base",
      system: false,
      schema: [
        { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", cascadeDelete: true } },
        { name: "name", type: "text", required: true },
        { name: "description", type: "text", required: false },
        { name: "is_template", type: "bool", required: true, options: {} } // Para plantillas globales opcionales
      ]
    }),

    // 3. RBAC Role Permissions (Pivot Rol -> Permiso)
    new Collection({
      id: "rbac_role_permissions",
      name: "rbac_role_permissions",
      type: "base",
      system: false,
      schema: [
        { name: "role", type: "relation", required: true, options: { collectionId: "rbac_roles", cascadeDelete: true } },
        { name: "permission", type: "relation", required: true, options: { collectionId: "rbac_permissions", cascadeDelete: true } }
      ]
    }),

    // 4. RBAC User Roles (Pivot Usuario -> Rol -> Tenant)
    new Collection({
      id: "rbac_user_roles",
      name: "rbac_user_roles",
      type: "base",
      system: false,
      schema: [
        { name: "user", type: "relation", required: true, options: { collectionId: "users", cascadeDelete: true } },
        { name: "role", type: "relation", required: true, options: { collectionId: "rbac_roles", cascadeDelete: true } },
        { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", cascadeDelete: true } }
      ]
    }),

    // 5. RBAC User Direct Permissions (Pivot Usuario -> Permiso -> Tenant - Para excepciones)
    new Collection({
      id: "rbac_user_direct_perm",
      name: "rbac_user_direct_permissions",
      type: "base",
      system: false,
      schema: [
        { name: "user", type: "relation", required: true, options: { collectionId: "users", cascadeDelete: true } },
        { name: "permission", type: "relation", required: true, options: { collectionId: "rbac_permissions", cascadeDelete: true } },
        { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", cascadeDelete: true } }
      ]
    }),

    // 6. Admin Audit Log (Gobernanza General)
    new Collection({
      id: "admin_audit_log",
      name: "admin_audit_log",
      type: "base",
      system: false,
      schema: [
        { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", cascadeDelete: true } },
        { name: "user", type: "relation", required: true, options: { collectionId: "users", cascadeDelete: true } },
        { name: "action", type: "text", required: true }, // Ej. ROLE_UPDATE, RULE_CREATE
        { name: "entity_type", type: "text", required: true }, // Ej. rbac_roles, rule_registry
        { name: "entity_id", type: "text", required: true },
        { name: "payload_before", type: "json", required: false },
        { name: "payload_after", type: "json", required: false },
        { name: "description", type: "text", required: false }
      ]
    })
  ];

  const dao = new Dao(db);
  for (const collection of collections) {
    dao.saveCollection(collection);
  }
}, (db) => {
  const dao = new Dao(db);
  const collections = [
    "admin_audit_log",
    "rbac_user_direct_permissions",
    "rbac_user_roles",
    "rbac_role_permissions",
    "rbac_roles",
    "rbac_permissions"
  ];
  for (const id of collections) {
    try {
      const collection = dao.findCollectionByNameOrId(id);
      if (collection) dao.deleteCollection(collection);
    } catch (e) {
      console.log(`Failed to delete ${id}:`, e);
    }
  }
});
