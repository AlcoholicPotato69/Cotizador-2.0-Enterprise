import { Test, TestingModule } from '@nestjs/testing';
import { AgendaService } from './agenda.service';
import { PrismaService } from '../prisma/prisma.service';
import { tenantContext } from '../prisma/tenant-context';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { OccupancyStatus } from '@prisma/client';

describe('AgendaService', () => {
  let service: AgendaService;
  let prisma: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    spaceOccupancy: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AgendaService>(AgendaService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('reserve', () => {
    it('should throw NotFoundException if tenant context is missing', async () => {
      await expect(
        service.reserve({
          spaceId: '1',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 10000).toISOString(),
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if startTime >= endTime', async () => {
      await new Promise<void>((resolve, reject) => {
        tenantContext.run({ tenantId: 'tenant1' }, async () => {
          try {
            await expect(
              service.reserve({
                spaceId: '1',
                startTime: '2026-05-24T11:00:00Z',
                endTime: '2026-05-24T10:00:00Z',
              }),
            ).rejects.toThrow(BadRequestException);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
    });

    it('should create reservation if no overlap', async () => {
      const mockTx = {
        spaceOccupancy: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 'res1' }),
        },
      };
      mockPrismaService.$transaction.mockImplementation(async (cb) => {
        return cb(mockTx);
      });

      await new Promise<void>((resolve, reject) => {
        tenantContext.run({ tenantId: 'tenant1' }, async () => {
          try {
            const res = await service.reserve({
              spaceId: '1',
              startTime: '2026-05-24T10:00:00Z',
              endTime: '2026-05-24T11:00:00Z',
            });
            expect(res).toEqual({ id: 'res1' });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
    });

    it('should throw ConflictException if overlap exists', async () => {
      const mockTx = {
        spaceOccupancy: {
          findFirst: jest.fn().mockResolvedValue({ id: 'overlap1' }),
        },
      };
      mockPrismaService.$transaction.mockImplementation(async (cb) => {
        return cb(mockTx);
      });

      await new Promise<void>((resolve, reject) => {
        tenantContext.run({ tenantId: 'tenant1' }, async () => {
          try {
            await expect(
              service.reserve({
                spaceId: '1',
                startTime: '2026-05-24T10:00:00Z',
                endTime: '2026-05-24T11:00:00Z',
              }),
            ).rejects.toThrow(ConflictException);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
    });
  });

  describe('reschedule', () => {
    it('should reschedule reservation if no overlap', async () => {
      const mockTx = {
        spaceOccupancy: {
          findFirst: jest
            .fn()
            .mockResolvedValueOnce({
              id: 'res1',
              spaceId: '1',
              status: OccupancyStatus.RESERVED,
            })
            .mockResolvedValueOnce(null),
          update: jest.fn().mockResolvedValue({
            id: 'res1',
            startTime: '2026-05-24T12:00:00Z',
          }),
        },
      };
      mockPrismaService.$transaction.mockImplementation(async (cb) => {
        return cb(mockTx);
      });

      await new Promise<void>((resolve, reject) => {
        tenantContext.run({ tenantId: 'tenant1' }, async () => {
          try {
            const res = await service.reschedule('res1', {
              startTime: '2026-05-24T12:00:00Z',
              endTime: '2026-05-24T13:00:00Z',
            });
            expect(res).toEqual({
              id: 'res1',
              startTime: '2026-05-24T12:00:00Z',
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
    });
  });

  describe('release', () => {
    it('should release a reservation', async () => {
      mockPrismaService.spaceOccupancy.findFirst.mockResolvedValue({
        id: 'res1',
        status: OccupancyStatus.RESERVED,
      });
      mockPrismaService.spaceOccupancy.update.mockResolvedValue({
        id: 'res1',
        status: OccupancyStatus.RELEASED,
      });

      await new Promise<void>((resolve, reject) => {
        tenantContext.run({ tenantId: 'tenant1' }, async () => {
          try {
            const res = await service.release('res1');
            expect(res).toEqual({
              id: 'res1',
              status: OccupancyStatus.RELEASED,
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
    });
  });
});
