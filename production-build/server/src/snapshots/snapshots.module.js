"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsModule = void 0;
const common_1 = require("@nestjs/common");
const snapshots_service_1 = require("./snapshots.service");
const snapshots_repository_1 = require("./snapshots.repository");
const snapshots_listener_1 = require("./snapshots.listener");
const prisma_module_1 = require("../prisma/prisma.module");
let SnapshotsModule = class SnapshotsModule {
};
exports.SnapshotsModule = SnapshotsModule;
exports.SnapshotsModule = SnapshotsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [snapshots_repository_1.SnapshotsRepository, snapshots_service_1.SnapshotsService, snapshots_listener_1.SnapshotsListener],
        exports: [snapshots_repository_1.SnapshotsRepository, snapshots_service_1.SnapshotsService],
    })
], SnapshotsModule);
//# sourceMappingURL=snapshots.module.js.map