"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesModule = void 0;
const common_1 = require("@nestjs/common");
const availability_service_1 = require("./availability.service");
const spaces_repository_1 = require("./spaces.repository");
const occupancy_repository_1 = require("./occupancy.repository");
const prisma_module_1 = require("../prisma/prisma.module");
const common_module_1 = require("../common/common.module");
const space_configuration_service_1 = require("./configuration/space-configuration.service");
const space_configuration_controller_1 = require("./configuration/space-configuration.controller");
const spaces_service_1 = require("./spaces.service");
const spaces_controller_1 = require("./spaces.controller");
const occupancy_service_1 = require("./occupancy.service");
const occupancy_controller_1 = require("./occupancy.controller");
let SpacesModule = class SpacesModule {
};
exports.SpacesModule = SpacesModule;
exports.SpacesModule = SpacesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, common_module_1.CommonModule],
        controllers: [space_configuration_controller_1.SpaceConfigurationController, spaces_controller_1.SpacesController, occupancy_controller_1.OccupancyController],
        providers: [
            spaces_repository_1.SpacesRepository,
            occupancy_repository_1.OccupancyRepository,
            availability_service_1.AvailabilityEngineService,
            space_configuration_service_1.SpaceConfigurationService,
            spaces_service_1.SpacesService,
            occupancy_service_1.OccupancyService
        ],
        exports: [
            spaces_repository_1.SpacesRepository,
            occupancy_repository_1.OccupancyRepository,
            availability_service_1.AvailabilityEngineService,
            space_configuration_service_1.SpaceConfigurationService,
            spaces_service_1.SpacesService,
            occupancy_service_1.OccupancyService
        ],
    })
], SpacesModule);
//# sourceMappingURL=spaces.module.js.map