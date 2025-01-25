import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Withdraw } from './entities/withdraw.entity';
import { TransAction } from './entities/trans-action.entity';
import { WalletSchema } from './entities/wallet.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMqService } from 'src/rabbitmq/rabbitmq.service';
import { UserSchema } from 'src/user/entities/user.entity';
import { storySchema } from 'src/story/entities/story.entity';
import { taskModel } from 'src/tasks/entities/task.entity';
import { subScribers } from 'src/user/entities/subscribers.entity';
import { SignalSchema } from 'src/signal/entities/signal.entity';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
  MongooseModule.forFeature([
    { name: 'user', schema: UserSchema },
  { name: 'transAction', schema: TransAction },
  { name: 'story', schema: storySchema },
  { name: 'task', schema: taskModel },
  { name: 'wallet', schema: WalletSchema },
  { name: 'subscribers', schema: subScribers },
  { name: 'signal', schema: SignalSchema },
  { name: 'withdraw', schema: Withdraw }
  ])],
  controllers: [WalletController],
  providers: [WalletService, RabbitMqService],
})
export class WalletModule { }
