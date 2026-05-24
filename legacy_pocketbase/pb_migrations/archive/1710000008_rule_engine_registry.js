/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const collection = new Collection({
    id: "rule_registry_00000",
    name: "rule_registry",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "rul_tenant_col",
        name: "tenant",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "tenants_catalog_00",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "rul_type_col",
        name: "rule_type",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["eligibility", "pricing", "promotion", "contract", "notification", "document", "tenant"]
        }
      },
      {
        system: false,
        id: "rul_module_col",
        name: "module",
        type: "text",
        required: true,
        presentable: false,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: ""
        }
      },
      {
        system: false,
        id: "rul_name_col",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: ""
        }
      },
      {
        system: false,
        id: "rul_desc_col",
        name: "description",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: ""
        }
      },
      {
        system: false,
        id: "rul_version_col",
        name: "version",
        type: "number",
        required: true,
        presentable: true,
        unique: false,
        options: {
          min: 1,
          max: null
        }
      },
      {
        system: false,
        id: "rul_priority_col",
        name: "priority",
        type: "number",
        required: true,
        presentable: true,
        unique: false,
        options: {
          min: 1,
          max: 100
        }
      },
      {
        system: false,
        id: "rul_status_col",
        name: "status",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "inactive", "archived"]
        }
      },
      {
        system: false,
        id: "rul_conditions_col",
        name: "conditions",
        type: "json",
        required: true,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "rul_actions_col",
        name: "actions",
        type: "json",
        required: true,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "rul_eff_from_col",
        name: "effective_from",
        type: "date",
        required: true,
        presentable: false,
        unique: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        system: false,
        id: "rul_eff_until_col",
        name: "effective_until",
        type: "date",
        required: false,
        presentable: false,
        unique: false,
        options: {
          min: "",
          max: ""
        }
      }
    ],
    indexes: [
      "CREATE INDEX `idx_rule_registry_tenant` ON `rule_registry` (`tenant`)",
      "CREATE INDEX `idx_rule_registry_type` ON `rule_registry` (`rule_type`)",
      "CREATE INDEX `idx_rule_registry_status` ON `rule_registry` (`status`)"
    ],
    // The Tenant Administration Center requires config.rules.view, config.rules.edit etc.
    listRule: "@request.auth.effective_permissions ?~ 'config.rules.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'config.rules.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'config.rules.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'config.rules.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: null, // Rules should be archived, not deleted, to preserve history.
    options: {}
  });

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rule_registry");
  return dao.deleteCollection(collection);
});
