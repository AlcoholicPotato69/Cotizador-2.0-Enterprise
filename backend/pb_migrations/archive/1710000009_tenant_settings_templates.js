/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // 1. Templates Registry
  const templatesCollection = new Collection({
    id: "templates_registry_00",
    name: "templates_registry",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "tpl_tenant_col",
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
        id: "tpl_type_col",
        name: "template_type",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["contract", "quote", "receipt", "internal", "annex"]
        }
      },
      {
        system: false,
        id: "tpl_name_col",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "tpl_version_col",
        name: "version",
        type: "number",
        required: true,
        presentable: true,
        unique: false,
        options: { min: 1, max: null }
      },
      {
        system: false,
        id: "tpl_status_col",
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
        id: "tpl_html_col",
        name: "html_content",
        type: "editor",
        required: true,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "tpl_vars_col",
        name: "required_variables",
        type: "json", // Array of strings e.g. ["{{CLIENT_NAME}}", "{{TOTAL}}"]
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    listRule: "@request.auth.effective_permissions ?~ 'config.templates.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'config.templates.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'config.templates.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'config.templates.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: null, // Versioning implies archiving, not deleting
    options: {}
  });

  dao.saveCollection(templatesCollection);

  // 2. Tenant Settings
  const settingsCollection = new Collection({
    id: "tenant_settings_0000",
    name: "tenant_settings",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "tst_tenant_col",
        name: "tenant",
        type: "relation",
        required: true,
        presentable: true,
        unique: true, // 1 to 1 mapping with tenant
        options: {
          collectionId: "tenants_catalog_00",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "tst_branding_col",
        name: "branding",
        type: "json", // { logo_url: "", primary_color: "", legal_footer: "" }
        required: false,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "tst_taxes_col",
        name: "tax_rules",
        type: "json", // [{ name: "IVA", rate: 16, applies_to: "all" }, { name: "ISN", rate: 2, applies_to: "renta" }]
        required: false,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "tst_automation_col",
        name: "automation_preferences",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    listRule: "@request.auth.effective_permissions ?~ 'config.tenant.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'config.tenant.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'config.tenant.edit' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'config.tenant.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: null,
    options: {}
  });

  return dao.saveCollection(settingsCollection);
}, (db) => {
  const dao = new Dao(db);
  const tpl = dao.findCollectionByNameOrId("templates_registry");
  const tst = dao.findCollectionByNameOrId("tenant_settings");
  dao.deleteCollection(tpl);
  return dao.deleteCollection(tst);
});
