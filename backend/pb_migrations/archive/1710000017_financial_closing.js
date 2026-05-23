/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // 1. Añadir Permisos Financieros Granulares a rbac_permissions
  const permissionsToAdd = [
    { key: "payments.read", module: "financial", name: "Ver Pagos", description: "Visualizar transacciones de pago" },
    { key: "payments.manage", module: "financial", name: "Gestionar Pagos", description: "Registrar y aplicar pagos a contratos" },
    { key: "receipts.read", module: "financial", name: "Ver Recibos", description: "Visualizar recibos de pago" },
    { key: "receipts.manage", module: "financial", name: "Gestionar Recibos", description: "Generar recibos inmutables" },
    { key: "invoices.read", module: "financial", name: "Ver Facturas", description: "Visualizar facturas CFDI" },
    { key: "invoices.manage", module: "financial", name: "Gestionar Facturación", description: "Emitir o validar facturas CFDI" },
    { key: "financial.audit", module: "financial", name: "Auditoría Financiera", description: "Ver logs de validación y auditoría" },
    { key: "financial.reconcile", module: "financial", name: "Conciliación", description: "Modificar estados de conciliación" }
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

  // 2. Contracts (Hub Financiero)
  const contracts = new Collection({
    id: "contracts_registry",
    name: "contracts",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "cotizacion", type: "relation", required: true, options: { collectionId: "cotizaciones", maxSelect: 1 } },
      { name: "oper_status", type: "select", required: true, options: { maxSelect: 1, values: ["draft", "approved", "signed", "active", "completed", "closed", "cancelled"] } },
      { name: "fin_status", type: "select", required: true, options: { maxSelect: 1, values: ["pending", "partial", "paid", "overdue", "refunded"] } },
      
      // El Mega Snapshot (Deep JSON)
      { name: "contract_snapshot", type: "json", required: false },
      { name: "client_snapshot", type: "json", required: false },
      { name: "tenant_snapshot", type: "json", required: false },
      { name: "quote_snapshot", type: "json", required: false },
      { name: "pricing_snapshot", type: "json", required: false },
      { name: "promotion_snapshot", type: "json", required: false },
      { name: "tax_snapshot", type: "json", required: false },
      { name: "branding_snapshot", type: "json", required: false },
      { name: "template_snapshot", type: "json", required: false },
      { name: "financial_snapshot", type: "json", required: false },
      { name: "payment_schedule_snapshot", type: "json", required: false }
    ]
  });
  dao.saveCollection(contracts);

  // 3. Financial Events (Polymorphic: Pagos, Recibos, Facturas, Notas de Crédito, Ajustes, Reembolsos)
  const financialEvents = new Collection({
    id: "financial_events_col",
    name: "financial_events",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "contract", type: "relation", required: true, options: { collectionId: "contracts_registry", maxSelect: 1 } },
      { name: "event_type", type: "select", required: true, options: { maxSelect: 1, values: ["payment", "receipt", "invoice", "refund", "credit_note", "adjustment", "cancellation"] } },
      { name: "amount", type: "number", required: true },
      { name: "currency", type: "text", required: true },
      { name: "reconciliation_status", type: "select", required: true, options: { maxSelect: 1, values: ["pending", "matched", "mismatch", "manually_approved"] } },
      { name: "snapshot", type: "json", required: false }, // payment_snapshot, invoice_snapshot, receipt_snapshot
      { name: "metadata", type: "json", required: false } // CFDI UUID, Folios, etc.
    ]
  });
  dao.saveCollection(financialEvents);

  // 4. CFDI Validation Log
  const cfdiValidationLog = new Collection({
    id: "cfdi_validation_logs",
    name: "cfdi_validation_log",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "uuid", type: "text", required: false },
      { name: "rfc", type: "text", required: false },
      { name: "subtotal", type: "number", required: false },
      { name: "iva", type: "number", required: false },
      { name: "total", type: "number", required: false },
      { name: "resultado", type: "select", required: true, options: { maxSelect: 1, values: ["success", "error", "mismatch", "rejected"] } },
      { name: "details", type: "json", required: false }
    ]
  });
  dao.saveCollection(cfdiValidationLog);

  // 5. Financial Audit Log
  const financialAuditLog = new Collection({
    id: "financial_audit_logs",
    name: "financial_audit_log",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants", maxSelect: 1 } },
      { name: "contract", type: "relation", required: false, options: { collectionId: "contracts_registry", maxSelect: 1 } },
      { name: "user", type: "text", required: true }, // We use text ID to avoid hard dependency on users table if unlinked
      { name: "action", type: "text", required: true },
      { name: "amount", type: "number", required: false },
      { name: "resultado", type: "text", required: true }
    ]
  });
  dao.saveCollection(financialAuditLog);

}, (db) => {
  const dao = new Dao(db);
  try {
    const audit = dao.findCollectionByNameOrId("financial_audit_log");
    if (audit) dao.deleteCollection(audit);
    
    const cfdi = dao.findCollectionByNameOrId("cfdi_validation_log");
    if (cfdi) dao.deleteCollection(cfdi);
    
    const events = dao.findCollectionByNameOrId("financial_events");
    if (events) dao.deleteCollection(events);
    
    const contracts = dao.findCollectionByNameOrId("contracts");
    if (contracts) dao.deleteCollection(contracts);
  } catch(e) {}
});
