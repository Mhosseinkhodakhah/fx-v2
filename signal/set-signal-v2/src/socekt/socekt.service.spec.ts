import { Test, TestingModule } from '@nestjs/testing';
import { SocektService } from './socekt.service';

describe('SocektService', () => {
  let service: SocektService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocektService],
    }).compile();

    service = module.get<SocektService>(SocektService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
