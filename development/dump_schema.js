const fs = require('fs');

(async () => {
  try {
    const res = await fetch("http://127.0.0.1:8090/api/dump_schema");
    const data = await res.json();
    fs.writeFileSync('schema_dump.json', JSON.stringify(data, null, 2));
    console.log("Schema dumped to schema_dump.json");
  } catch (err) {
    console.error(err);
  }
})();
