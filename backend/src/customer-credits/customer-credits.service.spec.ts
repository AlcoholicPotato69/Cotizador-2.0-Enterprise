import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCreditsService } from './customer-credits.service';
import { CustomerCreditsRepository } from './customer-credits.repository';

describe('CustomerCreditsService', () => {
  let service: CustomerCreditsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerCreditsService,
        { provide: CustomerCreditsRepository, useValue: {} },
        { provide: 'EventEmitter', useValue: {} },
        {
          provide: require('@nestjs/event-emitter').EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CustomerCreditsService>(CustomerCreditsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
