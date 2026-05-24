/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const collection = new Collection({
    id: "contratos_catalog_00",
    name: "contratos",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "ctr_tenant_col",
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
        id: "ctr_cotizacion_col",
        name: "cotizacion",
        type: "relation",
        required: true,
        presentable: true,
        unique: false,
        options: {
          collectionId: "cotizaciones_catalog_0",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "ctr_status_col",
        name: "status",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["borrador", "firmado", "cancelado"]
        }
      },
      {
        system: false,
        id: "ctr_html_col",
        name: "contenido_html",
        type: "editor",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    indexes: ["CREATE INDEX `idx_contratos_tenant` ON `contratos` (`tenant`)"],
    listRule: "@request.auth.effective_permissions ?~ 'contracts.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'contracts.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'contracts.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'contracts.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: "@request.auth.effective_permissions ?~ 'contracts.delete' && @request.auth.allowed_tenants ?= tenant",
    options: {}
  });

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("contratos");
  return dao.deleteCollection(collection);
});
