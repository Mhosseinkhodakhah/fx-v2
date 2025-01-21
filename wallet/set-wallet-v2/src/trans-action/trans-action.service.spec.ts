import { Test, TestingModule } from '@nestjs/testing';
import { TransActionService } from './trans-action.service';

describe('TransActionService', () => {
  let service: TransActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransActionService],
    }).compile();

    service = module.get<TransActionService>(TransActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
