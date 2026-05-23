(async () => {
  try {
    const authRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/auth-with-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: "test@test.com", password: "Password123!" })
    });
    
    const token = (await authRes.json()).token;
    
    const createRes = await fetch("http://127.0.0.1:8090/api/collections/users/records", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ email: "newuser2@test.com", password: "Password123!", passwordConfirm: "Password123!", name: "New User 2" })
    });
    console.log("USER STATUS:", createRes.status);
    console.log("USER RESPONSE:", await createRes.text());

  } catch (err) {
    console.error(err);
  }
})();
