import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { storySchema } from './entities/story.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMqService } from 'src/rabbitmq/rabbitmq.service';
import { UserSchema } from 'src/user/entities/user.entity';
import { TransAction } from 'src/wallet/entities/trans-action.entity';
import { taskModel } from 'src/tasks/entities/task.entity';
import { WalletSchema } from 'src/wallet/entities/wallet.entity';
import { subScribers } from 'src/user/entities/subscribers.entity';
import { SignalSchema } from 'src/signal/entities/signal.entity';
import { Withdraw } from 'src/wallet/entities/withdraw.entity';
import { RedisHandlerService } from 'src/redis-handler/redis-handler.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://kianlucifer:Lucifer25255225@cluster0.kcuqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
  MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
    { name: 'transAction', schema: TransAction },
    { name: 'story', schema: storySchema },
    { name: 'task', schema: taskModel },
    { name: 'wallet', schema: WalletSchema },
    { name: 'subscribers', schema: subScribers },
    { name: 'signal', schema: SignalSchema },
    { name: 'withdraw', schema: Withdraw }
    ])
  ],
  controllers: [StoryController],
  providers: [StoryService , RabbitMqService , RedisHandlerService],
})
export class StoryModule { }
