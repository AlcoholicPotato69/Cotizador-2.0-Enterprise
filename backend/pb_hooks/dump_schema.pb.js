routerAdd("GET", "/api/dump_schema", (c) => {
    try {
        var collections = $app.findAllCollections();
        var data = [];
        for (var i = 0; i < collections.length; i++) {
            data.push(JSON.parse(JSON.stringify(collections[i])));
        }
        return c.json(200, data);
    } catch (err) {
        return c.json(500, { error: err.toString() });
    }
});
