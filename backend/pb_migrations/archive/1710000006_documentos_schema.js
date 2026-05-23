/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const collection = new Collection({
    id: "documentos_catalog_01",
    name: "documentos",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "doc_tenant_col",
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
        id: "doc_quote_col",
        name: "cotizacion",
        type: "relation",
        required: false,
        presentable: false,
        unique: false,
        options: {
          collectionId: "cotizaciones_catalog_01",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "doc_type_col",
        name: "tipo",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["contrato", "factura_pdf", "factura_xml", "cotizacion_final", "anexo"]
        }
      },
      {
        system: false,
        id: "doc_file_col",
        name: "archivo",
        type: "file",
        required: true,
        presentable: false,
        unique: false,
        options: {
          maxSelect: 1,
          maxSize: 15728640,
          protected: true
        }
      }
    ],
    indexes: ["CREATE INDEX `idx_documentos_tenant` ON `documentos` (`tenant`)"],
    listRule: "@request.auth.effective_permissions ?~ 'documents.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'documents.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'documents.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'documents.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: "@request.auth.effective_permissions ?~ 'documents.delete' && @request.auth.allowed_tenants ?= tenant",
    options: {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("documentos");
  return dao.deleteCollection(collection);
});
