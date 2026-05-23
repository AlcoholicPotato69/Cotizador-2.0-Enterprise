/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
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
      },
      {
        "cascadeDelete": false,
        "collectionId": "clientes0000000",
        "help": "",
        "hidden": false,
        "id": "relation434858273",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "client_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2527524235",
        "help": "",
        "hidden": false,
        "id": "relation3682619768",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "quote_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3557662164",
        "help": "",
        "hidden": false,
        "id": "relation1822399256",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "source_quote_version_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text109323943",
        "max": 0,
        "min": 0,
        "name": "source_snapshot_hash",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2615807174",
        "max": 0,
        "min": 0,
        "name": "folio",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
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
      },
      {
        "help": "",
        "hidden": false,
        "id": "select2268183186",
        "maxSelect": 1,
        "name": "signature_status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "pending",
          "signed",
          "rejected",
          "expired"
        ]
      },
      {
        "help": "",
        "hidden": false,
        "id": "date898912840",
        "max": "",
        "min": "",
        "name": "signed_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation1611169078",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "signed_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date2077745078",
        "max": "",
        "min": "",
        "name": "valid_from",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date4260335480",
        "max": "",
        "min": "",
        "name": "valid_until",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation3725765462",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "created_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "number353457734",
        "max": null,
        "min": null,
        "name": "current_version",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_1836797931",
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "name": "contracts",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931");

  return app.delete(collection);
})
