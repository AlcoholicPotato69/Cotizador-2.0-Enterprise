/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // 1. Branding Assets
  const brandingAssets = new Collection({
    id: "tenant_brand_assets_col",
    name: "tenant_brand_assets",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "logo_url", type: "text", required: false }, // Simulating file/url
      { name: "letterhead_url", type: "text", required: false },
      { name: "primary_color", type: "text", required: false },
      { name: "secondary_color", type: "text", required: false },
      { name: "version", type: "number", required: true },
      { name: "active", type: "bool", required: true }
    ]
  });
  dao.saveCollection(brandingAssets);

  // 2. Dashboard Configurations
  const dashboardConfig = new Collection({
    id: "dashboard_configs_col",
    name: "dashboard_configs",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "active_widgets", type: "json", required: true }, // Array of widget IDs allowed by tenant
      { name: "layout_schema", type: "json", required: false }
    ]
  });
  dao.saveCollection(dashboardConfig);

  // 3. Modifying RBAC Direct Permissions for Hybrid Engine (DENY precedence)
  const directPerms = dao.findCollectionByNameOrId("rbac_user_direct_permissions");
  if (directPerms) {
    directPerms.schema.addField(new SchemaField({
      name: "is_deny",
      type: "bool",
      required: false
    }));
    dao.saveCollection(directPerms);
  }

}, (db) => {
  const dao = new Dao(db);
  try {
    const branding = dao.findCollectionByNameOrId("tenant_brand_assets");
    if (branding) dao.deleteCollection(branding);
    
    const dashboard = dao.findCollectionByNameOrId("dashboard_configs");
    if (dashboard) dao.deleteCollection(dashboard);
    
    const directPerms = dao.findCollectionByNameOrId("rbac_user_direct_permissions");
    if (directPerms) {
      directPerms.schema.removeField("is_deny");
      dao.saveCollection(directPerms);
    }
  } catch(e) {}
});
