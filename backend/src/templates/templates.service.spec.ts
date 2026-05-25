import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { tenantContext } from '../prisma/tenant-context';
import { ConflictException } from '@nestjs/common';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
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

    service = module.get<TemplatesService>(TemplatesService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('createTemplate should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.createTemplate({ name: 'Template 1', content: 'Content' }),
    ).rejects.toThrow(ConflictException);
  });

  it('createTemplate should create template, version and emit event', async () => {
    jest
      .spyOn(tenantContext, 'getStore')
      .mockReturnValue({ tenantId: 'tenant-1' } as any);

    const mockTemplate = {
      id: 'tpl-1',
      tenantId: 'tenant-1',
      name: 'Template 1',
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      const tx = {
        $executeRaw: jest.fn(),
        contractTemplate: { create: jest.fn().mockResolvedValue(mockTemplate) },
        contractTemplateVersion: { create: jest.fn() },
      };
      return await cb(tx);
    });

    const result = await service.createTemplate({
      name: 'Template 1',
      content: 'Content',
    });

    expect(result).toEqual(mockTemplate);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'template.created',
      expect.any(Object),
    );
  });

  it('createClause should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.createClause({ title: 'Clause 1', content: 'Content' }),
    ).rejects.toThrow(ConflictException);
  });

  it('createClause should create clause, version and emit event', async () => {
    jest
      .spyOn(tenantContext, 'getStore')
      .mockReturnValue({ tenantId: 'tenant-1' } as any);

    const mockClause = { id: 'cl-1', tenantId: 'tenant-1', title: 'Clause 1' };

    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      const tx = {
        $executeRaw: jest.fn(),
        contractClause: { create: jest.fn().mockResolvedValue(mockClause) },
        clauseVersion: { create: jest.fn() },
      };
      return await cb(tx);
    });

    const result = await service.createClause({
      title: 'Clause 1',
      content: 'Content',
    });

    expect(result).toEqual(mockClause);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'clause.created',
      expect.any(Object),
    );
  });
});
