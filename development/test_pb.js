(async () => {
  try {
    const res = await fetch("http://127.0.0.1:8090/api/collections/_superusers/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "Password123!", passwordConfirm: "Password123!" })
    });
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", await res.text());
  } catch (err) {
    console.error(err);
  }
})();
