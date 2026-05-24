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
        "collectionId": "pbc_1836797931",
        "help": "",
        "hidden": false,
        "id": "relation628547837",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "contract_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_296174396",
        "help": "",
        "hidden": false,
        "id": "relation1392346668",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "contract_version_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text580464630",
        "max": 0,
        "min": 0,
        "name": "pdf_hash",
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
        "id": "file2143189854",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": null,
        "name": "pdf_file",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": null,
        "type": "file"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date632883702",
        "max": "",
        "min": "",
        "name": "generated_at",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation1881482888",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "generated_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json243531772",
        "maxSize": 0,
        "name": "generation_metadata_json",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_2119140290",
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "name": "contract_pdfs",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2119140290");

  return app.delete(collection);
})
