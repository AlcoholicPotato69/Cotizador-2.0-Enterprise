/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931")

  // add field
  collection.fields.addAt(15, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1836797931",
    "help": "",
    "hidden": false,
    "id": "relation1314583181",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent_contract_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "help": "",
    "hidden": false,
    "id": "number58751829",
    "max": null,
    "min": null,
    "name": "renewal_number",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(7, new Field({
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
      "draft",
      "pending_signature",
      "signed",
      "active",
      "suspended",
      "terminated",
      "expired",
      "archived"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931")

  // remove field
  collection.fields.removeById("relation1314583181")

  // remove field
  collection.fields.removeById("number58751829")

  // update field
  collection.fields.addAt(7, new Field({
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
      "draft",
      "active",
      "suspended",
      "terminated",
      "expired"
    ]
  }))

  return app.save(collection)
})
