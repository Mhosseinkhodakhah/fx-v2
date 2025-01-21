import { Test, TestingModule } from '@nestjs/testing';
import { TransActionController } from './trans-action.controller';
import { TransActionService } from './trans-action.service';

describe('TransActionController', () => {
  let controller: TransActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransActionController],
      providers: [TransActionService],
    }).compile();

    controller = module.get<TransActionController>(TransActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
