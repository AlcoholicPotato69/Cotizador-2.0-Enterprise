/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931")

  // add field
  collection.fields.addAt(17, new Field({
    "help": "",
    "hidden": false,
    "id": "select3836418369",
    "maxSelect": 1,
    "name": "contract_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "lease",
      "temporary_space",
      "event",
      "advertising",
      "sponsorship",
      "other"
    ]
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_680708594",
    "help": "",
    "hidden": false,
    "id": "relation98176952",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "template_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2347586667",
    "max": 0,
    "min": 0,
    "name": "template_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "help": "",
    "hidden": false,
    "id": "number3970214138",
    "max": null,
    "min": null,
    "name": "template_version",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text74860757",
    "max": 0,
    "min": 0,
    "name": "template_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1836797931",
    "help": "",
    "hidden": false,
    "id": "relation47309552",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "root_contract_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1836797931",
    "help": "",
    "hidden": false,
    "id": "relation1778819408",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "renewed_from_contract_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(24, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2930306061",
    "max": 0,
    "min": 0,
    "name": "renewal_reason",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(25, new Field({
    "help": "",
    "hidden": false,
    "id": "select2823213952",
    "maxSelect": 1,
    "name": "renewal_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "exact_clone",
      "administrative",
      "commercial",
      "full_reissue"
    ]
  }))

  // add field
  collection.fields.addAt(26, new Field({
    "help": "",
    "hidden": false,
    "id": "select3361929843",
    "maxSelect": 1,
    "name": "signature_mode",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "manual",
      "electronic",
      "hybrid"
    ]
  }))

  // add field
  collection.fields.addAt(27, new Field({
    "help": "",
    "hidden": false,
    "id": "select564720941",
    "maxSelect": 1,
    "name": "signature_provider",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "manual",
      "docusign",
      "adobe_sign",
      "dropbox_sign",
      "internal"
    ]
  }))

  // add field
  collection.fields.addAt(28, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3145445925",
    "max": 0,
    "min": 0,
    "name": "signature_request_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(29, new Field({
    "help": "",
    "hidden": false,
    "id": "date2404931946",
    "max": "",
    "min": "",
    "name": "signature_completed_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(30, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2383470432",
    "max": 0,
    "min": 0,
    "name": "signature_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(31, new Field({
    "help": "",
    "hidden": false,
    "id": "json3681899760",
    "maxSize": 0,
    "name": "signature_metadata_json",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(32, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text489693434",
    "max": 0,
    "min": 0,
    "name": "signed_document_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(33, new Field({
    "help": "",
    "hidden": false,
    "id": "json1754849572",
    "maxSize": 0,
    "name": "billing_profile_json",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(34, new Field({
    "help": "",
    "hidden": false,
    "id": "bool850518960",
    "name": "legal_hold",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(35, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text95115405",
    "max": 0,
    "min": 0,
    "name": "legal_hold_reason",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(36, new Field({
    "help": "",
    "hidden": false,
    "id": "date4083956863",
    "max": "",
    "min": "",
    "name": "legal_hold_created_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(37, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "relation2800751361",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "legal_hold_created_by",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
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
      "expiring",
      "expired",
      "renewal_pending",
      "renewed",
      "terminated",
      "archived"
    ]
  }))

  // update field
  collection.fields.addAt(8, new Field({
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
      "unsigned",
      "pending",
      "sent",
      "viewed",
      "signed",
      "rejected",
      "expired",
      "cancelled"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931")

  // remove field
  collection.fields.removeById("select3836418369")

  // remove field
  collection.fields.removeById("relation98176952")

  // remove field
  collection.fields.removeById("text2347586667")

  // remove field
  collection.fields.removeById("number3970214138")

  // remove field
  collection.fields.removeById("text74860757")

  // remove field
  collection.fields.removeById("relation47309552")

  // remove field
  collection.fields.removeById("relation1778819408")

  // remove field
  collection.fields.removeById("text2930306061")

  // remove field
  collection.fields.removeById("select2823213952")

  // remove field
  collection.fields.removeById("select3361929843")

  // remove field
  collection.fields.removeById("select564720941")

  // remove field
  collection.fields.removeById("text3145445925")

  // remove field
  collection.fields.removeById("date2404931946")

  // remove field
  collection.fields.removeById("text2383470432")

  // remove field
  collection.fields.removeById("json3681899760")

  // remove field
  collection.fields.removeById("text489693434")

  // remove field
  collection.fields.removeById("json1754849572")

  // remove field
  collection.fields.removeById("bool850518960")

  // remove field
  collection.fields.removeById("text95115405")

  // remove field
  collection.fields.removeById("date4083956863")

  // remove field
  collection.fields.removeById("relation2800751361")

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

  // update field
  collection.fields.addAt(8, new Field({
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
  }))

  return app.save(collection)
})
