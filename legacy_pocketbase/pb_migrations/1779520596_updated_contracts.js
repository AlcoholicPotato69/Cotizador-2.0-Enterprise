/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931")

  // add field
  collection.fields.addAt(38, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2865822233",
    "max": 0,
    "min": 0,
    "name": "contract_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(39, new Field({
    "help": "",
    "hidden": false,
    "id": "number3556195679",
    "max": null,
    "min": null,
    "name": "contract_year",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(40, new Field({
    "help": "",
    "hidden": false,
    "id": "number3341929684",
    "max": null,
    "min": null,
    "name": "contract_sequence",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(41, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2951832515",
    "max": 0,
    "min": 0,
    "name": "contract_prefix",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(42, new Field({
    "help": "",
    "hidden": false,
    "id": "number1101321944",
    "max": null,
    "min": null,
    "name": "contract_term_days",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(43, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text467112412",
    "max": 0,
    "min": 0,
    "name": "template_name_snapshot",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(44, new Field({
    "help": "",
    "hidden": false,
    "id": "number2862598636",
    "max": null,
    "min": null,
    "name": "template_version_snapshot",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(45, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2991336060",
    "max": 0,
    "min": 0,
    "name": "template_hash_snapshot",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(46, new Field({
    "help": "",
    "hidden": false,
    "id": "date1626992021",
    "max": "",
    "min": "",
    "name": "template_effective_date_snapshot",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(47, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2922718532",
    "max": 0,
    "min": 0,
    "name": "renewal_notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(48, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1845047215",
    "max": 0,
    "min": 0,
    "name": "renewal_trigger",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(49, new Field({
    "help": "",
    "hidden": false,
    "id": "number1742330115",
    "max": null,
    "min": null,
    "name": "renewal_chain_depth",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(50, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3313984461",
    "max": 0,
    "min": 0,
    "name": "generated_from_quote_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(51, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2564040797",
    "max": 0,
    "min": 0,
    "name": "generated_from_quote_version_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(52, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2430822865",
    "max": 0,
    "min": 0,
    "name": "generated_from_snapshot_hash",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(53, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1881482888",
    "max": 0,
    "min": 0,
    "name": "generated_by",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(54, new Field({
    "help": "",
    "hidden": false,
    "id": "date632883702",
    "max": "",
    "min": "",
    "name": "generated_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(55, new Field({
    "help": "",
    "hidden": false,
    "id": "bool76220677",
    "name": "provider_error",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(56, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text383037724",
    "max": 0,
    "min": 0,
    "name": "provider_error_code",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(57, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2658850926",
    "max": 0,
    "min": 0,
    "name": "provider_error_message",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(58, new Field({
    "help": "",
    "hidden": false,
    "id": "json1983472914",
    "maxSize": 0,
    "name": "provider_response",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1836797931")

  // remove field
  collection.fields.removeById("text2865822233")

  // remove field
  collection.fields.removeById("number3556195679")

  // remove field
  collection.fields.removeById("number3341929684")

  // remove field
  collection.fields.removeById("text2951832515")

  // remove field
  collection.fields.removeById("number1101321944")

  // remove field
  collection.fields.removeById("text467112412")

  // remove field
  collection.fields.removeById("number2862598636")

  // remove field
  collection.fields.removeById("text2991336060")

  // remove field
  collection.fields.removeById("date1626992021")

  // remove field
  collection.fields.removeById("text2922718532")

  // remove field
  collection.fields.removeById("text1845047215")

  // remove field
  collection.fields.removeById("number1742330115")

  // remove field
  collection.fields.removeById("text3313984461")

  // remove field
  collection.fields.removeById("text2564040797")

  // remove field
  collection.fields.removeById("text2430822865")

  // remove field
  collection.fields.removeById("text1881482888")

  // remove field
  collection.fields.removeById("date632883702")

  // remove field
  collection.fields.removeById("bool76220677")

  // remove field
  collection.fields.removeById("text383037724")

  // remove field
  collection.fields.removeById("text2658850926")

  // remove field
  collection.fields.removeById("json1983472914")

  return app.save(collection)
})
