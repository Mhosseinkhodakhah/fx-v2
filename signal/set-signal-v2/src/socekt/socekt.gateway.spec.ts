import { Test, TestingModule } from '@nestjs/testing';
import { SocektGateway } from './socekt.gateway';
import { SocektService } from './socekt.service';

describe('SocektGateway', () => {
  let gateway: SocektGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocektGateway, SocektService],
    }).compile();

    gateway = module.get<SocektGateway>(SocektGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
