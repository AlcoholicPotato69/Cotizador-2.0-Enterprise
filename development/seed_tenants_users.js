const fs = require('fs');

(async () => {
  try {
    // 1. Auth as SuperUser
    const authRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/auth-with-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: "admin@acme.com", password: "Password123!" })
    });
    const authData = await authRes.json();
    console.log("Auth Data:", authData);
    const token = authData.token;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token
    };

    // 2. Create Tenants
    console.log("Creating Tenants...");
    const pmRes = await fetch("http://127.0.0.1:8090/api/collections/tenants/records", {
      method: "POST", headers, body: JSON.stringify({ name: "Plaza Mayor", slug: "plaza-mayor" })
    });
    const pm = await pmRes.json();
    console.log("PM Tenant:", pm.id || pm.message);

    const cpRes = await fetch("http://127.0.0.1:8090/api/collections/tenants/records", {
      method: "POST", headers, body: JSON.stringify({ name: "Casa de Piedra", slug: "casa-de-piedra" })
    });
    const cp = await cpRes.json();
    console.log("CP Tenant:", cp.id || cp.message);

    const pmId = pm.id || "failed";
    const cpId = cp.id || "failed";

    // 3. Create Users
    console.log("Creating Users...");
    const userPmRes = await fetch("http://127.0.0.1:8090/api/collections/users/records", {
      method: "POST", headers, body: JSON.stringify({ 
        email: "user@plazamayor.com", 
        password: "Password123!", 
        passwordConfirm: "Password123!", 
        name: "Usuario PM",
        tenant_id: pmId 
      })
    });
    const userPm = await userPmRes.json();
    console.log("User PM:", userPm.id || userPm.message);

    const userCpRes = await fetch("http://127.0.0.1:8090/api/collections/users/records", {
      method: "POST", headers, body: JSON.stringify({ 
        email: "user@casadepiedra.com", 
        password: "Password123!", 
        passwordConfirm: "Password123!", 
        name: "Usuario CP",
        tenant_id: cpId 
      })
    });
    const userCp = await userCpRes.json();
    console.log("User CP:", userCp.id || userCp.message);

    fs.writeFileSync("seed_ids.json", JSON.stringify({
      pm: pmId, cp: cpId, userPm: userPm.id, userCp: userCp.id
    }));
    console.log("Seed completed.");
  } catch (err) {
    console.error(err);
  }
})();
