(async () => {
  try {
    const authRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/auth-with-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: "test@test.com", password: "Password123!" })
    });
    
    const authData = await authRes.json();
    const token = authData.token;
    
    // Test without passwordConfirm
    const createRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/records", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ email: "test4@test.com", password: "Password123!" })
    });
    console.log("CREATE WITHOUT CONFIRM STATUS:", createRes.status);
    console.log("CREATE WITHOUT CONFIRM RESPONSE:", await createRes.text());

  } catch (err) {
    console.error(err);
  }
})();
