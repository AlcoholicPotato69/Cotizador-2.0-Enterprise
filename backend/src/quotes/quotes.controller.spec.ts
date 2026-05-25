import { Test, TestingModule } from '@nestjs/testing';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('QuotesController', () => {
  let controller: QuotesController;
  let service: QuotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        {
          provide: QuotesService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'quote-1' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<QuotesController>(QuotesController);
    service = module.get<QuotesService>(QuotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a quote', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin' },
    } as unknown as Request;
    await expect(
      controller.createQuote(req as any, { clientId: 'client-1' }),
    ).resolves.toEqual({ id: 'quote-1' });
    expect(service.create).toHaveBeenCalledWith({ clientId: 'client-1' });
  });
});
