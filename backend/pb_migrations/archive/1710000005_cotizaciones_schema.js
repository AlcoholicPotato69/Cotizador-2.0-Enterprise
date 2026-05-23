/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const collection = new Collection({
    id: "cotizaciones_catalog_01",
    name: "cotizaciones",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "cot_tenant_col",
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
        id: "cot_client_col",
        name: "cliente",
        type: "relation",
        required: true,
        presentable: false,
        unique: false,
        options: {
          collectionId: "clientes_catalog_01",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "cot_dates_start",
        name: "fecha_inicio",
        type: "date",
        required: true,
        presentable: false,
        unique: false,
        options: { min: "", max: "" }
      },
      {
        system: false,
        id: "cot_dates_end",
        name: "fecha_fin",
        type: "date",
        required: true,
        presentable: false,
        unique: false,
        options: { min: "", max: "" }
      },
      {
        system: false,
        id: "cot_status_col",
        name: "status",
        type: "select",
        required: true,
        presentable: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["pendiente", "aprobada", "rechazada", "finalizada"]
        }
      },
      {
        system: false,
        id: "cot_price_col",
        name: "precio_final",
        type: "number",
        required: true,
        presentable: false,
        unique: false,
        options: { min: 0, max: null }
      },
      {
        system: false,
        id: "cot_breakdown_col",
        name: "desglose_precios",
        type: "json",
        required: false,
        presentable: false,
        unique: false,
        options: {}
      }
    ],
    indexes: ["CREATE INDEX `idx_cotizaciones_tenant` ON `cotizaciones` (`tenant`)"],
    listRule: "@request.auth.effective_permissions ?~ 'quotes.view' && @request.auth.allowed_tenants ?= tenant",
    viewRule: "@request.auth.effective_permissions ?~ 'quotes.view' && @request.auth.allowed_tenants ?= tenant",
    createRule: "@request.auth.effective_permissions ?~ 'quotes.create' && @request.auth.allowed_tenants ?= tenant",
    updateRule: "@request.auth.effective_permissions ?~ 'quotes.edit' && @request.auth.allowed_tenants ?= tenant",
    deleteRule: "@request.auth.effective_permissions ?~ 'quotes.delete' && @request.auth.allowed_tenants ?= tenant",
    options: {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cotizaciones");
  return dao.deleteCollection(collection);
});
