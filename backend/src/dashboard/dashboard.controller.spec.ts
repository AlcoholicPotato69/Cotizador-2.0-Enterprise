import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(() => {
    const dashboardServiceMock: Partial<DashboardService> = {
      getMetrics: jest.fn(),
    };

    controller = new DashboardController(
      dashboardServiceMock as DashboardService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
