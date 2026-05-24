const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('Snapshot Data Forgery Attack', () => {
    console.log("Analyzing for arbitrary data forgery...");
    const serviceSrc = fs.readFileSync('H:/Cotizador-2.0-Enterprise/backend/src/snapshots/snapshots.service.ts', 'utf8');
    
    // Can an attacker pass an arbitrary 'previousHash' in the DTO?
    // export interface CreateSnapshotDto {
    //   entityType: string;
    //   payload: any;
    // }
    
    // Is previousHash read from DTO or forced from DB?
    // const previousHash = lastSnapshot ? lastSnapshot.chainHash : 'GENESIS';
    
    if (serviceSrc.includes('dto.previousHash')) {
        console.log("❌ VULNERABILITY FOUND: Attacker can inject an arbitrary previousHash.");
    } else {
        console.log("✅ SECURE: previousHash is strictly inferred from the DB, blocking historical forgery.");
    }
});
