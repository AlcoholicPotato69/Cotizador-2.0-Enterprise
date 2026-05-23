/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // 1. Añadir los permisos granulares a rbac_permissions
  const permissionsToAdd = [
    { key: "pricing.read", module: "pricing", name: "Ver Precios", description: "Ver reglas de precios" },
    { key: "pricing.manage", module: "pricing", name: "Gestionar Precios", description: "Crear y editar precios base y recargos" },
    { key: "promotions.read", module: "promotions", name: "Ver Promociones", description: "Ver promociones vigentes" },
    { key: "promotions.manage", module: "promotions", name: "Gestionar Promociones", description: "Crear y editar promociones" },
    { key: "taxes.read", module: "taxes", name: "Ver Impuestos", description: "Ver catálogo de impuestos" },
    { key: "taxes.manage", module: "taxes", name: "Gestionar Impuestos", description: "Administrar reglas fiscales" },
    { key: "branding.read", module: "branding", name: "Ver Branding", description: "Ver configuración visual" },
    { key: "branding.manage", module: "branding", name: "Gestionar Branding", description: "Modificar paletas y logos" },
    { key: "templates.read", module: "templates", name: "Ver Plantillas", description: "Consultar plantillas" },
    { key: "templates.manage", module: "templates", name: "Gestionar Plantillas", description: "Editar HTML y variables" }
  ];

  const permissionsCollection = dao.findCollectionByNameOrId("rbac_permissions");
  
  permissionsToAdd.forEach(p => {
    const record = new Record(permissionsCollection);
    record.set("key", p.key);
    record.set("module", p.module);
    record.set("name", p.name);
    record.set("description", p.description);
    record.set("active", true);
    dao.saveRecord(record);
  });

  // 2. Colección: template_registry
  const templateRegistry = new Collection({
    id: "template_registry",
    name: "template_registry",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants" } },
      { name: "name", type: "text", required: true },
      { name: "type", type: "select", required: true, options: { maxSelect: 1, values: ["contract", "quote", "invoice", "receipt"] } },
      { name: "html_content", type: "editor", required: false },
      { name: "version", type: "number", required: true },
      { name: "status", type: "select", required: true, options: { maxSelect: 1, values: ["draft", "active", "archived"] } }
    ]
  });
  dao.saveCollection(templateRegistry);

  // 3. Colección: tenant_branding
  const tenantBranding = new Collection({
    id: "tenant_branding",
    name: "tenant_branding",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "primary_color", type: "text", required: false },
      { name: "secondary_color", type: "text", required: false },
      { name: "logo", type: "file", required: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/png", "image/jpeg", "image/svg+xml"] } },
      { name: "typography", type: "text", required: false }
    ]
  });
  dao.saveCollection(tenantBranding);

}, (db) => {
  const dao = new Dao(db);
  // Rollback logic
  try {
    const templates = dao.findCollectionByNameOrId("template_registry");
    if (templates) dao.deleteCollection(templates);
    
    const branding = dao.findCollectionByNameOrId("tenant_branding");
    if (branding) dao.deleteCollection(branding);
    
    // Note: rollback for granular permissions is omitted to prevent cascading issues in a down migration
  } catch (e) {
    console.log("Error in rollback: ", e);
  }
});
