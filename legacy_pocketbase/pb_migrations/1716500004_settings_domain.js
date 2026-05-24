/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  const rule = "@request.auth.effective_permissions ?= 'settings.manage' && tenant_id = @request.auth.tenant_id";

  // 1. tenant_settings
  const tenantSettings = new Collection({
    id: "tenant_settings_001",
    name: "tenant_settings",
    type: "base",
    schema: [
      {
        name: "tenant_id",
        type: "text",
        required: true,
      },
      {
        name: "general_config",
        type: "json",
        required: false,
      }
    ],
    listRule: rule,
    viewRule: rule,
    createRule: rule,
    updateRule: rule,
    deleteRule: rule,
  });
  dao.saveCollection(tenantSettings);

  // 2. billing_settings
  const billingSettings = new Collection({
    id: "billing_settings_001",
    name: "billing_settings",
    type: "base",
    schema: [
      {
        name: "tenant_id",
        type: "text",
        required: true,
      },
      {
        name: "tax_rates",
        type: "json",
        required: false,
      },
      {
        name: "currency",
        type: "text",
        required: false,
      }
    ],
    listRule: rule,
    viewRule: rule,
    createRule: rule,
    updateRule: rule,
    deleteRule: rule,
  });
  dao.saveCollection(billingSettings);

  // 3. contract_settings
  const contractSettings = new Collection({
    id: "contract_settings_001",
    name: "contract_settings",
    type: "base",
    schema: [
      {
        name: "tenant_id",
        type: "text",
        required: true,
      },
      {
        name: "default_clauses",
        type: "json",
        required: false,
      },
      {
        name: "legal_templates",
        type: "json",
        required: false,
      }
    ],
    listRule: rule,
    viewRule: rule,
    createRule: rule,
    updateRule: rule,
    deleteRule: rule,
  });
  dao.saveCollection(contractSettings);

  // 4. space_settings
  const spaceSettings = new Collection({
    id: "space_settings_00001",
    name: "space_settings",
    type: "base",
    schema: [
      {
        name: "tenant_id",
        type: "text",
        required: true,
      },
      {
        name: "booking_rules",
        type: "json",
        required: false,
      },
      {
        name: "capacity_limits",
        type: "json",
        required: false,
      }
    ],
    listRule: rule,
    viewRule: rule,
    createRule: rule,
    updateRule: rule,
    deleteRule: rule,
  });
  dao.saveCollection(spaceSettings);

  // 5. notification_settings
  const notificationSettings = new Collection({
    id: "notification_set_01",
    name: "notification_settings",
    type: "base",
    schema: [
      {
        name: "tenant_id",
        type: "text",
        required: true,
      },
      {
        name: "email_templates",
        type: "json",
        required: false,
      },
      {
        name: "webhook_urls",
        type: "json",
        required: false,
      }
    ],
    listRule: rule,
    viewRule: rule,
    createRule: rule,
    updateRule: rule,
    deleteRule: rule,
  });
  dao.saveCollection(notificationSettings);

}, (db) => {
  const dao = new Dao(db);
  const collections = [
    "tenant_settings",
    "billing_settings",
    "contract_settings",
    "space_settings",
    "notification_settings"
  ];
  for (const name of collections) {
    try {
      const collection = dao.findCollectionByNameOrId(name);
      if (collection) {
        dao.deleteCollection(collection);
      }
    } catch (e) {
      // ignore
    }
  }
});
