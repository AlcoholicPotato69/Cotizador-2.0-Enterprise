"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulationsModule = void 0;
const common_1 = require("@nestjs/common");
const regulations_service_1 = require("./regulations.service");
const prisma_module_1 = require("../prisma/prisma.module");
const regulations_controller_1 = require("./regulations.controller");
let RegulationsModule = class RegulationsModule {
};
exports.RegulationsModule = RegulationsModule;
exports.RegulationsModule = RegulationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [regulations_controller_1.RegulationsController],
        providers: [regulations_service_1.RegulationsService],
        exports: [regulations_service_1.RegulationsService],
    })
], RegulationsModule);
//# sourceMappingURL=regulations.module.js.map