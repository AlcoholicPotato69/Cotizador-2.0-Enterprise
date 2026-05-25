async function testLogin() {
  const url = 'http://127.0.0.1:3000/api/v1/auth/login';
  const credentials = {
    email: 'admin_cp@cotizador.com',
    password: 'Password123!', // Using a default guess, we will adjust if needed
  };

  try {
    console.log(`Sending POST to ${url} with email: ${credentials.email}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    console.log('Status Code:', response.status);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }
    console.log('Response Body:', data);
    
    if (response.status === 200) {
      console.log('PASS absoluto (JWT devuelto con 200 OK)');
    } else {
      console.error(`Backend devuelve ${response.status}. Necesita investigación.`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('Network Error or server is down:', error.message);
    process.exit(1);
  }
}

testLogin();
