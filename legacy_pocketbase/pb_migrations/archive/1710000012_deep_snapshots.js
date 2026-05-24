/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const cotizacionesCollection = dao.findCollectionByNameOrId("cotizaciones_catalog_0");
  
  if (cotizacionesCollection) {
    // We already added client, tenant, branding, template snapshot.
    // Now we add space_snapshot, and rename the audit fields to _snapshot to standardize.
    
    // Add Space Snapshot
    cotizacionesCollection.schema.addField(new SchemaField({
      system: false, id: "cot_snap_space", name: "space_snapshot", type: "json", required: false, presentable: false, unique: false, options: {}
    }));

    // Rename Audit Fields to Snapshot to match the Domain Model
    try { cotizacionesCollection.schema.getFieldByName("eligibility_audit").name = "eligibility_snapshot"; } catch(e){}
    try { cotizacionesCollection.schema.getFieldByName("pricing_audit").name = "pricing_snapshot"; } catch(e){}
    try { cotizacionesCollection.schema.getFieldByName("promotion_audit").name = "promotion_snapshot"; } catch(e){}
    try { cotizacionesCollection.schema.getFieldByName("tax_audit").name = "tax_snapshot"; } catch(e){}

    dao.saveCollection(cotizacionesCollection);
  }

}, (db) => {
  const dao = new Dao(db);
  const cotizacionesCollection = dao.findCollectionByNameOrId("cotizaciones_catalog_0");
  if(cotizacionesCollection) {
    cotizacionesCollection.schema.removeField("cot_snap_space");
    
    try { cotizacionesCollection.schema.getFieldByName("eligibility_snapshot").name = "eligibility_audit"; } catch(e){}
    try { cotizacionesCollection.schema.getFieldByName("pricing_snapshot").name = "pricing_audit"; } catch(e){}
    try { cotizacionesCollection.schema.getFieldByName("promotion_snapshot").name = "promotion_audit"; } catch(e){}
    try { cotizacionesCollection.schema.getFieldByName("tax_snapshot").name = "tax_audit"; } catch(e){}
    
    dao.saveCollection(cotizacionesCollection);
  }
});
