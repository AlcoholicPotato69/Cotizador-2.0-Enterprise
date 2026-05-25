"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulationAcceptedEvent = exports.RegulationCreatedEvent = void 0;
class RegulationCreatedEvent {
    tenantId;
    regulationId;
    timestamp;
    constructor(tenantId, regulationId, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.regulationId = regulationId;
        this.timestamp = timestamp;
    }
}
exports.RegulationCreatedEvent = RegulationCreatedEvent;
class RegulationAcceptedEvent {
    tenantId;
    acceptanceId;
    regulationId;
    acceptedBy;
    timestamp;
    constructor(tenantId, acceptanceId, regulationId, acceptedBy, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.acceptanceId = acceptanceId;
        this.regulationId = regulationId;
        this.acceptedBy = acceptedBy;
        this.timestamp = timestamp;
    }
}
exports.RegulationAcceptedEvent = RegulationAcceptedEvent;
//# sourceMappingURL=regulation.events.js.map