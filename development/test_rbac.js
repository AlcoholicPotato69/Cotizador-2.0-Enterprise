(async () => {
  try {
    const authRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/auth-with-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: "test@test.com", password: "Password123!" })
    });
    const token = (await authRes.json()).token;
    
    // INTENTO DE CREAR QUOTE SIN TENANT
    const createRes = await fetch(`http://127.0.0.1:8090/api/collections/quotes/records`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ "name": "Hack Attempt" })
    });
    console.log("QUOTES CREATE (NO TENANT) STATUS:", createRes.status);
    console.log("QUOTES CREATE (NO TENANT) RESPONSE:", await createRes.text());

  } catch (err) {
    console.error(err);
  }
})();
