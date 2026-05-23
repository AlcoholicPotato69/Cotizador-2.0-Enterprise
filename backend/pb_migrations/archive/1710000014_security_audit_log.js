/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const collection = new Collection({
    id: "security_audit_log",
    name: "security_audit_log",
    type: "base",
    system: false,
    schema: [
      { name: "tenant", type: "relation", required: false, options: { collectionId: "tenants", cascadeDelete: true } },
      { name: "user", type: "relation", required: false, options: { collectionId: "users", cascadeDelete: true } },
      { name: "action", type: "text", required: true }, // ACCESS_DENIED, TAMPERING_ATTEMPT, TENANT_VIOLATION
      { name: "resource", type: "text", required: true }, // Ej. quotes, api_endpoint
      { name: "ip_address", type: "text", required: false },
      { name: "payload", type: "json", required: false },
      { name: "description", type: "text", required: true }
    ],
    indexes: ["CREATE INDEX idx_sec_audit_action ON security_audit_log (action)"]
  });

  const dao = new Dao(db);
  dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  try {
    const collection = dao.findCollectionByNameOrId("security_audit_log");
    if (collection) dao.deleteCollection(collection);
  } catch (e) {
    console.log("Failed to delete security_audit_log:", e);
  }
});
