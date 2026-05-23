/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const collection = new Collection({
    id: "clientes_catalog_01",
    name: "clientes",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "cli_tenant_col",
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
        id: "cli_name_col",
        name: "nombre_completo",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: 255, pattern: "" }
      },
      {
        system: false,
        id: "cli_rfc_col",
        name: "rfc",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: 40, pattern: "" }
      },
      {
        system: false,
        id: "cli_validado_col",
        name: "perfil_validado",
        type: "bool",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "cli_dictamen_col",
        name: "documentos_estado",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    indexes: ["CREATE INDEX `idx_clientes_tenant` ON `clientes` (`tenant`)"],
    listRule: "@request.auth.effective_permissions ?~ 'clients.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'clients.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'clients.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'clients.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: "@request.auth.effective_permissions ?~ 'clients.delete' && @request.auth.allowed_tenants ?= tenant",
    options: {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("clientes");
  return dao.deleteCollection(collection);
});
