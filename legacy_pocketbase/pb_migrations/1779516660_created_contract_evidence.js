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
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select39938480",
        "maxSelect": 1,
        "name": "evidence_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "signed_pdf",
          "signed_scan",
          "manual_signature",
          "docusign_certificate",
          "email_acceptance",
          "payment_receipt",
          "identity_document",
          "other"
        ]
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2479585644",
        "max": 0,
        "min": 0,
        "name": "file_id",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3518522040",
        "max": 0,
        "min": 0,
        "name": "hash",
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
        "id": "json2965721996",
        "maxSize": 0,
        "name": "metadata_json",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation3823579430",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "uploaded_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date3061522008",
        "max": "",
        "min": "",
        "name": "uploaded_at",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      }
    ],
    "id": "pbc_68834558",
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "name": "contract_evidence",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_68834558");

  return app.delete(collection);
})
