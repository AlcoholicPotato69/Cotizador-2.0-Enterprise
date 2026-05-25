import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('StorageService', () => {
  let service: StorageService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: PrismaService,
          useValue: {
            storageMetadata: {
              create: jest
                .fn()
                .mockImplementation(({ data }) =>
                  Promise.resolve({ id: 'meta-1', ...data }),
                ),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register metadata', async () => {
    const dto = {
      tenantId: 'tenant-1',
      bucketName: 'bucket-1',
      objectKey: 'key-1',
      fileSize: 100,
      contentType: 'text/plain',
    };

    const result = await service.registerMetadata(dto);
    expect(result.id).toBe('meta-1');
    expect(result.bucketName).toBe('bucket-1');
    expect(result.fileSize).toBe(BigInt(100));
  });

  it('should get metadata', async () => {
    (prisma.storageMetadata.findUnique as jest.Mock).mockResolvedValue({
      id: 'meta-1',
      tenantId: 'tenant-1',
      fileSize: BigInt(100),
    });

    const result = await service.getMetadata('meta-1', 'tenant-1');
    expect(result.id).toBe('meta-1');
    expect(result.fileSize).toBe(100);
  });

  it('should throw NotFoundException if tenant mismatch', async () => {
    (prisma.storageMetadata.findUnique as jest.Mock).mockResolvedValue({
      id: 'meta-1',
      tenantId: 'tenant-2',
      fileSize: BigInt(100),
    });

    await expect(service.getMetadata('meta-1', 'tenant-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
