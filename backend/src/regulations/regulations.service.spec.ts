import { Test, TestingModule } from '@nestjs/testing';
import { RegulationsService } from './regulations.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { tenantContext } from '../prisma/tenant-context';
import { ConflictException } from '@nestjs/common';

describe('RegulationsService', () => {
  let service: RegulationsService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegulationsService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegulationsService>(RegulationsService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('createRegulation should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.createRegulation({ title: 'Reg 1', content: 'Content' }),
    ).rejects.toThrow(ConflictException);
  });

  it('createRegulation should create regulation, version and emit event', async () => {
    jest
      .spyOn(tenantContext, 'getStore')
      .mockReturnValue({ tenantId: 'tenant-1' } as any);

    const mockRegulation = {
      id: 'reg-1',
      tenantId: 'tenant-1',
      title: 'Reg 1',
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      const tx = {
        $executeRaw: jest.fn(),
        regulation: { create: jest.fn().mockResolvedValue(mockRegulation) },
        regulationVersion: { create: jest.fn() },
      };
      return await cb(tx);
    });

    const result = await service.createRegulation({
      title: 'Reg 1',
      content: 'Content',
    });

    expect(result).toEqual(mockRegulation);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'regulation.created',
      expect.any(Object),
    );
  });

  it('acceptRegulation should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.acceptRegulation({
        regulationId: 'reg-1',
        acceptedBy: 'user-1',
        version: '1.0',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('acceptRegulation should create acceptance record and emit event', async () => {
    jest
      .spyOn(tenantContext, 'getStore')
      .mockReturnValue({ tenantId: 'tenant-1' } as any);

    const mockAcceptance = {
      id: 'acc-1',
      tenantId: 'tenant-1',
      regulationId: 'reg-1',
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      const tx = {
        $executeRaw: jest.fn(),
        regulation: { findFirst: jest.fn().mockResolvedValue({ id: 'reg-1' }) },
        regulationAcceptance: {
          create: jest.fn().mockResolvedValue(mockAcceptance),
        },
      };
      return await cb(tx);
    });

    const result = await service.acceptRegulation({
      regulationId: 'reg-1',
      acceptedBy: 'user-1',
      version: '1.0',
    });

    expect(result).toEqual(mockAcceptance);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'regulation.accepted',
      expect.any(Object),
    );
  });
});
