/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_680708594")

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "tenants00000000",
    "help": "",
    "hidden": false,
    "id": "relation2419269930",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "date1016636710",
    "max": "",
    "min": "",
    "name": "effective_from",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "date229069638",
    "max": "",
    "min": "",
    "name": "effective_until",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_680708594")

  // remove field
  collection.fields.removeById("relation2419269930")

  // remove field
  collection.fields.removeById("date1016636710")

  // remove field
  collection.fields.removeById("date229069638")

  return app.save(collection)
})
