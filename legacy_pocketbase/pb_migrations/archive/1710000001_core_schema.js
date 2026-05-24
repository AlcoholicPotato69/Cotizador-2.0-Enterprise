/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collectionTenants = new Collection({
    id: "tenants_catalog_00",
    name: "tenants",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "ten_name_col",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        unique: false,
        options: { min: null, max: 255, pattern: "" }
      },
      {
        system: false,
        id: "ten_slug_col",
        name: "slug",
        type: "text",
        required: true,
        presentable: true,
        unique: true,
        options: { min: null, max: 50, pattern: "^[a-z0-9_]+$" }
      },
      {
        system: false,
        id: "ten_desc_col",
        name: "description",
        type: "text",
        required: false,
        presentable: false,
        unique: false,
        options: { min: null, max: null, pattern: "" }
      }
    ],
    indexes: ["CREATE UNIQUE INDEX `idx_tenants_slug` ON `tenants` (`slug`)"],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {}
  });

  try {
    return app.save(collectionTenants);
  } catch(err) {
    console.log("Collection tenants already exists, skipping migration creation.");
  }
}, (app) => {
  const collection = app.findCollectionByNameOrId("tenants");
  return app.delete(collection);
});
