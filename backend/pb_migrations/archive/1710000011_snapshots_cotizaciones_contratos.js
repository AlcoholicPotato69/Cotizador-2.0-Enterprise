/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // --- 1. Modify Cotizaciones Collection ---
  const cotizacionesCollection = dao.findCollectionByNameOrId("cotizaciones_catalog_0");
  
  if (cotizacionesCollection) {
    // Client Snapshot
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_snap_client", name: "client_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    // Tenant & Branding Snapshot
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_snap_tenant", name: "tenant_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_snap_brand", name: "branding_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    // Eligibility Audit Trail
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_aud_elig", name: "eligibility_audit", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    // Pricing Rules Audit Trail
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_aud_price", name: "pricing_audit", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    // Promotion Engine Audit Trail
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_aud_promo", name: "promotion_audit", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    // Tax Rules Audit Trail
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_aud_tax", name: "tax_audit", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    // Template Snapshot
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_snap_tmpl", name: "template_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));

    dao.saveCollection(cotizacionesCollection);
  }

  // --- 2. Modify Contratos Collection ---
  const contratosCollection = dao.findCollectionByNameOrId("contratos_catalog_00");

  if (contratosCollection) {
    contratosCollection.schema.addField(new SchemaField({
      system: false, id: "ctr_snap_client", name: "client_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    contratosCollection.schema.addField(new SchemaField({
      system: false, id: "ctr_snap_docs", name: "documents_utilized", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    contratosCollection.schema.addField(new SchemaField({
      system: false, id: "ctr_snap_brand", name: "branding_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    contratosCollection.schema.addField(new SchemaField({
      system: false, id: "ctr_snap_clause", name: "clauses_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    contratosCollection.schema.addField(new SchemaField({
      system: false, id: "ctr_snap_tmpl", name: "template_version_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));
    contratosCollection.schema.addField(new SchemaField({
      system: false, id: "ctr_aud_rules", name: "rules_applied_audit", type: "json", required: false, presentable: false, unique: false, options: {}
    }));

    dao.saveCollection(contratosCollection);
  }

}, (db) => {
  const dao = new Dao(db);
  // Rollback logic (Optional but good practice)
  try {
    const cot = dao.findCollectionByNameOrId("cotizaciones_catalog_0");
    cot.schema.removeField("cot_snap_client");
    cot.schema.removeField("cot_snap_tenant");
    cot.schema.removeField("cot_snap_brand");
    cot.schema.removeField("cot_aud_elig");
    cot.schema.removeField("cot_aud_price");
    cot.schema.removeField("cot_aud_promo");
    cot.schema.removeField("cot_aud_tax");
    cot.schema.removeField("cot_snap_tmpl");
    dao.saveCollection(cot);
  } catch (e) {}

  try {
    const ctr = dao.findCollectionByNameOrId("contratos_catalog_00");
    ctr.schema.removeField("ctr_snap_client");
    ctr.schema.removeField("ctr_snap_docs");
    ctr.schema.removeField("ctr_snap_brand");
    ctr.schema.removeField("ctr_snap_clause");
    ctr.schema.removeField("ctr_snap_tmpl");
    ctr.schema.removeField("ctr_aud_rules");
    dao.saveCollection(ctr);
  } catch (e) {}
});
