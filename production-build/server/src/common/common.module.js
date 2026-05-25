"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const domain_event_publisher_1 = require("./events/domain-event-publisher");
const fsm_validator_1 = require("./fsm.validator");
const outbox_module_1 = require("./outbox/outbox.module");
const inbox_module_1 = require("./inbox/inbox.module");
const jobs_module_1 = require("./jobs/jobs.module");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            outbox_module_1.OutboxModule,
            inbox_module_1.InboxModule,
            jobs_module_1.JobsModule
        ],
        providers: [domain_event_publisher_1.DomainEventPublisher, fsm_validator_1.FsmValidator],
        exports: [
            domain_event_publisher_1.DomainEventPublisher,
            fsm_validator_1.FsmValidator,
            outbox_module_1.OutboxModule,
            inbox_module_1.InboxModule,
            jobs_module_1.JobsModule
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map