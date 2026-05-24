/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_68834558")

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1047059764",
    "max": 0,
    "min": 0,
    "name": "evidence_source",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1428685726",
    "max": 0,
    "min": 0,
    "name": "retention_policy",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "date3499738788",
    "max": "",
    "min": "",
    "name": "retention_until",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text284544841",
    "max": 0,
    "min": 0,
    "name": "verification_status",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1317835199",
    "max": 0,
    "min": 0,
    "name": "verification_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1843937505",
    "max": 0,
    "min": 0,
    "name": "signed_document_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "help": "",
    "hidden": false,
    "id": "file3437059168",
    "maxSelect": 1,
    "maxSize": 5242880,
    "mimeTypes": null,
    "name": "signature_certificate",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2526004592",
    "max": 0,
    "min": 0,
    "name": "signature_provider_version",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "help": "",
    "hidden": false,
    "id": "json583178269",
    "maxSize": 0,
    "name": "signature_completion_evidence",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2404520986",
    "max": 0,
    "min": 0,
    "name": "signer_ip",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2477401908",
    "max": 0,
    "min": 0,
    "name": "signer_user_agent",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text968197730",
    "max": 0,
    "min": 0,
    "name": "provider_event_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text4132382105",
    "max": 0,
    "min": 0,
    "name": "provider_trace_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(23, new Field({
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
  collection.fields.addAt(24, new Field({
    "help": "",
    "hidden": false,
    "id": "json2993998002",
    "maxSize": 0,
    "name": "provider_payload",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_68834558")

  // remove field
  collection.fields.removeById("text1047059764")

  // remove field
  collection.fields.removeById("text1428685726")

  // remove field
  collection.fields.removeById("date3499738788")

  // remove field
  collection.fields.removeById("text284544841")

  // remove field
  collection.fields.removeById("text1317835199")

  // remove field
  collection.fields.removeById("text1843937505")

  // remove field
  collection.fields.removeById("file3437059168")

  // remove field
  collection.fields.removeById("text2526004592")

  // remove field
  collection.fields.removeById("json583178269")

  // remove field
  collection.fields.removeById("text2404520986")

  // remove field
  collection.fields.removeById("text2477401908")

  // remove field
  collection.fields.removeById("text968197730")

  // remove field
  collection.fields.removeById("text4132382105")

  // remove field
  collection.fields.removeById("text2383470432")

  // remove field
  collection.fields.removeById("json2993998002")

  return app.save(collection)
})
