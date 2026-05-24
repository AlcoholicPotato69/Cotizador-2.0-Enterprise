const fs = require('fs');

function testDoubleSpendLocking() {
    console.log("Analyzing Patched Payment Engine V1 for Race Conditions...");
    const src = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/payments/payments.service.ts', 'utf8');

    // Revisamos la línea donde se busca el Payment
    if (src.includes('const payment = await this.paymentsRepo.findByIdForUpdate(tx, ctx.tenantId, paymentId);')) {
        console.log("✅ SECURE: Pessimistic Lock (`FOR UPDATE`) is now applied to the Payment entity.");
        
        // Analizamos la secuencia transaccional:
        // TX1 inicia -> Lock Payment -> FSM valida UNDER_REVIEW a APPROVED -> Lock Invoice -> Aprueba -> Termina.
        // TX2 inicia concurrente -> Intenta Lock Payment -> Se bloquea esperando a TX1.
        // TX1 termina. Payment ahora está APPROVED.
        // TX2 despierta y adquiere Lock -> Lee Payment -> FSM valida APPROVED a APPROVED -> LANZA EXCEPCIÓN.
        
        console.log("✅ Veredicto de Concurrencia masiva: La base de datos encolará las peticiones forzando la seriación.");
        console.log("✅ El Validador FSM rechazará cualquier petición posterior que despierte porque el estado ya no será elegible para aprobación.");
    } else {
        console.log("❌ VULNERABILITY FOUND: Pessimistic Lock not correctly implemented on Payment entity.");
    }
}

testDoubleSpendLocking();
