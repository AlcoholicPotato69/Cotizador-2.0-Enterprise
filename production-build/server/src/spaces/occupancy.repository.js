"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupancyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OccupancyRepository = class OccupancyRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tx, data) {
        return tx.spaceOccupancy.create({ data });
    }
    async findOverlapping(tx, tenantId, spaceId, startTime, endTime) {
        return tx.spaceOccupancy.findFirst({
            where: {
                tenantId,
                spaceId,
                status: {
                    in: ['HOLD', 'RESERVED', 'CONTRACTED']
                },
                startTime: { lt: endTime },
                endTime: { gt: startTime },
            }
        });
    }
};
exports.OccupancyRepository = OccupancyRepository;
exports.OccupancyRepository = OccupancyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OccupancyRepository);
//# sourceMappingURL=occupancy.repository.js.map