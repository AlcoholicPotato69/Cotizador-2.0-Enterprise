routerAdd("GET", "/verify_hash/:id", (c) => {
    const id = c.pathParam("id");
    const record = $app.findRecordById("quote_versions", id);
    const snapshotData = record.get("snapshot_data");
    const payloadString = JSON.stringify(snapshotData);
    
    const auditUtil = require(`${__hooks}/utils/audit.js`);
    const recalculatedHash = auditUtil.sha256(payloadString);
    
    return c.json(200, {
        id: id,
        stored_hash: record.get("snapshot_hash"),
        recalculated_hash: recalculatedHash,
        match: record.get("snapshot_hash") === recalculatedHash
    });
});
