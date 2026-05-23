/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  // 1. Colección: event_reservations (Soft Reservation States)
  const reservations = new Collection({
    id: "event_reservations",
    name: "event_reservations",
    type: "base",
    schema: [
      { name: "tenant", type: "relation", required: true, options: { collectionId: "tenants" } },
      { name: "espacio", type: "relation", required: true, options: { collectionId: "espacios" } },
      { name: "cotizacion", type: "relation", required: false, options: { collectionId: "cotizaciones" } },
      { name: "estado", type: "select", required: true, options: { maxSelect: 1, values: ["tentative", "reserved", "contracted", "blocked", "maintenance"] } },
      { name: "fecha_inicio", type: "date", required: true },
      { name: "fecha_fin", type: "date", required: true },
      { name: "mounting_hours", type: "number", required: false },
      { name: "dismantling_hours", type: "number", required: false },
      { name: "is_exclusive", type: "bool", required: true }
    ]
  });
  dao.saveCollection(reservations);

  // 2. Extender tabla de espacios con reglas operativas base (Capacidad)
  const espaciosCollection = dao.findCollectionByNameOrId("espacios");
  
  // Note: Schema.addField requires specific formatted object in older PB versions, or using addField on Schema object.
  espaciosCollection.schema.addField(new SchemaField({
    name: "capacity_min",
    type: "number",
    required: false
  }));
  espaciosCollection.schema.addField(new SchemaField({
    name: "capacity_max",
    type: "number",
    required: false
  }));
  espaciosCollection.schema.addField(new SchemaField({
    name: "allowed_event_types",
    type: "json", // Array of strings e.g. ["Boda", "Congreso"]
    required: false
  }));

  dao.saveCollection(espaciosCollection);

}, (db) => {
  const dao = new Dao(db);
  try {
    const reservations = dao.findCollectionByNameOrId("event_reservations");
    if (reservations) dao.deleteCollection(reservations);
  } catch(e) {}
});
