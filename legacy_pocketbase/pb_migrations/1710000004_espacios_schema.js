/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const collection = new Collection({
    id: "espacios_catalog_01",
    name: "espacios",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "esp_tenant_col",
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
        id: "esp_name_col",
        name: "nombre",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: 255, pattern: "" }
      },
      {
        system: false,
        id: "esp_type_col",
        name: "tipo",
        type: "text",
        required: true,
        presentable: false,
        unique: false,
        options: { min: null, max: 80, pattern: "" }
      },
      {
        system: false,
        id: "esp_active_col",
        name: "activo",
        type: "bool",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "esp_price_col",
        name: "precio_base",
        type: "number",
        required: false,
        presentable: false,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "esp_b2b_col",
        name: "config_b2b",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    indexes: ["CREATE INDEX `idx_espacios_tenant` ON `espacios` (`tenant`)"],
    listRule: "@request.auth.effective_permissions ?~ 'catalog.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'catalog.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'catalog.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'catalog.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: "@request.auth.effective_permissions ?~ 'catalog.delete' && @request.auth.allowed_tenants ?= tenant",
    options: {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("espacios");
  return dao.deleteCollection(collection);
});
