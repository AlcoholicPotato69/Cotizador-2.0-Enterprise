/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1044947699")

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
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2212337748",
    "max": 0,
    "min": 0,
    "name": "participant_role",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2325179448",
    "max": 0,
    "min": 0,
    "name": "participant_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "email640144845",
    "name": "participant_email",
    "onlyDomains": null,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "email"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "viewed",
      "signed",
      "rejected",
      "expired",
      "cancelled",
      "delegated"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1044947699")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": "@request.auth.id != ''",
    "updateRule": null,
    "viewRule": "@request.auth.id != ''"
  }, collection)

  // remove field
  collection.fields.removeById("relation2419269930")

  // remove field
  collection.fields.removeById("text2212337748")

  // remove field
  collection.fields.removeById("text2325179448")

  // remove field
  collection.fields.removeById("email640144845")

  // update field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "viewed",
      "signed",
      "rejected"
    ]
  }))

  return app.save(collection)
})
