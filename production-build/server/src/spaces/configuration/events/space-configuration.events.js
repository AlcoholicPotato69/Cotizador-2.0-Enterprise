"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceRuleCreatedEvent = exports.SpaceConfigurationUpdatedEvent = void 0;
class SpaceConfigurationUpdatedEvent {
    tenantId;
    spaceId;
    configKey;
    timestamp;
    constructor(tenantId, spaceId, configKey, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.spaceId = spaceId;
        this.configKey = configKey;
        this.timestamp = timestamp;
    }
}
exports.SpaceConfigurationUpdatedEvent = SpaceConfigurationUpdatedEvent;
class SpaceRuleCreatedEvent {
    tenantId;
    spaceId;
    ruleId;
    ruleType;
    timestamp;
    constructor(tenantId, spaceId, ruleId, ruleType, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.spaceId = spaceId;
        this.ruleId = ruleId;
        this.ruleType = ruleType;
        this.timestamp = timestamp;
    }
}
exports.SpaceRuleCreatedEvent = SpaceRuleCreatedEvent;
//# sourceMappingURL=space-configuration.events.js.map