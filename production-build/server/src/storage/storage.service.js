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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StorageService = class StorageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerMetadata(dto) {
        return this.prisma.storageMetadata.create({
            data: {
                tenantId: dto.tenantId,
                bucketName: dto.bucketName,
                objectKey: dto.objectKey,
                fileSize: BigInt(dto.fileSize),
                contentType: dto.contentType,
                storageClass: dto.storageClass,
                checksum: dto.checksum,
            },
        });
    }
    async getMetadata(id, tenantId) {
        const metadata = await this.prisma.storageMetadata.findUnique({
            where: {
                id,
            },
        });
        if (!metadata || metadata.tenantId !== tenantId) {
            throw new common_1.NotFoundException(`Storage metadata ${id} not found`);
        }
        return {
            ...metadata,
            fileSize: Number(metadata.fileSize),
        };
    }
    async getStorageInfo(id) {
        return { id, provider: 'S3', size: 0 };
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StorageService);
//# sourceMappingURL=storage.service.js.map