const { test } = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const fs = require('fs');

test('Snapshot Race Condition Fork Attack', () => {
    console.log("Analyzing concurrency logic in Snapshots Engine...");
    
    // El objetivo es ver si el servicio maneja transacciones en bloque (Transaction Isolation) o locks, 
    // para evitar un Fork en la Hash Chain por lecturas y escrituras simultáneas (Race Conditions).

    const serviceSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/snapshots/snapshots.service.ts', 'utf8');
    const repoSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/snapshots/snapshots.repository.ts', 'utf8');
    const schemaSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/prisma/schema.prisma', 'utf8');

    // Analizamos cómo leen el último snapshot:
    // const lastSnapshot = await this.repo.findLatestByType(dto.entityType, ctx.tenantId);
    // snapshot = await this.repo.create({ ... })
    
    // Si no hay un Lock o Transacción, dos peticiones concurrentes leen el mismo `lastSnapshot` (Ej. A)
    // Petición 1 crea B1 usando A como `previous_hash`
    // Petición 2 crea B2 usando A como `previous_hash`
    
    // Prisma nos protege de esto si hay una constraint @unique. Revisemos Prisma.
    // model Snapshot {
    //   ...
    //   @@unique([tenantId, entityType, previousHash])
    // }
    
    if (schemaSrc.includes('@@unique([tenantId, entityType, previousHash])')) {
        console.log("✅ SECURE: Prisma schema enforces @@unique([tenantId, entityType, previousHash]).");
        console.log("This prevents Hash Chain Forks at the Database level (P2002 error will be thrown).");
    } else {
        console.log("❌ VULNERABILITY FOUND: No Unique Constraint on previousHash per entity/tenant.");
        console.log("A Race Condition could lead to a Forked Hash Chain!");
    }
    
    // Pero espera, ¿Qué pasa si el `previousHash` es NULL o Genesis?
    // constraint: @@unique([tenantId, entityType, previousHash]) -> Prisma ignora NULLs en constraints únicas.
    // Si múltiples request iniciales envían el primer snapshot concurrentemente, `previousHash` puede ser NULL?
    // Veamos el service: const previousHash = lastSnapshot ? lastSnapshot.chainHash : 'GENESIS';
    // Oh, es 'GENESIS'. Entonces Prisma SI lo bloqueará porque no es NULL.

    // Aún así, un atacante podría intentar explotar el campo 'version'. 
    if (schemaSrc.includes('@@unique([tenantId, entityType, version])')) {
         console.log("✅ SECURE: Prisma schema enforces @@unique([tenantId, entityType, version]).");
    } else {
         console.log("❌ VULNERABILITY FOUND: No Unique Constraint on version per entity/tenant.");
         console.log("An attacker could cause two snapshots to have the SAME version number if the previousHash fork is bypassed (e.g. they target different entity types but we want to break versions). Wait, different entity types is fine.");
    }
});
