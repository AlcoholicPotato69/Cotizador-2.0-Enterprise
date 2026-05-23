routerAdd("GET", "/api/seed", (e) => {
    try {
        var tenantCollection = $app.findCollectionByNameOrId("tenants");
        var usersCollection = $app.findCollectionByNameOrId("users");

        var pm = new Record(tenantCollection);
        pm.set("name", "Plaza Mayor");
        pm.set("slug", "plaza-mayor");
        $app.save(pm);
        
        var cp = new Record(tenantCollection);
        cp.set("name", "Casa de Piedra");
        cp.set("slug", "casa-de-piedra");
        $app.save(cp);
        
        var userPm = new Record(usersCollection);
        userPm.set("email", "user@plazamayor.com");
        userPm.setPassword("Password123!");
        userPm.set("name", "Usuario PM");
        userPm.set("tenant_id", pm.id);
        $app.save(userPm);
        
        var userCp = new Record(usersCollection);
        userCp.set("email", "user@casadepiedra.com");
        userCp.setPassword("Password123!");
        userCp.set("name", "Usuario CP");
        userCp.set("tenant_id", cp.id);
        $app.save(userCp);
        
        return e.json(200, { pm: pm.id, cp: cp.id, userPm: userPm.id, userCp: userCp.id });
    } catch(err) {
        return e.json(500, { error: err.toString() });
    }
});
