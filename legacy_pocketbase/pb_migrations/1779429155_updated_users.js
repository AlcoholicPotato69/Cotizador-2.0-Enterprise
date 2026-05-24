/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "tenants00000000",
    "help": "",
    "hidden": false,
    "id": "relation2419269930",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "roles0000000000",
    "help": "",
    "hidden": false,
    "id": "relation3590529708",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "role_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "json3889755919",
    "maxSize": 0,
    "name": "effective_permissions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("relation2419269930")

  // remove field
  collection.fields.removeById("relation3590529708")

  // remove field
  collection.fields.removeById("json3889755919")

  return app.save(collection)
})
