"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClauseCreatedEvent = exports.TemplateCreatedEvent = void 0;
class TemplateCreatedEvent {
    tenantId;
    templateId;
    timestamp;
    constructor(tenantId, templateId, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.templateId = templateId;
        this.timestamp = timestamp;
    }
}
exports.TemplateCreatedEvent = TemplateCreatedEvent;
class ClauseCreatedEvent {
    tenantId;
    clauseId;
    templateId;
    timestamp;
    constructor(tenantId, clauseId, templateId, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.clauseId = clauseId;
        this.templateId = templateId;
        this.timestamp = timestamp;
    }
}
exports.ClauseCreatedEvent = ClauseCreatedEvent;
//# sourceMappingURL=template.events.js.map