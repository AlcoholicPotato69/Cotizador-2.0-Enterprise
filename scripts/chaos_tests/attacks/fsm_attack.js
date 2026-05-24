const { test } = require('node:test');
const assert = require('node:assert');
const { FsmValidator } = require('../../../backend/dist/src/common/fsm.validator.js');
const { QuoteStatus } = require('@prisma/client');

test('FSM Validator Regresion Attack', () => {
    const validator = new FsmValidator();
    
    console.log("Attempting to transition from APPROVED to DRAFT...");
    
    try {
        validator.validateTransition('Quote', QuoteStatus.APPROVED, QuoteStatus.DRAFT);
        console.log("❌ VULNERABILITY FOUND: FSM allowed backward transition (Regresion de estado)");
    } catch(err) {
        console.log(`✅ SECURE: FSM rejected backward transition (${err.message})`);
    }
});
