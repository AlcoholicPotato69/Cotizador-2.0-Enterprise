/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const collection = new Collection({
    id: "doc_requirements_000",
    name: "document_requirements",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "req_tenant_col",
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
        id: "req_name_col",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "req_desc_col",
        name: "description",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      },
      {
        system: false,
        id: "req_client_type_col",
        name: "client_type_target",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: null, // Multiple selection allowed
          values: ["persona_fisica", "persona_moral", "gobierno", "extranjero"]
        }
      },
      {
        system: false,
        id: "req_is_mandatory_col",
        name: "is_mandatory",
        type: "bool",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "req_expires_col",
        name: "has_expiration",
        type: "bool",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "req_validity_col",
        name: "default_validity_months",
        type: "number",
        required: false,
        presentable: false,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "req_version_col",
        name: "version",
        type: "number",
        required: true,
        presentable: true,
        unique: false,
        options: { min: 1, max: null }
      },
      {
        system: false,
        id: "req_status_col",
        name: "status",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "inactive", "archived"]
        }
      }
    ],
    listRule: "@request.auth.effective_permissions ?~ 'config.documents.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'config.documents.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'config.documents.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'config.documents.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: null,
    options: {}
  });

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("document_requirements");
  return dao.deleteCollection(collection);
});
