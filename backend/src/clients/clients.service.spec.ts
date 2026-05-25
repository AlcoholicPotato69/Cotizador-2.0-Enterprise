import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';

describe('ClientsService', () => {
  let service: ClientsService;
  let repo: ClientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: ClientsRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'client-1' }),
            findById: jest.fn().mockResolvedValue({ id: 'client-1' }),
            update: jest.fn().mockResolvedValue({ id: 'client-1' }),
          },
        },
        {
          provide: DomainEventPublisher,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repo = module.get<ClientsRepository>(ClientsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a client using tenant context', async () => {
    await tenantContext.run(
      { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
      async () => {
        const res = await service.create({ name: 'Test' });
        expect(res).toEqual({ id: 'client-1' });
        expect(repo.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test',
            tenant: { connect: { id: 'tenant-1' } },
          }),
        );
      },
    );
  });

  it('should throw if no tenant context', async () => {
    await expect(service.create({ name: 'Test' })).rejects.toThrow(
      'Tenant context missing',
    );
  });
});
