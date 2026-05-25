"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCreditsModule = void 0;
const common_1 = require("@nestjs/common");
const customer_credits_service_1 = require("./customer-credits.service");
const customer_credits_controller_1 = require("./customer-credits.controller");
const customer_credits_repository_1 = require("./customer-credits.repository");
const customer_credits_listener_1 = require("./customer-credits.listener");
const prisma_module_1 = require("../prisma/prisma.module");
let CustomerCreditsModule = class CustomerCreditsModule {
};
exports.CustomerCreditsModule = CustomerCreditsModule;
exports.CustomerCreditsModule = CustomerCreditsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [customer_credits_controller_1.CustomerCreditsController],
        providers: [customer_credits_service_1.CustomerCreditsService, customer_credits_repository_1.CustomerCreditsRepository, customer_credits_listener_1.CustomerCreditsListener],
        exports: [customer_credits_service_1.CustomerCreditsService, customer_credits_repository_1.CustomerCreditsRepository],
    })
], CustomerCreditsModule);
//# sourceMappingURL=customer-credits.module.js.map