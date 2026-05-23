(async () => {
  try {
    // 1. Auth as the superuser I created
    const authRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/auth-with-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: "test@test.com", password: "Password123!" })
    });
    
    if (!authRes.ok) {
      console.log("AUTH FAILED", authRes.status, await authRes.text());
      return;
    }
    const authData = await authRes.json();
    const token = authData.token;
    console.log("Got superuser token");

    // 2. Try to create a new superuser with short password (causes 400)
    const createRes1 = await fetch("http://127.0.0.1:8090/api/collections/_superusers/records", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ email: "test2@test.com", password: "short", passwordConfirm: "short" })
    });
    console.log("CREATE SHORT PASS STATUS:", createRes1.status);
    console.log("CREATE SHORT PASS RESPONSE:", await createRes1.text());

    // 3. Try to create a new superuser with valid password
    const createRes2 = await fetch("http://127.0.0.1:8090/api/collections/_superusers/records", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ email: "test4@test.com", password: "Password123!", passwordConfirm: "Password123!" })
    });
    console.log("CREATE VALID PASS STATUS:", createRes2.status);
    console.log("CREATE VALID PASS RESPONSE:", await createRes2.text());

  } catch (err) {
    console.error(err);
  }
})();
