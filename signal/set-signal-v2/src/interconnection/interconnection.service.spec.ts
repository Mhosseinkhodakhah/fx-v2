import { Test, TestingModule } from '@nestjs/testing';
import { InterconnectionService } from './interconnection.service';

describe('InterconnectionService', () => {
  let service: InterconnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterconnectionService],
    }).compile();

    service = module.get<InterconnectionService>(InterconnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
