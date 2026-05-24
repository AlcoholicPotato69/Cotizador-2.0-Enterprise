/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3332084752")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "number3206337475",
    "max": null,
    "min": null,
    "name": "version",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1980558891",
    "max": 0,
    "min": 0,
    "name": "document_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2127300164",
    "max": 0,
    "min": 0,
    "name": "previous_document_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1066060456",
    "max": 0,
    "min": 0,
    "name": "hash_algorithm",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "date3784584156",
    "max": "",
    "min": "",
    "name": "hash_created_at",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 1,
    "maxSize": 5242880,
    "mimeTypes": [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/xml"
    ],
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3332084752")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    "deleteRule": null,
    "listRule": "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    "updateRule": "@request.auth.id != '' && @request.auth.tenant_id = tenant_id",
    "viewRule": "@request.auth.id != '' && @request.auth.tenant_id = tenant_id"
  }, collection)

  // remove field
  collection.fields.removeById("text1579384326")

  // remove field
  collection.fields.removeById("number3206337475")

  // remove field
  collection.fields.removeById("text1980558891")

  // remove field
  collection.fields.removeById("text2127300164")

  // remove field
  collection.fields.removeById("text1066060456")

  // remove field
  collection.fields.removeById("date3784584156")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 1,
    "maxSize": 52428800,
    "mimeTypes": [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/xml"
    ],
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
})
