migrate((app) => {
  // 1. Tenants Collection
  const tenants = new Collection({
    id: "tenants00000000",
    type: "base",
    name: "tenants",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true, max: 100 },
      { name: "slug", type: "text", required: true, max: 50 },
      { name: "branding_json", type: "json", required: false },
      { name: "settings_json", type: "json", required: false }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_tenants_slug ON tenants (slug)"]
  });
  app.save(tenants);

  // 2. Roles Collection
  const roles = new Collection({
    id: "roles0000000000",
    type: "base",
    name: "roles",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true, max: 50 },
      { name: "permissions_json", type: "json", required: false },
      { name: "level", type: "number", required: true, min: 0 }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_roles_name ON roles (name)"]
  });
  app.save(roles);

  // 3. Clientes Collection (Tenant Isolated)
  const clientes = new Collection({
    id: "clientes0000000",
    type: "base",
    name: "clientes",
    listRule: "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    viewRule: "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    createRule: "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    updateRule: "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    deleteRule: null,
    fields: [
      {
        name: "tenant_id",
        type: "text",
        required: true,
        max: 50
      },
      { name: "razon_social", type: "text", required: true, max: 255 },
      { name: "rfc", type: "text", required: false, max: 40 },
      { name: "contacto", type: "text", required: false, max: 255 },
      { name: "status_validacion", type: "select", required: true, maxSelect: 1, values: ["pendiente", "aprobado", "rechazado"] },
      { name: "expediente_json", type: "json", required: false }
    ],
    indexes: ["CREATE INDEX idx_clientes_tenant ON clientes (tenant_id)"]
  });
  app.save(clientes);

}, (app) => {
  app.delete(app.findCollectionByNameOrId("clientes"));
  app.delete(app.findCollectionByNameOrId("roles"));
  app.delete(app.findCollectionByNameOrId("tenants"));
});
