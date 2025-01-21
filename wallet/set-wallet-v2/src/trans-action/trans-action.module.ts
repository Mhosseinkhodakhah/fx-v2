import { Module } from '@nestjs/common';
import { TransActionService } from './trans-action.service';
import { TransActionController } from './trans-action.controller';

@Module({
  controllers: [TransActionController],
  providers: [TransActionService],
})
export class TransActionModule {}
