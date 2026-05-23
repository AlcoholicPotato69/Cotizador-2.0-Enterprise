(async () => {
  try {
    const authRes = await fetch("http://127.0.0.1:8090/api/collections/_superusers/auth-with-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: "test@test.com", password: "Password123!" })
    });
    
    const token = (await authRes.json()).token;
    const userId = "6atu6fpvrgkvljo";
    
    // UPDATE
    const updateRes = await fetch(`http://127.0.0.1:8090/api/collections/users/records/${userId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token 
      },
      body: JSON.stringify({ name: "Updated Name" })
    });
    console.log("UPDATE STATUS:", updateRes.status);
    
    // DELETE
    const deleteRes = await fetch(`http://127.0.0.1:8090/api/collections/users/records/${userId}`, {
      method: "DELETE",
      headers: { 
        "Authorization": token 
      }
    });
    console.log("DELETE STATUS:", deleteRes.status);

  } catch (err) {
    console.error(err);
  }
})();
