const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { ContractStatus } = require('@prisma/client');
const { FsmValidator } = require('../../../backend/dist/src/common/fsm.validator.js');

test('Signature Eligibility Forgery / Infinite Signatures', () => {
    console.log("Analyzing Signature Eligibility...");
    
    const validator = new FsmValidator();
    
    // Attack 1: Try signing an already SIGNED contract
    try {
        validator.validateSignatureEligibility(ContractStatus.SIGNED);
        console.log("❌ VULNERABILITY FOUND: FSM allowed signature on SIGNED contract.");
    } catch(e) {
        console.log(`✅ SECURE: FSM rejected signature on SIGNED contract (${e.message})`);
    }

    // Attack 2: Try signing an EXPIRED contract
    try {
        validator.validateSignatureEligibility(ContractStatus.EXPIRED);
        console.log("❌ VULNERABILITY FOUND: FSM allowed signature on EXPIRED contract.");
    } catch(e) {
        console.log(`✅ SECURE: FSM rejected signature on EXPIRED contract (${e.message})`);
    }

    // Attack 3: What about ACTIVE? ACTIVE is missing from the blocklist!
    try {
        validator.validateSignatureEligibility(ContractStatus.ACTIVE);
        console.log("❌ VULNERABILITY FOUND: FSM allowed signature on ACTIVE contract.");
        console.log("Wait, is ACTIVE eligible for signature? Usually once it's SIGNED, it becomes ACTIVE. Adding signatures to ACTIVE contracts might break the invariant if not explicitly allowed or blocked.");
    } catch(e) {
        console.log(`✅ SECURE: FSM rejected signature on ACTIVE contract (${e.message})`);
    }

    // Attack 4: What about CANCELLED or REJECTED?
    try {
        validator.validateSignatureEligibility(ContractStatus.CANCELLED);
        console.log("❌ VULNERABILITY FOUND: FSM allowed signature on CANCELLED contract. Infinite signatures possible on dead contracts!");
    } catch(e) {
        console.log(`✅ SECURE: FSM rejected signature on CANCELLED contract (${e.message})`);
    }
    
    try {
        validator.validateSignatureEligibility(ContractStatus.REJECTED);
        console.log("❌ VULNERABILITY FOUND: FSM allowed signature on REJECTED contract.");
    } catch(e) {
        console.log(`✅ SECURE: FSM rejected signature on REJECTED contract (${e.message})`);
    }
});
