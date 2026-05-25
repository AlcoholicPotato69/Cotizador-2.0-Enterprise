import { Test, TestingModule } from '@nestjs/testing';
import { SpaceConfigurationService } from './space-configuration.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { tenantContext } from '../../prisma/tenant-context';
import { ConflictException } from '@nestjs/common';

describe('SpaceConfigurationService', () => {
  let service: SpaceConfigurationService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpaceConfigurationService,
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

    service = module.get<SpaceConfigurationService>(SpaceConfigurationService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('setConfiguration should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.setConfiguration({
        spaceId: 'space-1',
        configKey: 'KEY',
        configValue: { a: 1 },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('setConfiguration should create config and emit event', async () => {
    jest
      .spyOn(tenantContext, 'getStore')
      .mockReturnValue({ tenantId: 'tenant-1' } as any);

    const mockConfig = {
      id: 'cfg-1',
      tenantId: 'tenant-1',
      spaceId: 'space-1',
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      const tx = {
        $executeRaw: jest.fn(),
        space: { findFirst: jest.fn().mockResolvedValue({ id: 'space-1' }) },
        spaceConfiguration: { create: jest.fn().mockResolvedValue(mockConfig) },
      };
      return await cb(tx);
    });

    const result = await service.setConfiguration({
      spaceId: 'space-1',
      configKey: 'KEY',
      configValue: { a: 1 },
    });

    expect(result).toEqual(mockConfig);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'space.configuration.updated',
      expect.any(Object),
    );
  });

  it('createRule should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.createRule({
        spaceId: 'space-1',
        ruleType: 'TYPE',
        ruleDetails: {},
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('createRule should create rule and emit event', async () => {
    jest
      .spyOn(tenantContext, 'getStore')
      .mockReturnValue({ tenantId: 'tenant-1' } as any);

    const mockRule = { id: 'rule-1', tenantId: 'tenant-1', spaceId: 'space-1' };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      const tx = {
        $executeRaw: jest.fn(),
        space: { findFirst: jest.fn().mockResolvedValue({ id: 'space-1' }) },
        spaceRule: { create: jest.fn().mockResolvedValue(mockRule) },
      };
      return await cb(tx);
    });

    const result = await service.createRule({
      spaceId: 'space-1',
      ruleType: 'TYPE',
      ruleDetails: {},
    });

    expect(result).toEqual(mockRule);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'space.rule.created',
      expect.any(Object),
    );
  });
});
